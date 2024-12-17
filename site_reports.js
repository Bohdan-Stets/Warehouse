
document.addEventListener('DOMContentLoaded', function () {
    const menuDropdown = document.querySelector('.menu-dropdown');

    menuDropdown.addEventListener('click', function () {
        menuDropdown.classList.toggle('active');
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Отримуємо дані з localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // DOM-елементи
    const totalItemsEl = document.getElementById('total-items');
    const totalCostEl = document.getElementById('total-cost');
    const ordersList = document.getElementById('orders-list');
    const clearOrdersButton = document.getElementById('clear-orders');

    let totalItems = 0; // Лічильник товарів
    let totalCost = 0; // Лічильник суми

    if (orders.length === 0) {
        ordersList.innerHTML = '<p>Замовлень поки що немає.</p>';
    } else {
        orders.forEach((order, index) => {
            // Перевірка чи є items у замовленні
            if (!order.items || order.items.length === 0) {
                console.error(`Замовлення #${index + 1} не містить товарів.`);
                return;
            }
            
            // Додаємо секцію для кожного замовлення
            const orderSection = document.createElement('div');
            orderSection.classList.add('order-section');

            // HTML-код для секції замовлення
            orderSection.innerHTML = `
                <h4>Замовлення #${index + 1} (${order.date})</h4>
                <table class="styled-table">
                    <thead>
                        <tr>
                            <th>№</th>
                            <th>Назва товару</th>
                            <th>Кількість</th>
                            <th>Ціна за одиницю</th>
                            <th>Загальна ціна</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map((item, i) => `
                            <tr>
                                <td>${i + 1}</td>
                                <td>${item.name || 'Невідомий товар'}</td>
                                <td>${item.quantity || 0}</td>
                                <td>${item.price ? item.price.toFixed(2) : '0.00'} грн</td>
                                <td>${(item.quantity * item.price).toFixed(2) || '0.00'} грн</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <p><strong>Ціна доставки:</strong> ${order.deliveryCost ? order.deliveryCost.toFixed(2) : '0.00'} грн</p>
                <p><strong>Загальна вартість замовлення:</strong> ${order.totalCost ? order.totalCost.toFixed(2) : '0.00'} грн</p>
                <hr />
            `;

            ordersList.appendChild(orderSection);

            // Підрахунок загальної кількості і вартості
            totalItems += order.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
            totalCost += order.totalCost || 0;
        });

        // Оновлення загальної кількості товарів і вартості
        totalItemsEl.textContent = totalItems;
        totalCostEl.textContent = totalCost.toFixed(2);
    }

    // Обробник для кнопки очищення замовлень
    clearOrdersButton.addEventListener('click', function () {
        if (confirm('Ви впевнені, що хочете очистити всі замовлення?')) {
            localStorage.removeItem('orders'); // Видаляємо замовлення з localStorage
            location.reload(); // Оновлюємо сторінку
        }
    });
});


orders.forEach((order, index) => {
    console.log(`Замовлення #${index + 1}:`, order); // Додаткове логування

    // Генерація HTML-структури
    const orderSection = document.createElement('div');
    orderSection.classList.add('order-section');

    orderSection.innerHTML = `
        <h4>Замовлення #${index} (${order.date})</h4>
        <table class="styled-table">
            <thead>
                <tr>
                    <th>№</th>
                    <th>Назва товару</th>
                    <th>Кількість</th>
                    <th>Ціна за одиницю</th>
                    <th>Загальна ціна</th>
                </tr>
            </thead>
            <tbody>
                ${order.items.map((item, i) => `
                    <tr>
                        <td>${i + 1}</td>
                        <td>${item.name || 'Невідомий товар'}</td>
                        <td>${item.quantity || 0}</td>
                        <td>${item.price ? item.price.toFixed(2) : '0.00'} грн</td>
                        <td>${item.price && item.quantity ? (item.quantity * item.price).toFixed(2) : '0.00'} грн</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <p><strong>Ціна доставки:</strong> ${order.deliveryCost ? order.deliveryCost.toFixed(2) : '0.00'} грн</p>
        <p><strong>Загальна вартість замовлення:</strong> ${order.totalCost ? order.totalCost.toFixed(2) : '0.00'} грн</p>
        <hr />
    `;

    // Додаємо секцію в DOM
    ordersList.appendChild(orderSection);
});
