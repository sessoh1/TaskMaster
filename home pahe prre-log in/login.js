document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting

    // Clear previous error message
    document.getElementById('error').textContent = '';

    // Simple validation (for demo purposes)
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === '' || password === '') {
        document.getElementById('error').textContent = 'Please fill in both fields.';
    } else {
        // Normally, here you would send the login request to your server
        alert('Login successful!');
    }
});
