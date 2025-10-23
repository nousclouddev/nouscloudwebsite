# Fix Decimal Serialization Issue

## Problem
The `get_participants` endpoint was returning error:
```
TypeError: Object of type Decimal is not JSON serializable
```

## Root Cause
DynamoDB stores numbers as `Decimal` type (from Python's decimal module). When trying to serialize these to JSON, Python's `json.dumps()` fails because it doesn't know how to handle Decimal objects.

## Solution
Added a helper function `decimal_to_number()` that recursively converts:
- `Decimal` → `int` (if whole number) or `float` (if decimal)
- Handles nested lists and dictionaries

## What Was Changed

### Added Helper Function
```python
def decimal_to_number(obj):
    """Convert Decimal objects to int or float for JSON serialization."""
    if isinstance(obj, list):
        return [decimal_to_number(item) for item in obj]
    elif isinstance(obj, dict):
        return {key: decimal_to_number(value) for key, value in obj.items()}
    elif isinstance(obj, Decimal):
        if obj % 1 == 0:
            return int(obj)
        else:
            return float(obj)
    else:
        return obj
```

### Updated get_participants Function
```python
# Convert Decimal objects before JSON serialization
items = decimal_to_number(items)

return {
    "statusCode": 200,
    "body": json.dumps({"count": len(items), "participants": items}),
    "headers": {"Access-Control-Allow-Origin": "*"},
}
```

## Files Modified
- ✅ `handler.py` - Added `decimal_to_number()` helper and updated `get_participants()`

## Deploy the Fix

### Commit and Push
```bash
cd ../webinarreg
git add handler.py
git commit -m "Fix Decimal serialization in get_participants endpoint"
git push origin main
```

### Monitor Deployment
Go to: https://github.com/nousclouddev/webinarreg/actions

### Test After Deployment
```bash
# Test the participants endpoint
curl -X GET "https://ycwwkk23x7.execute-api.ap-south-1.amazonaws.com/prod/participants/YOUR_COURSE_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Or test in courseadmin:
1. Go to courseadmin
2. Click on a course
3. Click "Participant Details"
4. Should now load without errors

## Expected Result

### Before (Error):
```json
{
  "message": "Internal server error"
}
```

### After (Success):
```json
{
  "count": 2,
  "participants": [
    {
      "email": "user@example.com",
      "course_id": "course-123",
      "name": "User Name",
      "phone": "1234567890",
      "amount": 499,
      "payment_status": "completed"
    }
  ]
}
```

## Why This Happens

DynamoDB uses `Decimal` for all numeric types to maintain precision. When you store:
```python
{
  "amount": 499,
  "max_participants": 50
}
```

DynamoDB returns:
```python
{
  "amount": Decimal('499'),
  "max_participants": Decimal('50')
}
```

Python's `json.dumps()` can't serialize `Decimal` objects, so we need to convert them first.

## Quick Deploy

```bash
cd ../webinarreg && git add handler.py && git commit -m "Fix Decimal serialization" && git push origin main
```

Then wait 3-5 minutes for GitHub Actions to deploy, and test the participants endpoint!
