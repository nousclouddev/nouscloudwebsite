# Deploy Now - Quick Guide

## What Was Fixed

✅ **Free courses** - Now handled separately, no Razorpay order creation
✅ **Paid courses** - Improved error handling and logging
✅ **Error messages** - Detailed logs in CloudWatch for debugging
✅ **Secret loading** - Better error messages if Razorpay credentials fail

## Deploy Steps

### 1. Verify Razorpay Secret (IMPORTANT!)

```bash
aws secretsmanager get-secret-value \
  --secret-id /payment/nosucloud/razorpayapi \
  --region ap-south-1 \
  --query SecretString \
  --output text
```

**Must return:**
```json
{"key_id":"rzp_test_xxxxx","key_secret":"your_secret"}
```

**If not, create/update it:**
```bash
aws secretsmanager put-secret-value \
  --secret-id /payment/nosucloud/razorpayapi \
  --secret-string '{"key_id":"YOUR_RAZORPAY_KEY_ID","key_secret":"YOUR_RAZORPAY_SECRET"}' \
  --region ap-south-1
```

### 2. Deploy Lambda Function

```bash
cd ../webinarreg
npx serverless deploy --stage prod --region ap-south-1
```

### 3. Test Free Course

Try registering for a free course (price = 0):
- Should complete immediately
- Should receive email confirmation
- No Razorpay checkout

### 4. Test Paid Course

Try registering for a paid course (price > 0):
- Should open Razorpay checkout
- Use test card: 4111 1111 1111 1111
- Should complete payment
- Should receive email confirmation

### 5. If Errors Occur

Check CloudWatch logs:
```bash
aws logs tail /aws/lambda/webinarreg-prod-register --follow --region ap-south-1
```

Look for these messages:
- "Loading Razorpay credentials from..."
- "Razorpay client initialized successfully"
- "Creating Razorpay order for..."
- "Razorpay order created: order_xxxxx"

## Expected Behavior

### Free Course (amount = 0):
1. User fills form
2. Clicks "Register"
3. ✅ Success message immediately
4. ✅ Email sent
5. ✅ DynamoDB record: `payment_status: "completed"`

### Paid Course (amount > 0):
1. User fills form
2. Clicks "Proceed to Payment"
3. ✅ Razorpay order created
4. ✅ Razorpay checkout opens
5. User completes payment
6. ✅ Payment verified
7. ✅ Email sent
8. ✅ DynamoDB record: `payment_status: "completed"`

## Troubleshooting

### Error: "Internal server error"
- Check CloudWatch logs for detailed error
- Verify Razorpay secret exists and has correct format
- See TROUBLESHOOTING_PAID_COURSES.md

### Error: "Razorpay credentials not found"
- Secret doesn't exist or has wrong field names
- Must have `key_id` and `key_secret` fields

### Error: "Access Denied"
- Lambda doesn't have permission to access secret
- Check serverless.yml IAM permissions

## Files Modified

- ✅ `../webinarreg/handler.py` - Added free course handling + better logging
- ✅ `../webinarreg/serverless.yml` - Already updated with correct permissions

## Ready to Deploy!

Run this command:
```bash
cd ../webinarreg && npx serverless deploy --stage prod --region ap-south-1
```

Then test both free and paid courses on your website.
