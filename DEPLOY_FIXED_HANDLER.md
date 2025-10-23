# Deploy Fixed Handler - URGENT

## Current Situation

❌ The API is returning 502 Bad Gateway for both free and paid courses
❌ This means the OLD handler is still deployed
✅ The FIXED handler is ready in `../webinarreg/handler.py`

## What Was Fixed

1. **Amount validation** - Now allows `amount=0` for free courses
2. **Free course handling** - Separate logic that doesn't call Razorpay
3. **Error logging** - Detailed logs for debugging
4. **Razorpay credentials** - Loads from AWS Secrets Manager

## Deploy Now

### Step 1: Navigate to webinarreg folder
```bash
cd ../webinarreg
```

### Step 2: Verify handler.py is correct
```bash
python -m py_compile handler.py
```
Should show no errors.

### Step 3: Deploy
```bash
npx serverless deploy --stage prod --region ap-south-1
```

### Step 4: Wait for deployment
You should see output like:
```
✔ Service deployed to stack webinarreg-prod (XX s)

endpoints:
  POST - https://ycwwkk23x7.execute-api.ap-south-1.amazonaws.com/prod/register
  POST - https://ycwwkk23x7.execute-api.ap-south-1.amazonaws.com/prod/verify-payment
  GET - https://ycwwkk23x7.execute-api.ap-south-1.amazonaws.com/prod/participants/{course_id}

functions:
  register: webinarreg-prod-register (XX kB)
  verifyPayment: webinarreg-prod-verifyPayment (XX kB)
  getParticipants: webinarreg-prod-getParticipants (XX kB)
```

### Step 5: Test again
Run the test script:
```powershell
.\test_api_endpoint.ps1
```

Or test manually in your browser by trying to register for a course.

## If Deployment Fails

### Error: "Cannot resolve variable"
This was already fixed. Make sure you're in the `webinarreg` folder.

### Error: "No such file or directory"
Make sure you're running from the correct directory:
```bash
pwd  # Should show: .../webinarreg
ls   # Should show: handler.py, serverless.yml, requirements.txt
```

### Error: "Serverless command not found"
Install serverless:
```bash
npm install -g serverless
```

Or use npx:
```bash
npx serverless deploy --stage prod --region ap-south-1
```

## After Deployment

### Test Free Course
1. Go to your website
2. Find a course with price = 0
3. Click "Register Now"
4. Fill the form
5. Should see success message immediately

### Test Paid Course
1. Go to your website
2. Find a course with price > 0
3. Click "Pay & Register"
4. Fill the form
5. Click "Proceed to Payment"
6. Razorpay checkout should open
7. Use test card: 4111 1111 1111 1111
8. Complete payment
9. Should see success message

## Check Logs

If still having issues, check CloudWatch logs:
```bash
aws logs tail /aws/lambda/webinarreg-prod-register --follow --region ap-south-1
```

Look for:
- "Loading Razorpay credentials from..."
- "Razorpay client initialized successfully"
- "Creating Razorpay order for..."
- Any error messages

## Quick Verification

After deployment, run this to verify the function exists:
```bash
aws lambda get-function --function-name webinarreg-prod-register --region ap-south-1
```

Should return function details without errors.

## IMPORTANT

The handler.py file in `../webinarreg/` is now correct and ready to deploy.
The issue is that the OLD version is still running in AWS Lambda.
You MUST deploy to fix the issue.

## Deploy Command (Copy-Paste)

```bash
cd ../webinarreg && npx serverless deploy --stage prod --region ap-south-1
```

That's it! After deployment completes, test the registration again.
