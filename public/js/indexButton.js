// Check if the user is already logged in
const loggedInUserId = localStorage.getItem('loggedInUserId');

if (loggedInUserId) {
    // User is logged in, disable or hide buttons
    document.getElementById('registerBtn').style.display = 'none';
    document.getElementById('loginBtn').style.display = 'none';
} else {
    // User is not logged in, allow registration and login
    document.getElementById('registerBtn').onclick = function() {
        window.location.href = 'register.html';
    };
    document.getElementById('loginBtn').onclick = function() {
        window.location.href = 'login.html';
    };
}