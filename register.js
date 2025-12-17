import { app, auth, db } from "./firebase-options.js";

import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import {
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

document
  .getElementById("registration-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const fullName = document.getElementById("full-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const role = document.querySelector('input[name="role"]:checked')?.value;
    const department = document.getElementById("department").value.trim();

    // 🛡️ Client-side validation
    if (!fullName || !email || !password || !confirmPassword || !role) {
      alert("Please fill all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    if (!department) {
      alert("Please enter your department.");
      return;
    }

    try {
      // 🔐 Create Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // 👤 Update display name
      await updateProfile(user, { displayName: fullName });

      // 📄 Store user in Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName,
        email,
        role,
        department,
        createdAt: new Date(),
      });

      alert(`Registration successful! Welcome, ${fullName}`);

      // 🔀 Redirect by role
      window.location.href =
        role === "hod" ? "Dashboard.html" : "user_dashboard.html";
    } catch (error) {
      console.error("Firebase registration error:", error.code, error.message);
      alert(`Registration failed: ${error.message}`);
    }
  });
