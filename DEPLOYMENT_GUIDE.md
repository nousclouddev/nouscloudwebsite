# Deployment Guide - Razorpay Integration

## Changes Made

### 1. Handler Updates
- ✅ Updated `handler.py` to load Razorpay credentials from AWS Secrets Manager
- ✅ Added `get_razorpay_credentials()` function for lazy loading
- ✅ Removed dependency on environment variables

### 2. Serverless Configuration
- ✅ Updated `serverless.yml` to remove `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` env vars
- ✅ Added Secrets Manager permission for Razorpay secret ARN
- ✅ Secret ARN: `arn:aws:secretsmanager:ap-south-1:842609633704:secret:/payment/nosucloud/razorpayapi-2rd1qi`

## AWS Secrets Manager Setup

### Expected Secret Format
The Razorpay secret should contain the following JSON structure:

```json
{
  "key_id": "rzp_test_xxxxxxxxxxxxx",
  "key_secret": "your_razorpay_key_secret"
}
```

**Alternative field names supported:**
- `RAZORPAY_KEY_ID` or `razorpay_key_id` for key_id
- `RAZORPAY_KEY_SECRET` or `razorpay_key_secret` for key_secret

### Verify Secret Exists
```bash
aws secretsmanager get-secret-value \
  --secret-id /payment/nosucloud/razorpayapi \
  --region ap-south-1
```

### Create/Update Secret (if needed)
```bash
aws secretsmanager create-secret \
  --name /payment/nosucloud/razorpayapi \
  --description "Razorpay API credentials for NousCloud" \
  --secret-string '{"key_id":"rzp_test_xxxxx","key_secret":"your_secret"}' \
  --region ap-south-1
```

Or update existing:
```bash
aws secretsmanager update-secret \
  --secret-id /payment/nosucloud/razorpayapi \
  --secret-string '{"key_id":"rzp_test_xxxxx","key_secret":"your_secret"}' \
  --region ap-south-1
```

## Deployment Steps

### 1. Navigate to webinarreg folder
```bash
cd ../webinarreg
```

### 2. Install dependencies (if not already done)
```bash
pip install -r requirements.txt
```

### 3. Deploy to AWS
```bash
npx serverless deploy --stage prod --region ap-south-1
```

Or using serverless CLI:
```bash
serverless deploy --stage prod --region ap-south-1
```

### 4. Verify Deployment
After deployment, you should see:
- ✅ API Gateway endpoints created
- ✅ Lambda functions deployed
- ✅ DynamoDB table created/updated
- ✅ IAM roles configured

## Testing

### Test Registration Endpoint
```bash
curl -X POST https://your-api-url/prod/register \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{
    "email": "test@example.com",
    "course_id": "test-course-123",
    "name": "Test User",
    "phone": "1234567890",
    "amount": 499,
    "course_name": "Test Course",
    "date": "2025-11-01",
    "time": "10:00 AM",
    "duration": "2 hours",
    "webinar_name": "Test Course"
  }'
```

Expected response:
```json
{
  "message": "Registration successful. Please complete payment.",
  "order_id": "order_xxxxx",
  "razorpay_key": "rzp_test_xxxxx",
  "amount": 499,
  "email": "test@example.com",
  "name": "Test User",
  "phone": "1234567890"
}
```

## Troubleshooting

### Error: "Razorpay credentials not found in secret"
- Check that the secret exists in AWS Secrets Manager
- Verify the secret contains `key_id` and `key_secret` fields
- Ensure the Lambda function has permission to access the secret

### Error: "Access Denied" when accessing secret
- Verify IAM role has `secretsmanager:GetSecretValue` permission
- Check the secret ARN matches in serverless.yml

### Error: "Cannot resolve variable at provider.environment"
- This error should now be fixed as we removed the env variables
- If you still see it, ensure you're using the updated serverless.yml

## Rollback

If you need to rollback:
```bash
serverless remove --stage prod --region ap-south-1
```

Then redeploy the previous version.

## Security Notes

- ✅ Razorpay credentials are stored securely in AWS Secrets Manager
- ✅ No sensitive data in code or environment variables
- ✅ IAM permissions follow least privilege principle
- ✅ API endpoints protected with API Key authentication
- ✅ Payment signature verification implemented

## Next Steps

1. Test the deployment with test Razorpay credentials
2. Switch to live Razorpay credentials when ready for production
3. Monitor CloudWatch logs for any errors
4. Set up CloudWatch alarms for failed payments
5. Consider adding webhook handler for payment status updates
