# Testing Course Details Functionality

## Test Steps:

1. **Open the application**: Navigate to http://localhost:8081/
2. **Find the Upcoming Courses section**: Scroll down to see the course cards
3. **Look for Details buttons**: The first two courses should now have "Details" buttons
4. **Test the Details modal**:
   - Click the "Details" button on the first course (AgenticAI for Beginners)
   - Verify the modal opens with a numbered list of course details
   - Check that the modal has a proper title
   - Verify the "Close" button works
   - Test clicking outside the modal to close it
   - Test the ESC key to close the modal

## Expected Behavior:

✅ **Details Button Visibility**: 
- First course (AgenticAI) should show a Details button
- Second course (Cloud Computing) should show a Details button  
- Third course (AI Development) should NOT show a Details button (no mock data)

✅ **Modal Functionality**:
- Modal opens when Details button is clicked
- Course details are displayed as a numbered list
- Modal title shows the course name
- Close button works properly
- Modal can be closed by clicking outside or pressing ESC
- Modal is scrollable if content is long

✅ **Layout**:
- Details button appears next to "Register Now" button
- Buttons are properly aligned
- Modal is responsive and centered

## Current Test Data:

The first course has 10 mock detail points, the second has 8 points, and the third has none (to test the conditional rendering).