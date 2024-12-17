let cart = [];
let orderIdCounter = JSON.parse(localStorage.getItem('orderIdCounter')) || 1;

// Оновлення відображення кошика
function updateCart() {
    const cartItems = document.querySelector('#cart-items');
    const cartCount = document.getElementById('cart-count');
    cartItems.innerHTML = ''; // Очищаємо таблицю
    let total = 0;

    // Оновлюємо всі елементи кошика, коректно встановлюючи індекси
    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        const row = document.createElement('tr');

        // Додаємо колонку для нумерації
        const cellNumber = document.createElement('td');
        cellNumber.textContent = index + 1; // Нумерація починається з 1
        row.appendChild(cellNumber);

        // Додаємо колонку з фото товару
        const cellImage = document.createElement('td');
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.name;
        img.className = 'cart-item-image'; // Додаємо клас для стилізації
        cellImage.appendChild(img);
        row.appendChild(cellImage);

        // Додаємо колонку з назвою товару
        const cellInfo = document.createElement('td');
        cellInfo.textContent = item.name;
        row.appendChild(cellInfo);

        // Інші поля (кількість, ціна, дії)
        const cellQuantity = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'number';
        input.value = item.quantity;
        input.min = '1';
        input.dataset.index = index;
        input.className = 'update-quantity';
        input.addEventListener('change', (e) => {
            const newQuantity = parseInt(e.target.value, 10);
            cart[index].quantity = newQuantity > 0 ? newQuantity : 1;
            updateCart(); // Оновлюємо кошик
            updateDeliveryCost(); // Оновлюємо ціну доставки
        });
        cellQuantity.appendChild(input);
        row.appendChild(cellQuantity);

        const cellPrice = document.createElement('td');
        cellPrice.textContent = `${item.price} грн`;
        row.appendChild(cellPrice);

        const cellTotalPrice = document.createElement('td');
        cellTotalPrice.textContent = `${item.price * item.quantity} грн`;
        row.appendChild(cellTotalPrice);

        const cellActions = document.createElement('td');
        const button = document.createElement('button');
        button.textContent = 'Видалити';
        button.dataset.index = index;
        button.className = 'remove-item';
        button.addEventListener('click', () => {
            cart.splice(index, 1); // Видаляємо товар з кошика
            updateCart(); // Оновлюємо кошик
            updateDeliveryCost(); // Оновлюємо ціну доставки
        });
        cellActions.appendChild(button);
        row.appendChild(cellActions);

        cartItems.appendChild(row);
    });

    // Оновлюємо кількість товарів у кружечку
    const totalItems = cart.length;
    cartCount.textContent = totalItems;

    // Якщо кошик порожній, обнуляємо загальну суму і скидаємо вибір транспорту
    const totalPrice = document.getElementById('total-price');
    totalPrice.textContent = total;
    if (cart.length === 0) {
        document.querySelectorAll('input[name="transport"]').forEach((radio) => {
            radio.checked = false; // Скидаємо вибір транспорту
        });
        totalPrice.textContent = 0;
        cartCount.textContent = 0;
    }

    // Прокручування таблиці вниз після додавання нового товару
    const cartItemsContainer = document.querySelector('#cart-items');
    cartItemsContainer.scrollTop = cartItemsContainer.scrollHeight;
}





// Додавання товару до кошика
document.querySelectorAll('.add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
        const name = button.getAttribute('data-name');
        const price = Number(button.getAttribute('data-price'));
        const image = button.getAttribute('data-image'); // Отримуємо шлях до зображення

        // Перевірка на наявність товару в кошику
        const existingItem = cart.find((item) => item.name === name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name, price, quantity: 1, image }); // Додаємо зображення
        }

        updateCart(); // Оновлюємо кошик
        updateDeliveryCost(); 
    });
});

// Відкриття модального вікна
document.getElementById('cart-icon').addEventListener('click', () => {
    document.getElementById('cart-modal').classList.add('visible');
});

// Закриття модального вікна
document.getElementById('close-cart').addEventListener('click', () => {
    document.getElementById('cart-modal').classList.remove('visible');
});

