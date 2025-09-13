document.addEventListener("DOMContentLoaded", () => {
    //CART
    const cartTbody = document.getElementById("cartTbody");
    const cartTableWrapper = document.getElementById("cartTableWrapper");
    const emptyCart = document.getElementById("emptyCart");
    const checkoutBtn = document.getElementById("checkoutBtn");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const saveCart = () => localStorage.setItem("cart", JSON.stringify(cart));
    const renderCart = () => {
        if (!cartTbody) return; // Cart səhifəsi yoxdursa çıx
        cartTbody.innerHTML = "";
        if (cart.length === 0) {
            cartTableWrapper.classList.add("hidden");
            emptyCart.classList.remove("hidden");
            return;
        } else {
            cartTableWrapper.classList.remove("hidden");
            emptyCart.classList.add("hidden");
        }

        let totalSum = 0;

        cart.forEach((item, index) => {
            const tr = document.createElement("tr");
            const itemTotal = item.price * item.quantity;
            totalSum += itemTotal;

            tr.className = "border-b";
            tr.innerHTML = `
                <td class="px-6 py-4 flex items-center gap-4">
                    <img src="${item.image}" alt="${item.name}" class="w-12 h-12 rounded-md">
                    <div><p class="text-gray-800 font-medium">${item.name}</p></div>
                </td>
                <td class="px-6 py-4">$${item.price}</td>
                <td class="px-6 py-4 flex items-center gap-2">
                    <button class="px-2 py-1 bg-gray-200 rounded" data-action="decrease">-</button>
                    <span>${item.quantity}</span>
                    <button class="px-2 py-1 bg-gray-200 rounded" data-action="increase">+</button>
                </td>
                <td class="px-6 py-4 font-semibold text-gray-900">$${itemTotal}</td>
            `;

            tr.querySelectorAll("button").forEach(btn => {
                btn.addEventListener("click", () => {
                    if (btn.dataset.action === "increase") item.quantity++;
                    else if (btn.dataset.action === "decrease") {
                        item.quantity--;
                        if (item.quantity <= 0) cart.splice(index, 1);
                    }
                    saveCart();
                    renderCart();
                });
            });

            cartTbody.appendChild(tr);
        });

        const totalRow = document.createElement("tr");
        totalRow.className = "border-t font-semibold";
        totalRow.innerHTML = `
            <td colspan="3" class="px-6 py-4 text-right">Total:</td>
            <td class="px-6 py-4">$${totalSum}</td>
        `;
        cartTbody.appendChild(totalRow);
    };

    renderCart();

    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            window.location.href = "checkout.html";
        });
    }

    //CHECKOUT FORM 
    const checkoutForm = document.getElementById("checkout-form");
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", (e) => {
            e.preventDefault();

            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            let orders = JSON.parse(localStorage.getItem("orders")) || [];

            cart.forEach((item, index) => {
                orders.push({
                    id: Date.now() + index,//unikal id
                    name: item.name,
                    price: item.price * item.quantity,
                    quantity: item.quantity,
                    image: item.image,
                    status: "Gözləmədədir"
                });
            });

            localStorage.setItem("orders", JSON.stringify(orders));
            localStorage.setItem("cart", JSON.stringify([]));

            alert("Sifarişiniz qəbul edildi!");
            window.location.href = "order.html";
        });
    }

    //ORDERS Hissəsi
    const ordersContainer = document.getElementById("orders-container");
    if (ordersContainer) {
        let orders = JSON.parse(localStorage.getItem("orders")) || [];
        ordersContainer.innerHTML = "";

        if (orders.length === 0) {
            ordersContainer.innerHTML = `<p class="text-gray-600">Hələ sifarişiniz yoxdur.</p>`;
        } else {
            orders.forEach((order, index) => {
                const orderCard = document.createElement("div");
                orderCard.className = "flex items-center justify-between gap-4 bg-white p-4 rounded shadow mb-3";

                orderCard.innerHTML = `
                <div class="flex items-center gap-4">
                    <img src="${order.image}" alt="${order.name}" 
                        class="w-20 h-20 object-cover rounded border" />
                    <div>
                        <h2 class="font-semibold text-lg">Sifariş #${index + 1} - ${order.name}</h2>
                        <p class="text-gray-700">Miqdar: ${order.quantity}</p>
                        <p class="text-gray-700">Qiymət: <b>$${order.price}</b></p>
                        <span class="text-sm px-3 py-1 rounded 
                            ${order.status === "Gözləmədədir"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"}">
                            ${order.status}
                        </span>
                    </div>
                </div>
                <button class="delete-btn text-red-600 hover:text-red-800 text-xl">
                    <i class="ri-delete-bin-line"></i>
                </button>
            `;
                orderCard.querySelector(".delete-btn").addEventListener("click", () => {
                    orders.splice(index, 1); //arryden sil
                    localStorage.setItem("orders", JSON.stringify(orders));
                    orderCard.remove(); // DOM-dan sil
                    if (orders.length === 0) {
                        ordersContainer.innerHTML = `<p class="text-gray-600">Hələ sifarişiniz yoxdur.</p>`;
                    }
                });

                ordersContainer.appendChild(orderCard);
            });
        }
    }
});

// TABS Hissəsi
document.addEventListener("DOMContentLoaded", () => {
    const cartTab = document.getElementById("cartTab");
    const ordersTab = document.getElementById("ordersTab");
    const cartSection = document.getElementById("cartSection");
    const ordersSection = document.getElementById("ordersSection");

    if (!cartTab || !ordersTab || !cartSection || !ordersSection) return;

    function showTab(tab) {
        if (tab === "cart") {
            cartSection.classList.remove("hidden");
            ordersSection.classList.add("hidden");

            cartTab.classList.add("border-b-2", "border-red-600", "text-red-600");
            cartTab.classList.remove("text-gray-600");

            ordersTab.classList.remove("border-b-2", "border-red-600", "text-red-600");
            ordersTab.classList.add("text-gray-600");
        } else if (tab === "orders") {
            ordersSection.classList.remove("hidden");
            cartSection.classList.add("hidden");

            ordersTab.classList.add("border-b-2", "border-red-600", "text-red-600");
            ordersTab.classList.remove("text-gray-600");

            cartTab.classList.remove("border-b-2", "border-red-600", "text-red-600");
            cartTab.classList.add("text-gray-600");
        }
    }

    showTab("cart");

    cartTab.addEventListener("click", () => showTab("cart"));
    ordersTab.addEventListener("click", () => showTab("orders"));
});
