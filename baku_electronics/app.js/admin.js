document.addEventListener("DOMContentLoaded", () => {
    const nameInput = document.getElementById("name");
    const urlInput = document.getElementById("url");
    const priceInput = document.getElementById("price");
    const submitBtn = document.getElementById("submit");
    const cleanBtn = document.getElementById("clean");
    const adminTable = document.getElementById("adminProductTable");
    const profileImage = document.getElementById("profileImage");
    const uploadInput = document.getElementById("upload");

    if (profileImage && uploadInput) {
        profileImage.addEventListener("click", () => uploadInput.click());
        uploadInput.addEventListener("change", (e) => {
            const file = uploadInput.files[0]; 
            if (file) {
                const reader = new FileReader();
                reader.onload = () => urlInput.value = reader.result;
                reader.readAsDataURL(file);
            }
        });
    }

    async function loadAdminProducts() {
        if (!adminTable) return;
        const res = await fetch("http://localhost:3000/product");
        const products = await res.json();
        adminTable.innerHTML = "";
        products.forEach((p, i) => {
            adminTable.innerHTML += `
                <tr class="border-b">
                    <td class="px-6 py-3">${i + 1}</td>
                    <td class="px-6 py-3"><img src="${p.url}" class="w-12 h-12 rounded-md"></td>
                    <td class="px-6 py-3">${p.name}</td>
                    <td class="px-6 py-3">${p.price} ₼</td>
                </tr>
            `;
        });
    }

    if (submitBtn) {
        submitBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            if (!nameInput.value || !urlInput.value || !priceInput.value) return alert("Xanaları doldurun!");
            const newProduct = {
                name: nameInput.value,
                url: urlInput.value,
                price: priceInput.value
            };
            await fetch("http://localhost:3000/product", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProduct)
            });
            nameInput.value = "";
            urlInput.value = "";
            priceInput.value = "";
            loadAdminProducts();
        });
    }
    if (cleanBtn) {
        cleanBtn.addEventListener("click", async () => {
            const res = await fetch("http://localhost:3000/product");
            const products = await res.json();
            if (products.length === 0) return alert("Silinəcək məhsul yoxdur!");
            for (let p of products) {
                await fetch(`http://localhost:3000/product/${p.id}`, { method: "DELETE" });
            }
            alert("Bütün məhsullar silindi!");
            loadAdminProducts();
        });
    }
    loadAdminProducts();
    const productContainer = document.getElementById("product-list");
    const staticProducts = document.getElementById("static-products");

    async function loadIndexProducts() {
        if (!productContainer) return;
        const res = await fetch("http://localhost:3000/product");
        const products = await res.json();//jsone=>js

        productContainer.innerHTML = "";
        if (products.length === 0) {
            if (staticProducts) staticProducts.style.display = "grid";
            return;
        } else if (staticProducts) {
            staticProducts.style.display = "none";
        }

        products.forEach((p, index) => {
            const div = document.createElement("div");
            div.className = "relative bg-[#f5f5f5] shadow-md rounded-[25px] p-4 flex flex-col";
            div.innerHTML = `
                <div class="flex justify-center mb-4">
                    <img src="${p.url}" class="rounded-[25px] border border-gray-200 object-contain">
                </div>
                <h3 class="text-gray-800 font-semibold text-[14px] mb-2">${p.name}</h3>
                <div class="flex justify-between font-semibold text-gray-900 mb-4">
                    <span class="text-[20px]">${p.price} ₼</span>
                </div>
                <button class="add-to-cart-btn flex items-center px-[14px] py-[10px] justify-start flex-1 bg-[#e1e1e1] text-black hover:bg-red-600 hover:text-white rounded-[8px]">
                    <i class="ri-shopping-cart-line ml-4 mr-2"></i>
                    <span class="text-[14px] font-semibold">Səbətə əlavə et</span>
                </button>
            `;
            productContainer.appendChild(div);
            const btn = div.querySelector("button");
            btn.addEventListener("click", async () => {
                const cart = JSON.parse(localStorage.getItem("cart")) || [];
                const existing = cart.find(item => item.name === p.name);
                if (existing) existing.quantity += 1;
                else {
                    cart.push({ name: p.name, price: p.price, image: p.url, quantity: 1 });
                    await fetch("http://localhost:3000/cart", {
                        method: "POST",
                        body: JSON.stringify({ name: p.name, price: p.price, image: p.url, quantity: 1 })
                    });
                }
                localStorage.setItem("cart", JSON.stringify(cart));
                alert(`${p.name} səbətə əlavə edildi!`);
            });
        });
    }
    loadIndexProducts();
});
