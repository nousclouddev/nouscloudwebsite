# Ready to Commit and Deploy! 🚀

## Summary of Changes

All files are ready in the `webinarreg` folder. Here's what was fixed:

### ✅ Backend (Lambda)
- **handler.py** - Fixed to handle both free and paid courses with Razorpay integration
- **serverless.yml** - Added Python requirements plugin configuration
- **requirements.txt** - Contains razorpay dependency
- **package.json** - Contains serverless-python-requirements plugin
- **.github/workflows/deploy.yml** - Updated to install Python dependencies

### ✅ Frontend (Already Updated)
- **CourseRegistrationForm.tsx** - Handles Razorpay checkout for paid courses

## What Will Happen

1. **Free Courses (amount = 0)**
   - User registers → Immediate success → Email sent
   - No payment required

2. **Paid Courses (amount > 0)**
   - User registers → Razorpay order created → Checkout opens
   - User pays → Payment verified → Email sent

## Commit and Deploy

### Step 1: Navigate to webinarreg folder
```bash
cd ../webinarreg
```

### Step 2: Check what files changed
```bash
git status
```

You should see:
- Modified: `handler.py`
- Modified: `serverless.yml`
- Modified: `.github/workflows/deploy.yml`
- New/Modified: `requirements.txt`
- New/Modified: `package.json`

### Step 3: Add files to git
```bash
git add handler.py serverless.yml requirements.txt package.json .github/workflows/deploy.yml
```

### Step 4: Commit
```bash
git commit -m "Add Razorpay payment integration

- Add razorpay module for payment processing
- Handle free courses (amount=0) separately
- Create Razorpay orders for paid courses
- Add payment verification endpoint
- Load credentials from AWS Secrets Manager
- Update GitHub Actions workflow to install Python dependencies
- Add serverless-python-requirements plugin"
```

### Step 5: Push to trigger deployment
```bash
git push origin main
```

### Step 6: Monitor deployment
Go to: https://github.com/YOUR_USERNAME/YOUR_REPO/actions

Watch the deployment progress. It should take 2-3 minutes.

## After Deployment

### Test Free Course
1. Go to your website
2. Find a course with price = 0
3. Click "Register Now"
4. Fill form and submit
5. ✅ Should see success message immediately

### Test Paid Course
1. Go to your website
2. Find a course with price > 0
3. Click "Pay & Register"
4. Fill form and click "Proceed to Payment"
5. ✅ Razorpay checkout should open
6. Use test card: **4111 1111 1111 1111**
7. Complete payment
8. ✅ Should see success message

## Verify Deployment

### Check Lambda Function
```bash
aws lambda get-function --function-name webinarreg-prod-register --region ap-south-1
```

### Check CloudWatch Logs
```bash
aws logs tail /aws/lambda/webinarreg-prod-register --follow --region ap-south-1
```

### Test API Directly
```powershell
cd ../nouscloudwebsite
.\test_api_endpoint.ps1
```

## Expected Results

### GitHub Actions
✅ Workflow completes successfully
✅ All steps pass (checkout, setup, install, deploy)
✅ Deployment shows Lambda functions updated

### API Tests
✅ Free course returns success immediately
✅ Paid course returns order_id and razorpay_key
✅ No 502 errors
✅ No "module not found" errors

### Website
✅ Free course registration works
✅ Paid course opens Razorpay checkout
✅ Payment completes successfully
✅ Email confirmations received

## If Something Goes Wrong

### Check GitHub Actions Logs
1. Go to Actions tab
2. Click on the failed workflow
3. Expand the failed step
4. Look for error messages

### Check CloudWatch Logs
```bash
aws logs tail /aws/lambda/webinarreg-prod-register --follow --region ap-south-1
```

Look for:
- "Loading Razorpay credentials from..."
- "Razorpay client initialized successfully"
- Any error messages

### Common Issues

**"No module named 'razorpay'"**
- GitHub Actions didn't install dependencies
- Check workflow logs for pip install errors

**"Razorpay credentials not found"**
- Secret doesn't exist or has wrong format
- Run: `aws secretsmanager get-secret-value --secret-id /payment/nosucloud/razorpayapi --region ap-south-1`

**"Access Denied"**
- Lambda doesn't have permission to access secret
- Check serverless.yml IAM permissions

## Quick Copy-Paste Commands

```bash
# Navigate and commit
cd ../webinarreg
git add handler.py serverless.yml requirements.txt package.json .github/workflows/deploy.yml
git commit -m "Add Razorpay payment integration with free/paid course support"
git push origin main

# Watch deployment (open browser)
start https://github.com/YOUR_USERNAME/YOUR_REPO/actions

# Test after deployment
cd ../nouscloudwebsite
.\test_api_endpoint.ps1
```

## Files Ready to Commit

From `webinarreg` folder:
- ✅ `handler.py` - 298 lines, Razorpay integration complete
- ✅ `serverless.yml` - Plugin configured
- ✅ `requirements.txt` - boto3, razorpay
- ✅ `package.json` - serverless-python-requirements
- ✅ `.github/workflows/deploy.yml` - Python setup added

## You're All Set! 🎉

Everything is ready. Just commit and push to deploy!

```bash
cd ../webinarreg && git add . && git commit -m "Add Razorpay payment integration" && git push origin main
```

Then watch the magic happen in GitHub Actions! ✨
