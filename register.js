// Initialize Firebase
// The 'firebaseConfig' object is loaded from firebase-options.js
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

document.getElementById('registration-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    const fullName = document.getElementById('full-name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match. Please try again.');
        return;
    }

    // Use Firebase to create a new user
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            // Update the user's profile with their full name
            return user.updateProfile({
                displayName: fullName
            }).then(() => {
                alert(`Registration successful! Welcome, ${fullName}!`);
                // Redirect to the user dashboard
                window.location.href = 'Dashboard.html';
            });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Firebase registration error:", errorCode, errorMessage);
            // Provide a user-friendly error message
            alert(`Registration failed: ${errorMessage}`);
        });
});