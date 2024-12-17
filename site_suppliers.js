document.addEventListener("DOMContentLoaded", () => {
    const productTableBody = document.querySelector("#product-table tbody");
    const warehouseList = document.querySelector("#warehouse-list");

    const supplier = {
        name: "ТОВ Продукт",
        cities: ["Київ", "Львів", "Одеса"],
        contact: "+380 (44) 123-45-67",
        categories: ["Молочні продукти", "Випічка", "Овочі", "Фрукти"],
        warehouses: ["Склад №1 (Київ)", "Склад №2 (Львів)", "Склад №3 (Одеса)"],
        products: [
            { name: "Молоко", description: "Свіже молоко з фермерського господарства.", termStartDate: "2024-12-01", termEndDate: "2024-12-10" },
            { name: "Хліб", description: "Свіжий хліб з пшеничного борошна.", termStartDate: "2024-12-03", termEndDate: "2024-12-15" },
            { name: "Яблука", description: "Смачні яблука з власного саду.", termStartDate: "2024-12-05", termEndDate: "2024-12-12" }
        ]
    };

    // Відображення загальної інформації
    document.getElementById("supplier-name-display").textContent = supplier.name;
    document.getElementById("supplier-cities-display").textContent = supplier.cities.join(", ");
    document.getElementById("supplier-contact-display").textContent = supplier.contact;
    document.getElementById("supplier-categories-display").textContent = supplier.categories.join(", ");

    // Відображення складів
    supplier.warehouses.forEach((warehouse) => {
        const listItem = document.createElement("li");
        listItem.textContent = warehouse;
        warehouseList.appendChild(listItem);
    });

    // Відображення товарів
    function renderTable() {
        productTableBody.innerHTML = "";

        supplier.products.forEach((product) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><img src="https://via.placeholder.com/50" alt="${product.name}"></td>
                <td>${product.name}</td>
                <td>${product.description}</td>
                <td>${product.termStartDate} / ${product.termEndDate}</td>
            `;
            productTableBody.appendChild(row);
        });
    }

    renderTable();

    // Обробка меню
    const menuDropdown = document.querySelector('.menu-dropdown');
    if (menuDropdown) {
        menuDropdown.addEventListener('click', function () {
            menuDropdown.classList.toggle('active');
        });
    }
});




function searchProduct() {
    // Отримуємо введений текст
    const searchQuery = document.getElementById("searchInput").value.toLowerCase();
    
    // Отримуємо всі рядки таблиці
    const rows = document.querySelectorAll("table tbody tr");

    // Проходимо через кожен рядок таблиці
    rows.forEach(row => {
        // Отримуємо назву товару зі другого стовпця
        const productName = row.cells[1].textContent.toLowerCase();

        // Перевіряємо, чи містить назва товару введений текст
        if (productName.includes(searchQuery)) {
            // Якщо містить, то показуємо рядок
            row.style.display = "";
        } else {
            // Якщо не містить, приховуємо рядок
            row.style.display = "none";
        }
    });
}



document.addEventListener('DOMContentLoaded', function () {
    const menuDropdown = document.querySelector('.menu-dropdown');

    menuDropdown.addEventListener('click', function () {
        menuDropdown.classList.toggle('active');
    });
});



document.addEventListener("DOMContentLoaded", () => {
    // Слайд-шоу
    let currentIndex = 0;
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active', 'prev');
            if (i === index) {
                slide.classList.add('active');
            } else if (i === index - 1 || (index === 0 && i === totalSlides - 1)) {
                slide.classList.add('prev');
            }
        });
    }
    
    setInterval(() => {
        currentIndex = (currentIndex + 1) % totalSlides;
        showSlide(currentIndex);
    }, 3000);  // Зміна кожні 3 секунди
    
    showSlide(currentIndex);
});
