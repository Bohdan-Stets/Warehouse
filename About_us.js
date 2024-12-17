document.addEventListener('DOMContentLoaded', function () {
    const menuDropdown = document.querySelector('.menu-dropdown');

    menuDropdown.addEventListener('click', function () {
        menuDropdown.classList.toggle('active');
    });
});














 // Завантаження IFrame API
 var tag = document.createElement('script');
 tag.src = "https://www.youtube.com/iframe_api";
 var firstScriptTag = document.getElementsByTagName('script')[0];
 firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

 // Ініціалізація плеєра
 var player;
 function onYouTubeIframeAPIReady() {
     player = new YT.Player('player', {
         videoId: 'nh7JvKTPK6c', // ID відео
         playerVars: {
             autoplay: 1, // Автоматичне відтворення
             mute: 1,     // Без звуку
             controls: 1, // Відображення контролів
             modestbranding: 1, // Приховати логотип YouTube
             rel: 0       // Вимкнути рекомендації після відео
         },
         events: {
             'onReady': onPlayerReady
         }
     });
 }

 // Коли плеєр готовий
 function onPlayerReady(event) {
     event.target.playVideo(); // Запуск відео
 }
