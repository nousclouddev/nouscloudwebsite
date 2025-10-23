# CourseAdmin Participants API

## API Endpoint

The courseadmin page calls this API to get participant details:

**Base URL:** `https://ycwwkk23x7.execute-api.ap-south-1.amazonaws.com/prod`

**Endpoint:** `GET /participants/{courseId}`

**Full URL Example:**
```
https://ycwwkk23x7.execute-api.ap-south-1.amazonaws.com/prod/participants/agenticai-fundamentals-20251007125327
```

## Authentication

The API requires **Cognito authentication** (JWT token in Authorization header).

From the code:
```typescript
const session = await fetchAuthSession();
const token = session.tokens?.idToken?.toString();

const response = await fetch(url, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## Response Format

```json
{
  "count": 2,
  "participants": [
    {
      "email": "user@example.com",
      "course_id": "agenticai-fundamentals-20251007125327",
      "name": "User Name",
      "phone": "1234567890",
      "payment_status": "completed",
      "razorpay_order_id": "order_N12a34B",
      "razorpay_payment_id": "pay_N12a34B",
      "amount": 499,
      "course_name": "AgenticAI Fundamentals",
      "date": "2025-11-01",
      "time": "10:00 AM",
      "duration": "2 hours",
      "webinar_name": "AgenticAI Fundamentals",
      "created_at": "2025-10-22T18:30:00.000Z",
      "payment_verified_at": "2025-10-22T18:35:00.000Z",
      "location": "City",
      "role": "Engineer"
    }
  ]
}
```

## Implementation Location

**File:** `courseadmin/src/api.ts`

**Function:**
```typescript
export async function getParticipants(courseId: string): Promise<Participant[]> {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();
  
  const url = `${PARTICIPANTS_API_BASE}/participants/${courseId}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  const result = await response.json();
  
  if (result && Array.isArray(result.participants)) {
    return result.participants;
  }
  
  return [];
}
```

## Used In

**Component:** `courseadmin/src/components/Participants.tsx`

**Usage:**
```typescript
useEffect(() => {
  async function load() {
    if (!courseId) return;
    try {
      const data = await getParticipants(courseId);
      setParticipants(data);
    } catch (error) {
      console.error('Failed to fetch participants', error);
      setParticipants([]);
    }
  }
  load();
}, [courseId]);
```

## Navigation

From the Admin page, clicking "Participant Details" button navigates to:
```
/participants/{courseId}
```

Example:
```
/participants/agenticai-fundamentals-20251007125327
```

## Backend Handler

This endpoint is handled by the Lambda function in `webinarreg`:

**Function:** `webinarreg-prod-getParticipants`

**Handler:** `handler.get_participants`

**Code Location:** `webinarreg/handler.py`

```python
def get_participants(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """Return participants and count for the given course_id."""
    course_id = (event.get("pathParameters") or {}).get("course_id")
    if not course_id:
        return {
            "statusCode": 400,
            "body": json.dumps({"message": "course_id is required"}),
            "headers": {"Access-Control-Allow-Origin": "*"},
        }

    filter_expr = Attr("course_id").eq(course_id)
    response = table.scan(FilterExpression=filter_expr)
    items = response.get("Items", [])
    while "LastEvaluatedKey" in response:
        response = table.scan(
            FilterExpression=filter_expr, ExclusiveStartKey=response["LastEvaluatedKey"]
        )
        items.extend(response.get("Items", []))

    return {
        "statusCode": 200,
        "body": json.dumps({"count": len(items), "participants": items}),
        "headers": {"Access-Control-Allow-Origin": "*"},
    }
```

## DynamoDB Table

**Table Name:** `participants`

**Primary Key:**
- Partition Key: `email` (String)
- Sort Key: `course_id` (String)

**Query Pattern:**
The handler scans the table with a filter on `course_id` to get all participants for a specific course.

## Participant Fields

Based on the registration flow, each participant record contains:

### Required Fields
- `email` - Participant email
- `course_id` - Course identifier
- `name` - Participant name
- `phone` - Participant phone number
- `amount` - Course price (0 for free courses)
- `payment_status` - "pending" or "completed"

### Course Details
- `course_name` - Name of the course
- `date` - Course date
- `time` - Course time
- `duration` - Course duration
- `webinar_name` - Webinar name

### Payment Details (for paid courses)
- `razorpay_order_id` - Razorpay order ID
- `razorpay_payment_id` - Razorpay payment ID (after verification)
- `receipt` - Unique receipt identifier

### Optional Fields
- `location` - Participant location
- `role` - Participant role

### Timestamps
- `created_at` - Registration timestamp
- `payment_verified_at` - Payment verification timestamp (for paid courses)

## Summary

**API:** `GET https://ycwwkk23x7.execute-api.ap-south-1.amazonaws.com/prod/participants/{courseId}`

**Authentication:** Cognito JWT token (Authorization header)

**Backend:** Lambda function `webinarreg-prod-getParticipants`

**Database:** DynamoDB table `participants`

**Frontend:** Used in `courseadmin/src/components/Participants.tsx`
