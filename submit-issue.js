import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { firebaseConfig } from "./firebase-options.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const IMGBB_API_KEY = '1bd43b95e32fb9b2d8471a6a67f986d8';
const IMGBB_UPLOAD_URL = 'https://api.imgbb.com/1/upload';

const form = document.getElementById('issue-form');
const fileInput = document.getElementById('file-upload');
const successMessage = document.getElementById('success-message');

if (form) {
    form.addEventListener('submit', handleFormSubmit);
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerText;

    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.innerText = 'Submitting...';

    try {
        const formData = new FormData(form);
        const imageFile = fileInput.files[0];
        let imageUrl = null;

        // 1. Upload Image to ImgBB if a file is selected
        if (imageFile) {
            const imgbbData = new FormData();
            imgbbData.append('image', imageFile);

            const response = await fetch(`${IMGBB_UPLOAD_URL}?key=${IMGBB_API_KEY}`, {
                method: 'POST',
                body: imgbbData
            });

            const result = await response.json();
            if (result.success) {
                imageUrl = result.data.url;
            } else {
                throw new Error('Image upload failed: ' + (result.error?.message || 'Unknown error'));
            }
        }

        // 2. Store data in Firestore
        const docRef = await addDoc(collection(db, "maintenance_issues"), {
            userId: auth.currentUser ? auth.currentUser.uid : null,
            issueType: formData.get('issueType'),
            location: formData.get('location'),
            description: formData.get('description'),
            imageUrl: imageUrl,
            status: 'new',
            createdAt: serverTimestamp()
        });

        // 3. Show Success Message
        form.reset();
        successMessage.classList.remove('hidden');
        successMessage.querySelector('p.text-sm').innerText = `Your report has been submitted. Tracking ID: #${docRef.id}`;
        successMessage.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error("Error submitting report: ", error);
        alert("Error submitting report: " + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = originalBtnText;
    }
}