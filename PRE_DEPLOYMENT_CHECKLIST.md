# Pre-Deployment Checklist

## ✅ Code Changes Complete

- [x] Updated `handler.py` to load Razorpay credentials from Secrets Manager
- [x] Updated `serverless.yml` to remove environment variables
- [x] Added Secrets Manager IAM permissions
- [x] Python syntax validated
- [x] Frontend updated with Razorpay integration

## 🔐 AWS Secrets Manager

### Verify Razorpay Secret Exists
```bash
aws secretsmanager get-secret-value \
  --secret-id /payment/nosucloud/razorpayapi \
  --region ap-south-1 \
  --query SecretString \
  --output text
```

**Expected output format:**
```json
{"key_id":"rzp_test_xxxxx","key_secret":"xxxxx"}
```

### If Secret Doesn't Exist, Create It
```bash
aws secretsmanager create-secret \
  --name /payment/nosucloud/razorpayapi \
  --description "Razorpay API credentials" \
  --secret-string '{"key_id":"YOUR_KEY_ID","key_secret":"YOUR_KEY_SECRET"}' \
  --region ap-south-1
```

## 📋 Pre-Deployment Steps

### 1. Verify AWS Credentials
```bash
aws sts get-caller-identity
```

### 2. Check Current Deployment (if exists)
```bash
cd ../webinarreg
npx serverless info --stage prod --region ap-south-1
```

### 3. Verify Dependencies
```bash
cd ../webinarreg
cat requirements.txt
# Should show:
# boto3
# razorpay
```

### 4. Test Serverless Configuration
```bash
cd ../webinarreg
npx serverless print --stage prod --region ap-south-1
```

## 🚀 Deployment

### Deploy Command
```bash
cd ../webinarreg
npx serverless deploy --stage prod --region ap-south-1
```

### Expected Output
```
Deploying webinarreg to stage prod (ap-south-1)

✔ Service deployed to stack webinarreg-prod

endpoints:
  POST - https://xxxxx.execute-api.ap-south-1.amazonaws.com/prod/register
  POST - https://xxxxx.execute-api.ap-south-1.amazonaws.com/prod/verify-payment
  GET - https://xxxxx.execute-api.ap-south-1.amazonaws.com/prod/participants/{course_id}

functions:
  register: webinarreg-prod-register
  verifyPayment: webinarreg-prod-verifyPayment
  getParticipants: webinarreg-prod-getParticipants
```

## 🧪 Post-Deployment Testing

### 1. Test Registration Endpoint (Free Course)
```bash
curl -X POST https://YOUR_API_URL/prod/register \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "email": "test@example.com",
    "course_id": "test-free-course",
    "name": "Test User",
    "phone": "1234567890",
    "amount": 0,
    "course_name": "Free Test Course",
    "date": "2025-11-01",
    "time": "10:00 AM",
    "duration": "1 hour",
    "webinar_name": "Free Test Course"
  }'
```

**Expected:** Success message, no order_id (free course)

### 2. Test Registration Endpoint (Paid Course)
```bash
curl -X POST https://YOUR_API_URL/prod/register \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "email": "test@example.com",
    "course_id": "test-paid-course",
    "name": "Test User",
    "phone": "1234567890",
    "amount": 499,
    "course_name": "Paid Test Course",
    "date": "2025-11-01",
    "time": "10:00 AM",
    "duration": "2 hours",
    "webinar_name": "Paid Test Course"
  }'
```

**Expected:** Success with `order_id` and `razorpay_key`

### 3. Check CloudWatch Logs
```bash
aws logs tail /aws/lambda/webinarreg-prod-register --follow
```

### 4. Test Frontend
1. Navigate to your website
2. Find a paid course
3. Click "Pay & Register"
4. Fill the form
5. Verify Razorpay checkout opens
6. Use test card: 4111 1111 1111 1111
7. Complete payment
8. Verify success message

## 🔍 Monitoring

### CloudWatch Logs
- `/aws/lambda/webinarreg-prod-register`
- `/aws/lambda/webinarreg-prod-verifyPayment`
- `/aws/lambda/webinarreg-prod-getParticipants`

### DynamoDB Table
- Table name: `participants`
- Check for records with `payment_status: "pending"` and `payment_status: "completed"`

### API Gateway
- Monitor request count
- Check for 4xx and 5xx errors
- Verify API key usage

## ⚠️ Troubleshooting

### Issue: "Razorpay credentials not found in secret"
**Solution:** Verify secret exists and contains `key_id` and `key_secret` fields

### Issue: "Access Denied" to Secrets Manager
**Solution:** Check IAM role has `secretsmanager:GetSecretValue` permission

### Issue: Payment verification fails
**Solution:** Check Razorpay signature verification in CloudWatch logs

### Issue: Email not sent
**Solution:** Check SMTP secret and email configuration

## 📝 Rollback Plan

If deployment fails or issues occur:

```bash
# Remove the deployment
cd ../webinarreg
npx serverless remove --stage prod --region ap-south-1

# Redeploy previous version
git checkout <previous-commit>
npx serverless deploy --stage prod --region ap-south-1
```

## ✅ Final Checklist

Before going live:

- [ ] Razorpay secret verified in AWS Secrets Manager
- [ ] Deployment successful
- [ ] Registration endpoint tested (free course)
- [ ] Registration endpoint tested (paid course)
- [ ] Payment verification tested
- [ ] Email confirmation working
- [ ] Frontend integration tested
- [ ] CloudWatch logs reviewed
- [ ] DynamoDB records verified
- [ ] API key secured
- [ ] Monitoring set up

## 🎯 Success Criteria

✅ Free course registration works without payment
✅ Paid course registration creates Razorpay order
✅ Razorpay checkout opens with correct details
✅ Payment verification succeeds
✅ Email confirmation sent after payment
✅ DynamoDB records created correctly
✅ No errors in CloudWatch logs

---

**Ready to deploy!** 🚀
