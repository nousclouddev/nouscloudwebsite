# Frontend Changes for Razorpay Integration

## Updated Files

### 1. CourseRegistrationForm.tsx

#### Key Changes:

**Added Razorpay Integration:**
- Dynamically loads Razorpay checkout script for paid courses
- Handles both free and paid course registrations
- Implements payment verification flow

**New Flow for Paid Courses:**
1. User fills registration form
2. Calls `/register` API endpoint
3. Receives `order_id` and `razorpay_key` from backend
4. Opens Razorpay checkout modal
5. After successful payment, calls `/verify-payment` endpoint
6. Shows success message and confirmation email is sent

**New Flow for Free Courses:**
1. User fills registration form
2. Calls `/register` API endpoint
3. Shows success message immediately
4. Confirmation email is sent

#### New Features:
- `isSubmitting` state to prevent double submissions
- `verifyPayment()` function to verify Razorpay payment
- `openRazorpayCheckout()` function to initialize Razorpay
- Dynamic button text: "Register" for free, "Proceed to Payment" for paid
- Better error handling with toast notifications

## API Endpoints Used

### Registration Endpoint
**URL:** `https://ycwwkk23x7.execute-api.ap-south-1.amazonaws.com/prod/register`
**Method:** POST
**Headers:**
- Content-Type: application/json
- x-api-key: PGrUWFrsgk5QxhzbBL9622BHtWaST5DR9cvQXHVO

**Request Body:**
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "phone": "1234567890",
  "course_name": "Course Name",
  "course_id": "course-id-123",
  "amount": 499,
  "date": "2025-11-01",
  "time": "10:00 AM",
  "duration": "2 hours",
  "webinar_name": "Course Name"
}
```

**Response (Paid Course):**
```json
{
  "message": "Registration successful. Please complete payment.",
  "order_id": "order_N12a34B5cD6eF",
  "razorpay_key": "rzp_test_xxxxxxxxxxxxx",
  "amount": 499,
  "email": "user@example.com",
  "name": "User Name",
  "phone": "1234567890"
}
```

### Payment Verification Endpoint
**URL:** `https://ycwwkk23x7.execute-api.ap-south-1.amazonaws.com/prod/verify-payment`
**Method:** POST
**Headers:**
- Content-Type: application/json
- x-api-key: PGrUWFrsgk5QxhzbBL9622BHtWaST5DR9cvQXHVO

**Request Body:**
```json
{
  "razorpay_order_id": "order_N12a34B5cD6eF",
  "razorpay_payment_id": "pay_N12a34B5cD6eF",
  "razorpay_signature": "signature_hash",
  "email": "user@example.com",
  "course_id": "course-id-123"
}
```

**Response:**
```json
{
  "message": "Payment verified successfully. Registration confirmed."
}
```

## Testing

### Test Free Course Registration:
1. Click "Register Now" on a free course
2. Fill in the form
3. Complete captcha
4. Click "Register"
5. Should see success message immediately

### Test Paid Course Registration:
1. Click "Pay & Register" on a paid course
2. Fill in the form
3. Complete captcha
4. Click "Proceed to Payment"
5. Razorpay checkout modal should open
6. Complete payment (use test card: 4111 1111 1111 1111)
7. After payment, verification happens automatically
8. Should see success message

## Environment Setup

No additional environment variables needed in frontend. The Razorpay script is loaded dynamically from CDN.

## Notes

- Razorpay script is only loaded for paid courses (performance optimization)
- Payment verification happens automatically after successful payment
- User-friendly error messages for all failure scenarios
- Form resets after successful registration
- Captcha resets after submission
