# GitHub Actions Deployment Guide

## Overview
The webinarreg Lambda function will be automatically deployed via GitHub Actions when you push to the main branch.

## What Was Updated

### 1. GitHub Actions Workflow (`.github/workflows/deploy.yml`)
✅ Added Python 3.11 setup
✅ Added Node.js 20 setup
✅ Added serverless-python-requirements plugin installation
✅ Added Python dependencies installation from requirements.txt
✅ Configured to deploy on push to main branch

### 2. serverless.yml
✅ Added serverless-python-requirements plugin
✅ Configured to package Python dependencies
✅ Set dockerizePip: false (works on GitHub Actions runners)

### 3. package.json
✅ Added serverless-python-requirements as dev dependency

### 4. requirements.txt
✅ Contains boto3 and razorpay

## Files to Commit

You need to commit and push these files from the `webinarreg` folder:

```bash
cd ../webinarreg
git status
```

Files that should be committed:
- ✅ `handler.py` (updated with Razorpay integration)
- ✅ `serverless.yml` (updated with plugin configuration)
- ✅ `requirements.txt` (contains razorpay)
- ✅ `package.json` (contains serverless-python-requirements)
- ✅ `.github/workflows/deploy.yml` (updated workflow)

## Deployment Steps

### Step 1: Check Git Status
```bash
cd ../webinarreg
git status
```

### Step 2: Add Files
```bash
git add handler.py serverless.yml requirements.txt package.json .github/workflows/deploy.yml
```

### Step 3: Commit Changes
```bash
git commit -m "Add Razorpay payment integration with free/paid course support"
```

### Step 4: Push to Main Branch
```bash
git push origin main
```

### Step 5: Monitor Deployment
1. Go to your GitHub repository
2. Click on "Actions" tab
3. You should see a new workflow run starting
4. Click on it to see the deployment progress

## What Happens During Deployment

1. **Checkout** - GitHub Actions checks out your code
2. **Setup Python** - Installs Python 3.11
3. **Setup Node.js** - Installs Node.js 20
4. **Configure AWS** - Uses OIDC to authenticate with AWS
5. **Install Serverless** - Installs Serverless Framework and plugins
6. **Install Python Dependencies** - Installs razorpay and boto3
7. **Deploy** - Packages everything and deploys to AWS Lambda

## Expected Output

In GitHub Actions, you should see:
```
✔ Service deployed to stack webinarreg-prod

endpoints:
  POST - https://ycwwkk23x7.execute-api.ap-south-1.amazonaws.com/prod/register
  POST - https://ycwwkk23x7.execute-api.ap-south-1.amazonaws.com/prod/verify-payment
  GET - https://ycwwkk23x7.execute-api.ap-south-1.amazonaws.com/prod/participants/{course_id}

functions:
  register: webinarreg-prod-register
  verifyPayment: webinarreg-prod-verifyPayment
  getParticipants: webinarreg-prod-getParticipants
```

## After Deployment

### Test the Endpoints

Run the test script:
```powershell
cd nouscloudwebsite
.\test_api_endpoint.ps1
```

Or test manually:
1. Go to your website
2. Try registering for a free course (amount = 0)
3. Try registering for a paid course (amount > 0)

### Check CloudWatch Logs

If there are any issues:
```bash
aws logs tail /aws/lambda/webinarreg-prod-register --follow --region ap-south-1
```

## Troubleshooting

### Deployment Fails with "No module named 'razorpay'"
- Check that requirements.txt is committed
- Check that the workflow installs Python dependencies
- Check GitHub Actions logs for pip install errors

### Deployment Fails with AWS Credentials Error
- Verify the OIDC role exists: `arn:aws:iam::842609633704:role/GitHubOIDCDeployRole`
- Check that the role has necessary permissions
- Verify the role trust policy allows GitHub Actions

### Deployment Succeeds but API Returns 502
- Check CloudWatch logs for runtime errors
- Verify Razorpay secret exists in AWS Secrets Manager
- Check Lambda function has permission to access secrets

## Quick Commands

### Commit and Push (PowerShell)
```powershell
cd ..\webinarreg
git add handler.py serverless.yml requirements.txt package.json .github/workflows/deploy.yml
git commit -m "Add Razorpay payment integration"
git push origin main
```

### Watch GitHub Actions
```bash
# Open in browser
start https://github.com/YOUR_USERNAME/YOUR_REPO/actions
```

### Check Deployment Status
```bash
aws lambda get-function --function-name webinarreg-prod-register --region ap-south-1 --query 'Configuration.LastModified'
```

## Files Summary

### webinarreg/handler.py
- ✅ Loads Razorpay credentials from Secrets Manager
- ✅ Handles free courses (amount=0) separately
- ✅ Creates Razorpay orders for paid courses
- ✅ Verifies payment signatures
- ✅ Sends email confirmations

### webinarreg/serverless.yml
- ✅ Configured with serverless-python-requirements plugin
- ✅ IAM permissions for DynamoDB and Secrets Manager
- ✅ Three Lambda functions: register, verifyPayment, getParticipants

### webinarreg/requirements.txt
```
boto3
razorpay
```

### webinarreg/.github/workflows/deploy.yml
- ✅ Triggers on push to main branch
- ✅ Uses OIDC for AWS authentication
- ✅ Installs all dependencies
- ✅ Deploys with Serverless Framework

## Success Indicators

✅ GitHub Actions workflow completes successfully
✅ No errors in deployment logs
✅ Lambda functions updated in AWS
✅ API endpoints return successful responses
✅ Free course registration works
✅ Paid course registration opens Razorpay checkout
✅ Payment verification works
✅ Email confirmations sent

## Ready to Deploy!

Run these commands:
```bash
cd ../webinarreg
git add handler.py serverless.yml requirements.txt package.json .github/workflows/deploy.yml
git commit -m "Add Razorpay payment integration with free/paid course support"
git push origin main
```

Then watch the deployment in GitHub Actions!
