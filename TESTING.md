Testing happy path for accepting the booking and writing review.
1. Registers user 2 successfully
2. Making Booking
3. Logout
4. Login user 1
5. Accept Booking
6. Logout user 1
7. Login user 2
8. Writing review
9. Logout user 2

Component Testing:

For LoginInput: 
- I tested if it is email Type, then the password is hidden and the way around ( as login input can be 2 type either email or password).
- Then I test Visible Icon to make sure when I click, the password is visible and the way around.

For LoginButton:
- Since LoginButton and RegisterButton are the same, I tested if the button is Login or Register work on both when rendering.
- Testing the number of click on Button to make sure it is clicked.

For ErrorPopUp:
- Testing if the error message is correct when rendering.
- Testing if the error message closed button is clicked or closed automatically after a timeout.
- Should have close button, outline and message.

For Register:

- Make sure it always output the correct format (4 inputs and 1 button) including 2 text field and 2 password should be good enough to go.
- Should have name
- Should have email
- Should have password
- Should have confirmed password
- Because Register is built by 4 LoginInputs then we don't need to conitnue testing while we already done testing LoginInput

For LandingAppBar:

- Should be appeared on the top of the page for PageList, DashBoard, UserListing, EditListing.

