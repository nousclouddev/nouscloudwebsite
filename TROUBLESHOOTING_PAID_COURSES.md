# Troubleshooting Guide - Paid Course Registration Error

## Issue
When clicking "Pay & Register" for paid courses, getting "Internal server error"

## Root Cause Analysis
The error occurs when the Lambda function tries to create a Razorpay order. Possible causes:

1. **Razorpay secret not configured correctly in AWS Secrets Manager**
2. **Lambda doesn't have permission to access the secret**
3. **Razorpay credentials are invalid or in wrong format**
4. **Razorpay API error**

## Solution Steps

### Step 1: Verify Razorpay Secret Exists

Run this command to check if the secret exists:
```bash
aws secretsmanager get-secret-value \
  --secret-id /payment/nosucloud/razorpayapi \
  --region ap-south-1 \
  --query SecretString \
  --output text
```

**Expected output:**
```json
{"key_id":"rzp_test_xxxxx","key_secret":"your_secret_here"}
```

### Step 2: Verify Secret Format

The secret MUST contain these fields (case-sensitive):
- `key_id` - Your Razorpay Key ID (starts with `rzp_test_` or `rzp_live_`)
- `key_secret` - Your Razorpay Key Secret

**Alternative field names supported:**
- `RAZORPAY_KEY_ID` or `razorpay_key_id` instead of `key_id`
- `RAZORPAY_KEY_SECRET` or `razorpay_key_secret` instead of `key_secret`

### Step 3: Update Secret if Needed

If the secret doesn't exist or has wrong format:

```bash
aws secretsmanager put-secret-value \
  --secret-id /payment/nosucloud/razorpayapi \
  --secret-string '{"key_id":"rzp_test_YOUR_KEY","key_secret":"YOUR_SECRET"}' \
  --region ap-south-1
```

### Step 4: Deploy Updated Handler

The handler now has improved error logging. Deploy it:

```bash
cd ../webinarreg
npx serverless deploy --stage prod --region ap-south-1
```

### Step 5: Test Registration

After deployment, try registering for a paid course again.

### Step 6: Check CloudWatch Logs

If still getting errors, check the logs:

```bash
# Get recent logs
aws logs tail /aws/lambda/webinarreg-prod-register --follow --region ap-south-1
```

Or in AWS Console:
1. Go to CloudWatch → Log groups
2. Find `/aws/lambda/webinarreg-prod-register`
3. Look for the latest log stream
4. Check for error messages

## What to Look For in Logs

With the improved error handling, you'll see detailed logs:

### Success Case:
```
Loading Razorpay credentials from: arn:aws:secretsmanager:...
Secret keys available: ['key_id', 'key_secret']
Initializing Razorpay client with key_id: rzp_test_x...
Razorpay client initialized successfully
Creating Razorpay order for user@example.com, amount: 499
Order data: {'amount': 49900, 'currency': 'INR', ...}
Razorpay order created: order_xxxxx
```

### Error Cases:

**1. Secret Not Found:**
```
Error loading Razorpay credentials: An error occurred (ResourceNotFoundException)
```
**Solution:** Create the secret using Step 3 above

**2. Wrong Secret Format:**
```
Razorpay key_id not found in secret. Available keys: ['RAZORPAY_KEY', 'RAZORPAY_SECRET']
```
**Solution:** Update secret with correct field names (`key_id` and `key_secret`)

**3. Invalid Credentials:**
```
Error creating Razorpay order: Authentication failed
```
**Solution:** Verify your Razorpay credentials are correct

**4. Permission Denied:**
```
Error loading Razorpay credentials: AccessDeniedException
```
**Solution:** Check serverless.yml has the correct IAM permission

## Verify IAM Permissions

Check that `serverless.yml` has this permission:

```yaml
iam:
  role:
    statements:
      - Effect: Allow
        Action:
          - secretsmanager:GetSecretValue
        Resource:
          - arn:aws:secretsmanager:ap-south-1:842609633704:secret:/payment/nosucloud/razorpayapi-2rd1qi
```

## Test with Razorpay Test Mode

Make sure you're using Razorpay TEST credentials:
- Key ID starts with `rzp_test_`
- Use test card: 4111 1111 1111 1111

## Manual Test via API

Test the endpoint directly:

```bash
curl -X POST https://ycwwkk23x7.execute-api.ap-south-1.amazonaws.com/prod/register \
  -H "Content-Type: application/json" \
  -H "x-api-key: PGrUWFrsgk5QxhzbBL9622BHtWaST5DR9cvQXHVO" \
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

**Expected Success Response:**
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

**Error Response:**
```json
{
  "message": "Failed to create payment order: <error details>",
  "error_type": "ValueError"
}
```

## Quick Checklist

- [ ] Razorpay secret exists in AWS Secrets Manager
- [ ] Secret has correct format with `key_id` and `key_secret`
- [ ] Razorpay credentials are valid (test mode)
- [ ] Lambda has permission to access the secret
- [ ] Handler deployed with latest changes
- [ ] CloudWatch logs checked for detailed errors

## Common Fixes

### Fix 1: Create/Update Secret
```bash
aws secretsmanager put-secret-value \
  --secret-id /payment/nosucloud/razorpayapi \
  --secret-string '{"key_id":"rzp_test_YOUR_KEY","key_secret":"YOUR_SECRET"}' \
  --region ap-south-1
```

### Fix 2: Redeploy Lambda
```bash
cd ../webinarreg
npx serverless deploy --stage prod --region ap-south-1
```

### Fix 3: Check Razorpay Dashboard
1. Go to https://dashboard.razorpay.com/
2. Settings → API Keys
3. Verify your test keys are active
4. Copy the correct Key ID and Key Secret

## Still Having Issues?

1. Check CloudWatch logs for detailed error messages
2. Verify the secret ARN matches in both handler.py and serverless.yml
3. Test with a free course (amount: 0) to verify basic registration works
4. Contact Razorpay support if credentials seem correct but API calls fail

## Success Indicators

✅ CloudWatch logs show "Razorpay client initialized successfully"
✅ CloudWatch logs show "Razorpay order created: order_xxxxx"
✅ API returns order_id and razorpay_key
✅ Razorpay checkout modal opens in frontend
✅ No errors in browser console