// Функція для додавання полів замовлення
function addCheckoutFields() {
    const checkoutSection = document.getElementById('checkout-fields');

    checkoutSection.innerHTML = `
        <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" class="form-control" placeholder="Введіть ваш Email" required>
        </div>
        <div class="form-group">
            <label for="phone">Номер телефону:</label>
            <input type="tel" id="phone" class="form-control" placeholder="Введіть ваш номер" required>
        </div>
        <div class="form-group">
            <label for="city">Місто:</label>
            <input type="text" id="city" class="form-control" placeholder="Введіть ваше місто" required>
        </div>
        <div class="form-group">
            <label for="street">Вулиця:</label>
            <input type="text" id="street" class="form-control" placeholder="Введіть вашу вулицю" required>
        </div>
    `;
}



// Оформлення замовлення
document.getElementById('checkout-button').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Ваш кошик порожній!');
        return;
    }

    const email = document.getElementById('email')?.value;
    const phone = document.getElementById('phone')?.value;
    const city = document.getElementById('city')?.value;
    const street = document.getElementById('street')?.value;
    const transport = document.querySelector('input[name="transport"]:checked')?.value;

    if (!email || !phone || !city || !street || !transport) {
        alert('Будь ласка, заповніть всі поля!');
        return;
    }

    // Створення детальної інформації про замовлення
    const orderDetails = cart.map((item, index) => ({
        id: index + 1,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
    }));

    // Загальна інформація
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryCost = parseFloat(document.getElementById('delivery-cost').textContent) || 0;
    const finalTotal = totalPrice + deliveryCost;

    // Структура для збереження замовлення
    const orderSummary = {
        date: new Date().toLocaleString(),
        customer: {
            email,
            phone,
            city,
            street,
            transport
        },
        items: orderDetails,
        totalItems: orderDetails.reduce((acc, item) => acc + item.quantity, 0),
        totalCost: finalTotal,
        deliveryCost: deliveryCost
    };

    // Збереження замовлення в localStorage
    const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
    existingOrders.push(orderSummary);
    localStorage.setItem('orders', JSON.stringify(existingOrders));

    alert(`Замовлення оформлено!\nДякуємо за покупку.\nЗагальна ціна замовлення: ${finalTotal} грн.`);

    // Очищення кошика після оформлення
    cart = []; 
    updateCart();

    // Закриття модального вікна кошика
    document.getElementById('cart-modal').classList.remove('visible');
});



// Виклик функції для додавання полів
addCheckoutFields();
// Функція для оновлення фінальної суми
function updateCartSummary() {
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryCost = parseInt(document.getElementById('delivery-cost').textContent) || 0;

    // Якщо кошик порожній, анулюємо всі суми
    if (cart.length === 0) {
        document.getElementById('total-price').textContent = 0;
        document.getElementById('delivery-cost').textContent = 0;
        document.getElementById('final-total').textContent = 0;
    } else {
        document.getElementById('total-price').textContent = totalPrice;
        document.getElementById('final-total').textContent = totalPrice + deliveryCost;
    }
}

// Обробка вибору транспорту для доставки
document.querySelectorAll('input[name="transport"]').forEach((radio) => {
    radio.addEventListener('change', () => {
        // Обчислення загальної кількості товарів у кошику
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

        // Вибір транспорту
        const selectedTransport = document.querySelector('input[name="transport"]:checked').value;
        let costPerRange;

        // Визначення вартості доставки для кожного виду транспорту
        if (selectedTransport === 'bike') {
            costPerRange = 1; // Велосипед: базова вартість
        } else if (selectedTransport === 'car') {
            costPerRange = 2; // Автомобіль: базова вартість
        } else if (selectedTransport === 'truck') {
            costPerRange = 3; // Вантажівка: базова вартість
        }

        // Розрахунок кількості діапазонів (10 одиниць на діапазон)
        const ranges = Math.ceil(totalItems / 10); // Кількість діапазонів по 10 одиниць
        const deliveryCost = costPerRange * ranges;

        // Оновлення ціни доставки
        document.getElementById('delivery-cost').textContent = deliveryCost;

        // Оновлюємо фінальну суму
        updateCartSummary();
    });
});

// Функція для оновлення загальної суми кошика
function updateCartSummary() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryCost = parseFloat(document.getElementById('delivery-cost').textContent) || 0;
    const finalTotal = totalPrice + deliveryCost;

    // Оновлення відображення суми в кошику
    document.getElementById('total-price').textContent = totalPrice ;
    document.getElementById('final-total').textContent = finalTotal ;
}

