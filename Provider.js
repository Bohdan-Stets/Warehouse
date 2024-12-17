document.addEventListener('DOMContentLoaded', function () {
    const menuDropdown = document.querySelector('.menu-dropdown');

    menuDropdown.addEventListener('click', function () {
        menuDropdown.classList.toggle('active');
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const deliveryHistoryTable = document.querySelector("#delivery-history tbody");
    const deliveryForm = document.getElementById("add-delivery-form");

    // Example data for supplier
    const deliveries = [
        { date: "2024-12-10", product: "Молоко", quantity: 100, price: 20 },
        { date: "2024-12-12", product: "Морква", quantity: 50, price: 15 }
    ];

    // Function to render delivery history
    function renderDeliveryHistory() {
        deliveryHistoryTable.innerHTML = "";
        deliveries.forEach(({ date, product, quantity, price }) => {
            const total = quantity * price;
            const row = `
                <tr>
                    <td>${date}</td>
                    <td>${product}</td>
                    <td>${quantity}</td>
                    <td>${price}</td>
                    <td>${total}</td>
                </tr>`;
            deliveryHistoryTable.insertAdjacentHTML("beforeend", row);
        });
    }

    // Add new delivery
    deliveryForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const date = document.getElementById("delivery-date").value;
        const product = document.getElementById("delivery-product").value;
        const quantity = parseInt(document.getElementById("delivery-quantity").value, 10);
        const price = parseFloat(document.getElementById("delivery-price").value);

        deliveries.push({ date, product, quantity, price });
        renderDeliveryHistory();
        deliveryForm.reset();
    });

    renderDeliveryHistory();
});
