# Manual Deployment Steps - Razorpay Module Missing

## Problem
Lambda can't import `razorpay` module because it's not packaged with the deployment.

## Solution Options

### Option 1: Use Serverless Python Requirements Plugin (Recommended)

#### Step 1: Install the plugin
```bash
cd ../webinarreg
npm install --save-dev serverless-python-requirements
```

#### Step 2: Ensure serverless.yml has the plugin configured
The file should have:
```yaml
plugins:
  - serverless-python-requirements

custom:
  pythonRequirements:
    dockerizePip: false
    zip: true
    slim: true
```

#### Step 3: Deploy
```bash
npx serverless deploy --stage prod --region ap-south-1
```

### Option 2: Manual Package (If Option 1 Fails)

#### Step 1: Create a package directory
```bash
cd ../webinarreg
mkdir -p package
```

#### Step 2: Install dependencies to package directory
```bash
pip install -r requirements.txt -t package/
```

#### Step 3: Copy handler to package
```bash
cp handler.py package/
```

#### Step 4: Create deployment package
```bash
cd package
zip -r ../deployment-package.zip .
cd ..
```

#### Step 5: Update Lambda function
```bash
aws lambda update-function-code \
  --function-name webinarreg-prod-register \
  --zip-file fileb://deployment-package.zip \
  --region ap-south-1

aws lambda update-function-code \
  --function-name webinarreg-prod-verifyPayment \
  --zip-file fileb://deployment-package.zip \
  --region ap-south-1
```

### Option 3: Use Lambda Layer

#### Step 1: Create layer directory
```bash
cd ../webinarreg
mkdir -p layer/python
```

#### Step 2: Install razorpay to layer
```bash
pip install razorpay -t layer/python/
```

#### Step 3: Create layer zip
```bash
cd layer
zip -r ../razorpay-layer.zip python
cd ..
```

#### Step 4: Publish layer
```bash
aws lambda publish-layer-version \
  --layer-name razorpay-dependencies \
  --description "Razorpay Python SDK" \
  --zip-file fileb://razorpay-layer.zip \
  --compatible-runtimes python3.11 \
  --region ap-south-1
```

This will return a LayerVersionArn like:
```
arn:aws:lambda:ap-south-1:842609633704:layer:razorpay-dependencies:1
```

#### Step 5: Update serverless.yml
Add to each function:
```yaml
functions:
  register:
    handler: handler.register
    layers:
      - arn:aws:lambda:ap-south-1:842609633704:layer:razorpay-dependencies:1
```

#### Step 6: Deploy
```bash
npx serverless deploy --stage prod --region ap-south-1
```

## PowerShell Commands (Windows)

### Option 2 - Manual Package (PowerShell)
```powershell
cd ..\webinarreg
New-Item -ItemType Directory -Force -Path package
pip install -r requirements.txt -t package/
Copy-Item handler.py package/
Compress-Archive -Path package\* -DestinationPath deployment-package.zip -Force

aws lambda update-function-code `
  --function-name webinarreg-prod-register `
  --zip-file fileb://deployment-package.zip `
  --region ap-south-1

aws lambda update-function-code `
  --function-name webinarreg-prod-verifyPayment `
  --zip-file fileb://deployment-package.zip `
  --region ap-south-1
```

### Option 3 - Lambda Layer (PowerShell)
```powershell
cd ..\webinarreg
New-Item -ItemType Directory -Force -Path layer\python
pip install razorpay -t layer\python\
Compress-Archive -Path layer\python -DestinationPath razorpay-layer.zip -Force

aws lambda publish-layer-version `
  --layer-name razorpay-dependencies `
  --description "Razorpay Python SDK" `
  --zip-file fileb://razorpay-layer.zip `
  --compatible-runtimes python3.11 `
  --region ap-south-1
```

## Recommended Approach

**Use Option 1** (Serverless Python Requirements Plugin) as it's the cleanest and most maintainable.

If you're getting AWS credential errors, you may need to:
1. Run `aws sso login` if using AWS SSO
2. Or configure AWS credentials: `aws configure`

## Verify Deployment

After deployment, test:
```powershell
.\test_api_endpoint.ps1
```

Should see successful responses for both free and paid courses.

## Quick Fix (If in a hurry)

Use Option 2 (Manual Package) - it's the fastest:
```powershell
cd ..\webinarreg
pip install -r requirements.txt -t .
npx serverless deploy --stage prod --region ap-south-1
```

This installs packages directly in the webinarreg folder, which serverless will package automatically.

**Note:** Add these to .gitignore:
- razorpay/
- razorpay-*.dist-info/
- requests/
- requests-*.dist-info/
- etc.