// Функція для оновлення ціни доставки (якщо кількість товарів змінюється)
function updateDeliveryCost() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const selectedTransport = document.querySelector('input[name="transport"]:checked');
    if (!selectedTransport || totalItems === 0) return;

    const transportType = selectedTransport.value;
    let costPerRange;

    if (transportType === 'bike') {
        costPerRange = 1;
    } else if (transportType === 'car') {
        costPerRange = 2;
    } else if (transportType === 'truck') {
        costPerRange = 3;
    }

    const ranges = Math.ceil(totalItems / 10); // Визначення діапазону
    const deliveryCost = costPerRange * ranges;

    document.getElementById('delivery-cost').textContent = deliveryCost;
    updateCartSummary();
}

addCheckoutFields();  // Проста функція, без ланцюга промісів

// Оформлення замовлення
document.getElementById('checkout-button').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Ваш кошик порожній!');
        return;
    }

    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const city = document.getElementById('city').value;
    const street = document.getElementById('street').value;
    const transport = document.getElementById('transport').value;

    if (!email || !phone || !city || !street || !transport) {
        alert('Будь ласка, заповніть всі поля!');
        return;
    }

    alert('Замовлення оформлено! Дякуємо за покупку.');
    cart = []; // Очищення кошика після оформлення
    updateCart();
    document.getElementById('cart-modal').classList.remove('visible');
});


document.getElementById('checkout-button').addEventListener('click', function () {
    // Отримуємо елементи з кошика
    const cartItems = document.querySelectorAll('#cart-items tr');
    const orderDetails = [];

    cartItems.forEach((item, index) => {
        const product = {
            id: index + 1,
            name: item.querySelector('.product-name').textContent,
            quantity: item.querySelector('.product-quantity').textContent,
            price: parseFloat(item.querySelector('.product-price').textContent),
            total: parseFloat(item.querySelector('.product-total').textContent)
        };
        orderDetails.push(product);
    });

    // Загальна інформація
    const totalPrice = parseFloat(document.getElementById('total-price').textContent);
    const deliveryCost = parseFloat(document.getElementById('delivery-cost').textContent);
    const finalTotal = parseFloat(document.getElementById('final-total').textContent);

    // Структура для збереження
    const orderSummary = {
        date: new Date().toLocaleString(),
        items: orderDetails,
        totalItems: orderDetails.reduce((acc, item) => acc + parseInt(item.quantity), 0),
        totalCost: finalTotal,
        deliveryCost: deliveryCost
    };

    // Зберігаємо замовлення у localStorage
    const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
    existingOrders.push(orderSummary);
    localStorage.setItem('orders', JSON.stringify(existingOrders));

    alert('Замовлення оформлено та додано до звіту!');
});


// Скидання вибору транспорту
function clearTransportSelection() {
    const transportOptions = document.querySelectorAll('input[name="transport"]');
    transportOptions.forEach((radio) => {
        radio.checked = false; // Знімаємо позначку
    });

    // Обнуляємо ціну доставки
    document.getElementById('delivery-cost').textContent = 0;

    // Оновлюємо фінальну суму
    updateCartSummary();
}

