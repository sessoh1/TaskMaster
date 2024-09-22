document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting

    // Clear previous error message
    document.getElementById('signup-error').textContent = '';

    // Gather form values
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const confirmEmail = document.getElementById('confirm-email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validation
    if (firstName === '' || lastName === '' || email === '' || confirmEmail === '' || password === '' || confirmPassword === '') {
        document.getElementById('signup-error').textContent = 'Please fill in all fields.';
    } else if (email !== confirmEmail) {
        document.getElementById('signup-error').textContent = 'Email addresses do not match.';
    } else if (password !== confirmPassword) {
        document.getElementById('signup-error').textContent = 'Passwords do not match.';
    } else {
        // Normally, here you would send the registration request to your server
        alert('Sign Up successful!');
    }
});
