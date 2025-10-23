# Test the API endpoint to see what error is returned

$apiUrl = "https://ycwwkk23x7.execute-api.ap-south-1.amazonaws.com/prod/register"
$apiKey = "PGrUWFrsgk5QxhzbBL9622BHtWaST5DR9cvQXHVO"

Write-Host "Testing FREE course registration..." -ForegroundColor Cyan
$freePayload = @{
    email = "test-free@example.com"
    course_id = "test-free-course-001"
    name = "Test User Free"
    phone = "1234567890"
    amount = 0
    course_name = "Free Test Course"
    date = "2025-11-01"
    time = "10:00 AM"
    duration = "1 hour"
    webinar_name = "Free Test Course"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $apiUrl -Method Post `
        -Headers @{
            "Content-Type" = "application/json"
            "x-api-key" = $apiKey
        } `
        -Body $freePayload
    
    Write-Host "✅ FREE course response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ FREE course error:" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.ErrorDetails.Message) {
        Write-Host "Details: $($_.ErrorDetails.Message)"
    }
}

Write-Host "`n`nTesting PAID course registration..." -ForegroundColor Cyan
$paidPayload = @{
    email = "test-paid@example.com"
    course_id = "test-paid-course-001"
    name = "Test User Paid"
    phone = "1234567890"
    amount = 499
    course_name = "Paid Test Course"
    date = "2025-11-01"
    time = "10:00 AM"
    duration = "2 hours"
    webinar_name = "Paid Test Course"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $apiUrl -Method Post `
        -Headers @{
            "Content-Type" = "application/json"
            "x-api-key" = $apiKey
        } `
        -Body $paidPayload
    
    Write-Host "✅ PAID course response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ PAID course error:" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.ErrorDetails.Message) {
        Write-Host "Details: $($_.ErrorDetails.Message)"
    }
}
