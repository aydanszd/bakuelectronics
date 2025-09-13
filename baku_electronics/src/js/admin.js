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
        uploadInput.addEventListener("change", () => {
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

    let editId = null; //unikal ID saxlayir

    if (submitBtn) {
        submitBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            if (!nameInput.value || !urlInput.value || !priceInput.value)
                return alert("Xanaları doldurun!");

            const productData = {
                name: nameInput.value,
                url: urlInput.value,
                price: parseFloat(priceInput.value)
            };

            if (editId) {
                // məhsulu update
                await fetch(`http://localhost:3000/product/${editId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(productData)
                });
                editId = null;
                submitBtn.textContent = "Məhsul əlavə et";
            } else {
                // Yeni məhsul
                await fetch("http://localhost:3000/product", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(productData)
                });
            }


            nameInput.value = "";
            urlInput.value = "";
            priceInput.value = "";

            // Admin,index update
            loadAdminProducts();
            loadIndexProducts();
        });
    }

    if (cleanBtn) {
        cleanBtn.addEventListener("click", (e) => {
            e.preventDefault();
            nameInput.value = "";
            urlInput.value = "";
            priceInput.value = "";
            submitBtn.textContent = "Məhsul əlavə et";
            editId = null; // boş rejim
        });
    }

    loadAdminProducts();

    // Index məhsulları
    const productContainer = document.getElementById("product-list");
    const staticProducts = document.getElementById("static-products");

    async function loadIndexProducts() {
        if (!productContainer) return;
        const res = await fetch("http://localhost:3000/product");
        const products = await res.json();

        productContainer.innerHTML = "";
        if (products.length === 0) {
            if (staticProducts) staticProducts.style.display = "grid";
            return;
        } else if (staticProducts) {
            staticProducts.style.display = "none";
        }

        products.forEach((p) => {
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

            // Səbətə əlavə et
            const btn = div.querySelector("button");
            btn.addEventListener("click", async () => {
                const cart = JSON.parse(localStorage.getItem("cart")) || [];
                const existing = cart.find(item => item.name === p.name);

                if (existing) {
                    existing.quantity += 1;
                } else {
                    cart.push({ name: p.name, price: p.price, image: p.url, quantity: 1 });
                    await fetch("http://localhost:3000/cart", {
                        method: "POST",
                        body: JSON.stringify({
                            name: p.name,
                            price: p.price,
                            image: p.url,
                            quantity: 1
                        })
                    });
                }
                localStorage.setItem("cart", JSON.stringify(cart));
                alert(`${p.name} səbətə əlavə edildi!`);
            });
        });
    }
    async function loadAdminProducts() {
        if (!adminTable) return;
        const res = await fetch("http://localhost:3000/product");
        const products = await res.json();

        adminTable.innerHTML = "";

        products.forEach((p, i) => {
            const tr = document.createElement("tr");
            tr.className = "border-b";

            tr.innerHTML = `
            <td class="px-6 py-3">${i + 1}</td>
            <td class="px-6 py-3"><img src="${p.url}" class="w-12 h-12 rounded-md"></td>
            <td class="px-6 py-3">${p.name}</td>
            <td class="px-6 py-3">${p.price} ₼</td>
            <td class="px-6 py-3 text-center">
                <button class="edit-btn text-blue-500 hover:text-blue-700">
                    <i class="ri-edit-2-fill text-xl"></i>
                </button>
            </td>
            <td class="px-6 py-3 text-center">
                <button class="delete-btn text-red-500 hover:text-red-700">
                    <i class="ri-delete-bin-5-fill text-xl"></i>
                </button>
            </td>
        `;

            //Edit
            tr.querySelector(".edit-btn").addEventListener("click", () => {
                nameInput.value = p.name;
                urlInput.value = p.url;
                priceInput.value = p.price;
                editId = p.id;
                submitBtn.textContent = "Update Product";
            });

            //Delete
            tr.querySelector(".delete-btn").addEventListener("click", async () => {
                if (!confirm("Bu məhsulu silmək istədiyinizə əminsiniz?")) return;
                await fetch(`http://localhost:3000/product/${p.id}`, { method: "DELETE" });
                loadAdminProducts();
            });

            adminTable.appendChild(tr);
        });
    }

    loadIndexProducts();
});
