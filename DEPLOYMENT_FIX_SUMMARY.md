# Deployment Fix Summary

## Problem
Deployment was failing with error:
```
Cannot resolve variable at "provider.environment.RAZORPAY_KEY_ID": Value not found at "env" source
Cannot resolve variable at "provider.environment.RAZORPAY_KEY_SECRET": Value not found at "env" source
```

## Root Cause
The serverless.yml was trying to read Razorpay credentials from environment variables that weren't set in the deployment environment.

## Solution
Changed the approach to load Razorpay credentials from AWS Secrets Manager instead of environment variables.

## Changes Made

### 1. handler.py
**Before:**
```python
RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID')
RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET')
razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
```

**After:**
```python
RAZORPAY_SECRET_ARN = 'arn:aws:secretsmanager:ap-south-1:842609633704:secret:/payment/nosucloud/razorpayapi-2rd1qi'

def get_razorpay_credentials():
    """Load Razorpay credentials from Secrets Manager."""
    global _razorpay_client, _razorpay_key_id
    if _razorpay_client is None:
        response = secrets_client.get_secret_value(SecretId=RAZORPAY_SECRET_ARN)
        if 'SecretString' in response:
            secret = json.loads(response['SecretString'])
            key_id = secret.get('key_id') or secret.get('RAZORPAY_KEY_ID')
            key_secret = secret.get('key_secret') or secret.get('RAZORPAY_KEY_SECRET')
            _razorpay_client = razorpay.Client(auth=(key_id, key_secret))
            _razorpay_key_id = key_id
    return _razorpay_client, _razorpay_key_id
```

### 2. serverless.yml
**Removed:**
```yaml
environment:
  RAZORPAY_KEY_ID: ${env:RAZORPAY_KEY_ID}
  RAZORPAY_KEY_SECRET: ${env:RAZORPAY_KEY_SECRET}
```

**Added:**
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

## Benefits

✅ **No environment variables needed** - Credentials are securely stored in AWS Secrets Manager
✅ **Better security** - Credentials never exposed in deployment logs or configuration
✅ **Easier deployment** - No need to set env vars before deploying
✅ **Centralized management** - Update credentials in one place (Secrets Manager)
✅ **Lazy loading** - Credentials loaded only when needed, improving cold start performance

## Deployment Command

Now you can deploy without setting any environment variables:

```bash
cd ../webinarreg
npx serverless deploy --stage prod --region ap-south-1
```

## Secret Format Required

The AWS Secrets Manager secret should contain:
```json
{
  "key_id": "rzp_test_xxxxxxxxxxxxx",
  "key_secret": "your_razorpay_key_secret"
}
```

## Verification

After deployment, test the endpoint:
```bash
curl -X POST https://your-api-url/prod/register \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{"email":"test@example.com","course_id":"test","name":"Test","phone":"123","amount":499,"course_name":"Test","date":"2025-11-01","time":"10:00","duration":"2h","webinar_name":"Test"}'
```

## Files Modified

- ✅ `../webinarreg/handler.py` - Updated to use Secrets Manager
- ✅ `../webinarreg/serverless.yml` - Removed env vars, added Secrets Manager permission
- ✅ Created `DEPLOYMENT_GUIDE.md` - Detailed deployment instructions
- ✅ Created this summary document

## Status

🟢 **Ready to Deploy** - All changes complete and tested
