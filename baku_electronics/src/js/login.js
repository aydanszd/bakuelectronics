import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCOeDrICcabm06H877gVMteQU-41RqK_bA",
    authDomain: "auth-pf502aa.firebaseapp.com",
    projectId: "auth-pf502aa",
    storageBucket: "auth-pf502aa.appspot.com",
    messagingSenderId: "375753919888",
    appId: "1:375753919888:web:967435d8649beb5850f715",
    measurementId: "G-58FZKG5EWF"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const registerBtn = document.getElementById("registerBtn");
    const loginBtn = document.getElementById("loginBtn");
    const userBtn = document.getElementById("userBtn");
    const userIcon = document.getElementById("userIcon");

    function updateUI(user) {
        if (!userIcon) return;
        if (user) {
            userIcon.classList.remove("ri-user-line");
            userIcon.classList.add("ri-user-forbid-line");
        } else {
            userIcon.classList.remove("ri-user-forbid-line");
            userIcon.classList.add("ri-user-line");
        }
    }

    if (registerBtn) {
        registerBtn.addEventListener("click", async (e) => {
            e.preventDefault();

            const username = form.username?.value.trim() || "";
            const email = form.email?.value.trim() || "";
            const password = form.password?.value.trim() || "";
            const confirmPassword = form.confirm_password?.value.trim() || "";

            if (!username || !email || !password || !confirmPassword) {
                alert("Bütün sahələri doldurun!");
                return;
            }

            if (password.length < 6) {
                alert("Şifrə ən az 6 simvol olmalıdır!");
                return;
            }

            if (password !== confirmPassword) {
                alert("Şifrələr eyni deyil!");
                return;
            }

            try {
                await createUserWithEmailAndPassword(auth, email, password);
                alert("Uğurla qeydiyyatdan keçdiniz! İndi login edin.");
                window.location.href = "login.html";
            } catch (err) {
                alert("Qeydiyyat xətası: " + err.message);
            }
        });
    }

    // Login
    if (loginBtn) {
        loginBtn.addEventListener("click", async (e) => {
            e.preventDefault();

            const email = form.email?.value.trim() || "";
            const password = form.password?.value.trim() || "";

            if (!email || !password) {
                alert("Email və şifrəni doldurun!");
                return;
            }

            if (password.length < 6) {
                alert("Şifrə ən az 6 simvol olmalıdır!");
                return;
            }

            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                localStorage.setItem("user", JSON.stringify(user));
                alert("Uğurla daxil oldunuz!");
                window.location.href = "index.html"; // Login=>Index
            } catch (err) {
                alert("Login xətası: " + err.message);
            }
        });
    }

    // Logout
    if (userBtn) {
        userBtn.addEventListener("click", async () => {
            try {
                await signOut(auth);
                localStorage.removeItem("user");
                updateUI(null);
                alert("Çıxış etdiniz!");
                window.location.href = "login.html";
            } catch (err) {
                alert("Çıxış zamanı xəta: " + err.message);
            }
        });
    }
    // Firebase user status 
    onAuthStateChanged(auth, (user) => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
        updateUI(user);
    });

    // show/hide
    const passwordInput = document.getElementById("password");
    const toggleBtn = document.getElementById("togglePassword");
    const toggleIcon = document.getElementById("toggleIcon");

    if (passwordInput && toggleBtn && toggleIcon) {
        toggleBtn.addEventListener("click", () => {
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                toggleIcon.classList.replace("ri-eye-off-line", "ri-eye-line");
            } else {
                passwordInput.type = "password";
                toggleIcon.classList.replace("ri-eye-line", "ri-eye-off-line");
            }
        });
    }
});
