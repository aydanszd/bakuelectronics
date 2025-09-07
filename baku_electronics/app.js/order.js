document.addEventListener("DOMContentLoaded", () => {
    const cartTbody = document.getElementById("cartTbody");
    const cartTableWrapper = document.getElementById("cartTableWrapper");
    const emptyCart = document.getElementById("emptyCart");

    // LocalStorage=>cart
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const saveCart = () => {
        localStorage.setItem("cart", JSON.stringify(cart));
    };

    const renderCart = () => {
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
            tr.classList.add("border-b");

            const itemTotal = item.price * item.quantity;
            totalSum += itemTotal;

            tr.innerHTML = `
                <td class="px-6 py-4 flex items-center gap-4">
                    <img src="${item.image}" alt="${item.name}" class="w-12 h-12 rounded-md">
                    <div>
                        <p class="text-gray-800 font-medium">${item.name}</p>
                    </div>
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
                    if (btn.dataset.action === "increase") {
                        item.quantity++;
                    } else if (btn.dataset.action === "decrease") {
                        item.quantity--;
                        if (item.quantity <= 0) {
                            cart.splice(index, 1);
                        }
                    }

                    saveCart();  
                    renderCart();
                });
            });

            cartTbody.appendChild(tr);
        });

        const totalRow = document.createElement("tr");
        totalRow.classList.add("border-t", "font-semibold");
        totalRow.innerHTML = `
            <td colspan="3" class="px-6 py-4 text-right">Total:</td>
            <td class="px-6 py-4">$${totalSum}</td>
        `;
        cartTbody.appendChild(totalRow);
    };

    renderCart();
});
