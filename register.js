// registration.js
import { app } from "./firebase-options.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

const auth = getAuth(app);

document
  .getElementById("registration-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const fullName = document.getElementById("full-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: fullName });

      alert(`Registration successful! Welcome, ${fullName}!`);
      window.location.href = "user_dashboard.html";
    } catch (error) {
      console.error("Firebase registration error:", error.code, error.message);
      alert(`Registration failed: ${error.message}`);
    }
  });
