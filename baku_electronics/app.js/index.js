document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch("http://localhost:3000/cart");
        const serverCart = await res.json();
        console.log("Serverdən gələn cart:", serverCart);
    } catch (err) {
        console.error("Serverdən cart gəlmədi:", err);
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const cartIcon = document.getElementById("cartIcon");
    const cartTooltip = document.getElementById("cartTooltip");
    const cartCount = document.getElementById("cartCount");
    const cartList = document.getElementById("cartList");

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

    async function addToCart(btn) {
        const user = localStorage.getItem("user");
        if (!user) {
            alert("Xahiş olunur, əvvəlcə daxil olun!");
            window.location.href = "login.html";
            return;
        }

        const card = btn.closest(".relative");//closest=>ilk relative tapir
        const name = card.querySelector("h3").textContent;
        const image = card.querySelector("img") ? card.querySelector("img").src : "";
        const price = parseFloat(card.querySelector(".flex.justify-between.font-semibold.text-gray-900 span")?.textContent.replace("₼", "").trim()) || 100;//10'luq  say sistemine kecirdir
        const exist = cart.find(p => p.name === name);
        if (exist) {
            exist.quantity += 1;
        } else {
            const newItem = { name, image, price, quantity: 1 };
            cart.push(newItem);

            try {
                await fetch("http://localhost:3000/cart", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
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

    document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
        btn.addEventListener("click", () => addToCart(btn));
    });

    cartIcon.addEventListener("click", () => cartTooltip.classList.toggle("hidden"));
    cartIcon.addEventListener("mouseenter", () => {
        if (cart.length > 0) cartTooltip.classList.remove("hidden");
    });
    cartTooltip.addEventListener("mouseleave", () => cartTooltip.classList.add("hidden"));

    updateCart();
});
document.addEventListener("DOMContentLoaded", function () {
    const loader = document.createElement("div");
    loader.id = "loader";
    loader.className = "fixed inset-0 flex flex-col items-center justify-center bg-white z-50 transition-opacity duration-500";

    loader.innerHTML = `
        <div class="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-gray-600 font-medium">Yüklənir...</p>
    `;
    document.body.appendChild(loader);
    setTimeout(function () {
        loader.style.opacity = "0"; 
        setTimeout(() => {
            loader.remove(); 
        }, 500); 
    }, 1000);
});
const toTopBtn = document.getElementById("toTopBtn");
window.addEventListener("scroll", () => 
    toTopBtn.classList.toggle("hidden", window.scrollY <= 300)
);
toTopBtn.addEventListener("click", () => 
    window.scrollTo({ top: 0, behavior: "smooth" })
);
