#!/bin/bash
# Test the API endpoint to see what error is returned

echo "Testing FREE course registration..."
curl -X POST https://ycwwkk23x7.execute-api.ap-south-1.amazonaws.com/prod/register \
  -H "Content-Type: application/json" \
  -H "x-api-key: PGrUWFrsgk5QxhzbBL9622BHtWaST5DR9cvQXHVO" \
  -d '{
    "email": "test-free@example.com",
    "course_id": "test-free-course-001",
    "name": "Test User Free",
    "phone": "1234567890",
    "amount": 0,
    "course_name": "Free Test Course",
    "date": "2025-11-01",
    "time": "10:00 AM",
    "duration": "1 hour",
    "webinar_name": "Free Test Course"
  }' | jq .

echo -e "\n\nTesting PAID course registration..."
curl -X POST https://ycwwkk23x7.execute-api.ap-south-1.amazonaws.com/prod/register \
  -H "Content-Type: application/json" \
  -H "x-api-key: PGrUWFrsgk5QxhzbBL9622BHtWaST5DR9cvQXHVO" \
  -d '{
    "email": "test-paid@example.com",
    "course_id": "test-paid-course-001",
    "name": "Test User Paid",
    "phone": "1234567890",
    "amount": 499,
    "course_name": "Paid Test Course",
    "date": "2025-11-01",
    "time": "10:00 AM",
    "duration": "2 hours",
    "webinar_name": "Paid Test Course"
  }' | jq .
