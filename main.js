document.addEventListener('DOMContentLoaded', function () {
    const menuDropdown = document.querySelector('.menu-dropdown');

    menuDropdown.addEventListener('click', function () {
        menuDropdown.classList.toggle('active');
    });
});