// Функція для оновлення статусу товару
function updateAvailabilityStatus() {
    const products = document.querySelectorAll('.product');

    products.forEach((product) => {
        const availabilityElement = product.querySelector('.availability');
        const isAvailable = availabilityElement.getAttribute('data-available') === 'true';

        // Оновлення тексту залежно від наявності
        availabilityElement.textContent = isAvailable ? 'Є в наявності' : 'Немає в наявності';

        // Блокування кнопки, якщо товару немає в наявності
        const addToCartButton = product.querySelector('.add-to-cart');
        addToCartButton.disabled = !isAvailable;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchResultsContainer = document.getElementById('search-results');
    const products = document.querySelectorAll('.product');
    const categoryTitle = document.getElementById('category-title').querySelector('h2'); // Заголовок категорії

    // Очищаємо результати пошуку
    function clearSearchResults() {
        searchResultsContainer.innerHTML = ''; // Очищаємо результати пошуку
    }

    // Додаємо товар в результати пошуку
    function addProductToSearchResults(product) {
        const productClone = product.cloneNode(true); // Клонуємо товар
        searchResultsContainer.appendChild(productClone); // Додаємо клонированый товар в контейнер результатів
    }

    // Оновлення заголовка категорії
    function updateCategoryTitle() {
        const selectedCategories = Array.from(document.querySelectorAll('.category-checkbox:checked'))
            .map(checkbox => checkbox.value);

        if (selectedCategories.length === 1) {
            const selectedCategory = selectedCategories[0];
            if (selectedCategory === 'milk') {
                categoryTitle.textContent = 'Молочні продукти';
            } else if (selectedCategory === 'fish') {
                categoryTitle.textContent = 'Риба';
            } else if (selectedCategory === 'meat') {
                categoryTitle.textContent = 'М"ясо';
            } else if (selectedCategory === 'sausage') {
                categoryTitle.textContent = 'Ковбасні вироби';
            } else if (selectedCategory === 'frozen') {
                categoryTitle.textContent = 'Заморожені товари';
            } else if (selectedCategory === 'bread') {
                categoryTitle.textContent = 'Хлібобулочні вироби';
            } else if (selectedCategory === 'vegetables') {
                categoryTitle.textContent = 'Овочі та фрукти';
            } else if (selectedCategory === 'drink') {
                categoryTitle.textContent = 'Напої';
            }
        } else if (selectedCategories.length > 1) {
            categoryTitle.textContent = 'Всі категорії';
        } else {
            categoryTitle.textContent = 'Всі продукти';
        }
    }

    // Фільтрація товарів по категоріях
    function filterProducts() {
        const query = searchInput.value.toLowerCase().trim();
        const selectedCategories = Array.from(document.querySelectorAll('.category-checkbox:checked'))
            .map(checkbox => checkbox.value);

        // Очищаємо попередні результати
        clearSearchResults();

        // Якщо користувач нічого не ввів, не показуємо результати
        if (query === '') {
            products.forEach(product => {
                const productCategory = product.dataset.category;

                // Фільтруємо по категорії
                if (selectedCategories.length === 0 || selectedCategories.includes(productCategory)) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        } 
        else {
            // Якщо є запит для пошуку
            let visibleCount = 0;

            products.forEach(product => {
                const name = product.getAttribute('data-name').toLowerCase();

                // Якщо назва товару містить запит, додаємо товар до результатів
                if (name.includes(query)) {
                    addProductToSearchResults(product);
                } else {
                    product.style.display = 'none'; // Приховуємо продукти, що не відповідають запиту
                }
            });

            // Якщо немає результатів пошуку
            if (visibleCount === 0) {
                searchResultsContainer.innerHTML = '';
            }
            updateCategoryTitle();
            
        }
        updateCategoryTitle(); // Оновлюємо заголовок після фільтрації
    }

    // Подія при введенні тексту в поле пошуку
    searchInput.addEventListener('input', filterProducts);

    // Подія при зміні вибору категорії
    document.querySelectorAll('.category-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', filterProducts);
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const menuDropdown = document.querySelector('.menu-dropdown');

    menuDropdown.addEventListener('click', function () {
        menuDropdown.classList.toggle('active');
    });
});


const products = document.querySelectorAll('.product'); // Вибираємо всі елементи з класом 'product'

products.forEach(product => {
    product.classList.add('hidden'); // Приховуємо кожен продукт
});

products.forEach(product => {
    product.classList.remove('hidden'); // Відображаємо всі продукти
});

document.querySelectorAll('.category-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        filterProducts();
    });
});

function filterProducts() {
    // Отримуємо обрані категорії
    const selectedCategories = Array.from(document.querySelectorAll('.category-checkbox:checked'))
        .map(checkbox => checkbox.value);

    // Фільтруємо товари
    document.querySelectorAll('.product').forEach(product => {
        const productCategory = product.dataset.category;

        // Відображаємо товар, якщо його категорія є серед обраних або якщо нічого не вибрано
        if (selectedCategories.length === 0 || selectedCategories.includes(productCategory)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}














const slides = document.querySelector('.slides');
const slide = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const indicators = document.querySelector('.indicators');

let currentIndex = 0;

// Create indicators
slide.forEach((_, index) => {
    const dot = document.createElement('div');
    if (index === 0) dot.classList.add('active');
    indicators.appendChild(dot);
});

// Update active indicator
function updateIndicators() {
    const dots = document.querySelectorAll('.indicators div');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

// Move to the next slide
function nextSlide() {
    currentIndex = (currentIndex + 1) % slide.length;
    updateSlidePosition();
    updateIndicators();
}

// Move to the previous slide
function prevSlide() {
    currentIndex = (currentIndex - 1 + slide.length) % slide.length;
    updateSlidePosition();
    updateIndicators();
}

// Update slide position
function updateSlidePosition() {
    slides.style.transform = `translateX(-${currentIndex * 100}%)`;
}

// Event listeners
nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Auto-play (optional)
setInterval(nextSlide, 5000);
