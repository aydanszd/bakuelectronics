document.addEventListener("DOMContentLoaded", () => {
    const steps = document.querySelectorAll(".step");
    const nextBtn = document.getElementById("next-btn");
    const prevBtn = document.getElementById("prev-btn");
    const checkoutForm = document.getElementById("checkout-form"); // form
    const indicators = [
        document.getElementById("indicator-1"),
        document.getElementById("indicator-2"),
        document.getElementById("indicator-3")
    ];
    const lines = [
        document.getElementById("line-1"),
        document.getElementById("line-2")
    ];
    const progressBar = document.getElementById("progress-bar");

    let currentStep = 0;
    function showStep(index) {
        steps.forEach((step, i) => step.classList.toggle("hidden", i !== index));
        prevBtn.classList.toggle("hidden", index === 0);
        nextBtn.textContent = index === steps.length - 1 ? "Submit Order" : "Next";

        indicators.forEach((ind, i) => {
            ind.classList.toggle("bg-red-600", i <= index);
            ind.classList.toggle("text-white", i <= index);
            ind.classList.toggle("bg-gray-300", i > index);
            ind.classList.toggle("text-gray-600", i > index);
        });

        lines.forEach((line, i) => {
            line.classList.toggle("bg-red-600", i < index);
            line.classList.toggle("bg-gray-300", i >= index);
        });

        progressBar.style.width = `${((index + 1) / steps.length) * 100}%`;
    }

    function validateStep(stepIndex) {
        const inputs = steps[stepIndex].querySelectorAll("input");
        for (let input of inputs) {
            if (input.value.trim() === "") {
                alert("Xahiş olunur bütün xanaları doldurun!");
                input.focus();
                return false;
            }
        }
        return true;
    }

    nextBtn.addEventListener("click", (e) => {
        e.preventDefault();

        if (!validateStep(currentStep)) return;

        if (currentStep < steps.length - 1) {
            currentStep++;

            if (currentStep === 2) {
                document.getElementById("review-name").textContent =
                    document.querySelector("#step-1 input[placeholder='Name']").value;

                document.getElementById("review-email").textContent =
                    document.querySelector("#step-1 input[placeholder='Email']").value;

                const street = document.querySelector("#step-2 input[placeholder='Street Address']").value;
                const city = document.querySelector("#step-2 input[placeholder='City']").value;
                const postal = document.querySelector("#step-2 input[placeholder='Postal Code']").value;

                document.getElementById("review-address").textContent =
                    `${street}, ${city}, ${postal}`;
            }

            showStep(currentStep);
        } else {
            checkoutForm.requestSubmit();
        }
    });

    prevBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    });

    // checkoutForm.addEventListener("submit", (e) => {
    //     e.preventDefault();

    //     if (!validateStep(0) || !validateStep(1)) {
    //         currentStep = 0;
    //         showStep(currentStep);
    //         return;
    //     }

    //     const cart = JSON.parse(localStorage.getItem("cart")) || [];
    //     if (cart.length === 0) {
    //         // alert("Səbət boşdur!");
    //         return;
    //     }

        let orders = JSON.parse(localStorage.getItem("orders")) || [];

        cart.forEach((item, index) => {
            orders.push({
                id: Date.now() + index,
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

    showStep(currentStep);

