import { app, db, auth } from "./firebase-options.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

const storage = getStorage(app);

const form = document.getElementById('issue-form');
const successMessage = document.getElementById('success-message');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerText;

        // Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.innerText = 'Submitting...';

        try {
            const formData = new FormData(form);
            const issueType = formData.get('issueType');
            const location = formData.get('location');
            const description = formData.get('description');
            const file = formData.get('file-upload');

            // Basic validation
            if (!issueType || !location || !description) {
                throw new Error("Please fill in all required fields.");
            }

            const user = auth.currentUser;
            if (!user) {
                throw new Error("You must be logged in to submit a report.");
            }

            let imageUrl = null;

            // Upload file to Firebase Storage if present
            if (file && file.size > 0) {
                const storageRef = ref(storage, `issues/${Date.now()}_${file.name}`);
                const snapshot = await uploadBytes(storageRef, file);
                imageUrl = await getDownloadURL(snapshot.ref);
            }

            // Add document to Firestore 'issues' collection
            await addDoc(collection(db, "issues"), {
                issueType: issueType,
                location: location,
                description: description,
                imageUrl: imageUrl,
                status: 'new',
                createdAt: serverTimestamp(),
                userId: user.uid,
                reporterName: user.displayName || user.email || 'Anonymous'
            });

            // Reset form and show success message
            form.reset();
            if (successMessage) {
                successMessage.classList.remove('hidden');
                setTimeout(() => {
                    successMessage.classList.add('hidden');
                }, 5000);
            }

        } catch (error) {
            console.error("Error submitting report: ", error);
            alert(error.message || "There was an error submitting your report.");
        } finally {
            // Restore button state
            submitBtn.disabled = false;
            submitBtn.innerText = originalBtnText;
        }
    });
}