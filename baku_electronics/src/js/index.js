document.addEventListener("DOMContentLoaded", async () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartIcon = document.getElementById("cartIcon");
    const cartTooltip = document.getElementById("cartTooltip");
    const cartCount = document.getElementById("cartCount");
    const cartList = document.getElementById("cartList");
    const toTopBtn = document.getElementById("toTopBtn");
    const userBtn = document.getElementById("userBtn");
    const userIcon = document.getElementById("userIcon");

function updateUI(user) {
    if (!userIcon) return;
    if (user) {
        userIcon.className = "ri-user-shared-2-line text-[20px] font-medium";
    } else {
        userIcon.className = "ri-user-line text-[20px] font-medium";
    }
}
const currentUser = JSON.parse(localStorage.getItem("user"));
updateUI(currentUser);

// Btn click
if (userBtn) {
    userBtn.addEventListener("click", () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            localStorage.removeItem("user"); // logout
            updateUI(null); // ikon dəyişir
            alert("Çıxış etdiniz!");
        } else {
        }
    });
}

    // Cart update 
    function updateCart() {
        cartCount.textContent = cart.length;
        cartCount.classList.toggle("hidden", cart.length === 0);

        cartList.innerHTML = "";
        cart.forEach((item, i) => {
            const li = document.createElement("li");
            li.className = "flex justify-between items-center mb-2";

            const info = document.createElement("div");
            info.className = "flex items-center gap-2";

            const img = document.createElement("img");
            img.src = item.image;
            img.alt = item.name;
            img.className = "w-6 h-6 rounded";

            const text = document.createElement("span");
            text.textContent = `${item.name} x${item.quantity} - ${item.price} ₼`;

            info.append(img, text);

            const delBtn = document.createElement("button");
            delBtn.innerHTML = `<i class="ri-delete-bin-line"></i>`;
            delBtn.className = "ml-2 text-red-500 hover:text-red-700 text-lg";
            delBtn.addEventListener("click", () => {
                cart.splice(i, 1);
                localStorage.setItem("cart", JSON.stringify(cart));
                updateCart();
            });

            li.append(info, delBtn);
            cartList.appendChild(li);
        });
    }

    // Məhsulu add
    async function addToCart(btn) {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            alert("Xahiş olunur, əvvəlcə daxil olun!");
            window.location.href = "login.html";
            return;
        }

        const card = btn.closest(".relative");//ilk relative tapilir
        const name = card.querySelector("h3").textContent;
        const image = card.querySelector("img")?.src || "";
        const price = parseFloat(//10 luq say 
            card.querySelector(".flex.justify-between.font-semibold.text-gray-900 span")?.textContent.replace("₼", "").trim()
        ) || 100;

        const exist = cart.find(p => p.name === name);
        if (exist) {
            exist.quantity += 1;
        } else {
            const newItem = { name, image, price, quantity: 1 };
            cart.push(newItem);

            try {
                await fetch("http://localhost:3000/cart", {
                    method: "POST",
                    body: JSON.stringify(newItem)
                });
                console.log("Serverə əlavə edildi:", newItem);
            } catch (err) {
                console.error("Serverə göndərmək alınmadı:", err);
            }
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCart();
        alert(`${name} səbətə əlavə edildi!`);
    }

    // Add to cart 
    document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
        btn.addEventListener("click", () => addToCart(btn));
    });

    //tooltip
    cartIcon.addEventListener("click", () => cartTooltip.classList.toggle("hidden"));
    cartIcon.addEventListener("mouseenter", () => {//elementin uzerine gelende ise dusur
        if (cart.length > 0) cartTooltip.classList.remove("hidden");
    });
    cartTooltip.addEventListener("mouseleave", () => cartTooltip.classList.add("hidden"));

    updateCart();

    // Scroll
    window.addEventListener("scroll", () =>
        toTopBtn.classList.toggle("hidden", window.scrollY <= 300)
    );
    toTopBtn.addEventListener("click", () =>
        window.scrollTo({ top: 0, behavior: "smooth" })
    );
});
