document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("loginBtn"); // Login 
    const userBtn = document.getElementById("userBtn");   // User 
    const userIcon = document.getElementById("userIcon"); // İkon

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

    const currentUser = JSON.parse(localStorage.getItem("user") || "null");
    updateUI(currentUser);

    loginBtn?.addEventListener("click", async (e) => {
        e.preventDefault();

        const username = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!username || !password) {
            alert("Xahiş edirəm istifadəçi adı və şifrəni doldurun.");
            return;
        }

        try {
            const res = await fetch("https://dummyjson.com/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("user", JSON.stringify(data));
                updateUI(data);
                alert("Uğurla daxil oldunuz!");
                window.location.href = "index.html";
            } else {
                alert(data.message || "İstifadəçi adı və ya şifrə səhvdir!");
            }

        } catch (err) {
            console.error(err);
            alert("Serverə qoşulmaq mümkün olmadı!");
        }
    });

    userBtn?.addEventListener("click", () => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            localStorage.removeItem("user");
            updateUI(null);
            alert("Çıxış etdiniz!");
        } else {
            window.location.href = "login.html";
        }
    });
});
