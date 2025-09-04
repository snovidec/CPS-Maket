document.addEventListener("DOMContentLoaded", function () {
  // Инициализация слайдера Swiper с указанными параметрами
  const swiper = new Swiper(".swiper-container", {
    // Исправлено название класса
    // Отступ перед первым слайдом (в пикселях)
    slidesOffsetBefore: 16,
    // Количество отображаемых слайдов (1.3 означает частичный показ следующего)
    slidesPerView: 1.3,
    // Расстояние между слайдами (в пикселях)
    spaceBetween: 32,
    // Отступ после последнего слайда (в пикселях)
    slidesOffsetAfter: 16,
    // Ограничение, чтобы активный слайд не выходил за границы контейнера
    centeredSlidesBounds: true,
    // Настройки пагинации (точек навигации)
    pagination: {
      // Селектор элемента для пагинации
      el: ".swiper-pagination",
      // Возможность переключать слайды по клику на точки
      clickable: true,
    },
  }); // Получаем кнопку переключения по ID
  const toggleButton = document.getElementById("toggleButton");
  // Получаем изображение
  const navImg = document.querySelector(".nav-img");
  // Получаем все элементы слайдов
  const gridItems = document.querySelectorAll(".swiper-slide");
  // Флаг для отслеживания состояния (развернуто/свернуто)
  let isExpanded = false;
  // Добавляем обработчик клика на кнопку
  toggleButton.addEventListener("click", () => {
    // Если элементы развернуты
    if (isExpanded) {
        // Перебираем все элементы слайдов
        gridItems.forEach((item, index) => {
            // Проверяем ширину окна
            if (window.innerWidth >= 1120) {
                // Скрываем элементы начиная с 8-го (индекс 7 и выше)
                if (index >= 8) {
                    item.classList.add("hidden"); // Добавляем класс hidden
                     } else {

                if (window.innerWidth <= 768) {
                // Скрываем элементы начиная с 6-го (индекс 5 и выше)
                 } if (index >= 6) {
                    item.classList.add("hidden"); // Добавляем класс hidden
                }
            }
        });
      // Меняем текст кнопки на "Показать всё"
      toggleButton.textContent = "Показать всё";
      navImg.classList.remove('rotated');
    } else {
      // Если элементы свернуты - показываем все
      gridItems.forEach((item) => {
        item.classList.remove("hidden"); // Удаляем класс hidden
      });
      // Меняем текст кнопки на "Скрыть"
      toggleButton.textContent = "Скрыть";
      navImg.classList.add('rotated');
    }
     isExpanded = !isExpanded;
  });
});

// Версия 2

let swiper;
let sliderInit = false;
const mediaSize = 767;

function initSlider() {
  if (sliderInit) return;

  swiper = new Swiper(".swiper", {
    slidesPerView: 1.3,
    spaceBetween: 16,    
    pagination: { el: '.swiper-pagination', clickable: true  },
    breakpoints: {
    768: { enabled: false } 
    }
  });

  sliderInit = true;
}

function destroySlider() {
  if (!sliderInit || !swiper) return;

  swiper.destroy(true, true); // Полное уничтожение с очисткой всех событий

  // Дополнительно: возвращаем слайдер в исходное состояние
  swiper = null;
  sliderInit = false;
}

function checkWidth() {
  window.innerWidth <= mediaSize ? initSlider() : destroySlider();
}

// Добавляем троттлинг для оптимизации
let resizeTimeout;
function handleResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(checkWidth, 30);
}

window.addEventListener("load", checkWidth);
window.addEventListener("resize", handleResize);

document.querySelectorAll(".about__read-more").forEach(
  btn =>
    (btn.onclick = e => {
      const s = e.target.previousElementSibling;
      btn.lastElementChild.textContent = s.classList.toggle("active")
        ? "Скрыть"
        : "Показать все";
      e.target
        .closest(".about__read-more")
        .previousElementSibling.classList.toggle("active");
    })
);

// Версия 3

document.addEventListener("DOMContentLoaded", () => {
  const BREAKPOINT = 768;

  const container = document.getElementById("swiper");          // .swiper
  const wrapper   = document.getElementById("wrapper");          // .swiper-wrapper
  const slides    = Array.from(wrapper.children);                // .swiper-slide
  const readMore  = document.querySelector(".about__read-more");
  const readText  = document.querySelector(".read-more__text");
  const readArrow = document.querySelector(".read-more__expand");
  const pagination= document.getElementById("pagination");

  let swiper = null;
  let mode = null;        // 'desktop' | 'mobile'
  let expanded = false;

  // утилита: показать первые N карточек
  function showFirst(n) {
    slides.forEach((slide, i) => {
      slide.style.display = i < n ? "block" : "none";
    });
  }

  function destroySwiper() {
    if (swiper) {
      swiper.destroy(true, true);
      swiper = null;
    }
    // Чистим инлайны, которые мог навесить Swiper
    wrapper.style.transform = "";
    wrapper.style.width = "";
  }

  function initDesktop() {
    if (mode === "desktop") return;
    mode = "desktop";

    destroySwiper();

    // ВЕРНУТЬ сетку на десктопе
    wrapper.style.display = "grid"; // перекрываем #wrapper {display:grid} явно
    // Пагинацию скрыть (перекрываем #pagination {... !important})
    if (pagination) pagination.style.setProperty("display", "none", "important");

    // Кнопка видима
    if (readMore) readMore.style.display = "flex";

    // Свернутое состояние по умолчанию
    expanded = false;
    showFirst(8);
    container.classList.remove("active"); // из твоего CSS: .swiper.active -> убираем max-height
    if (readText)  readText.textContent = "Показать все";
    if (readArrow) readArrow.classList.remove("active");

    // Обработчик «Показать все / Скрыть все»
    if (readMore) {
      readMore.onclick = () => {
        if (!expanded) {
          showFirst(11);
          container.classList.add("active");          // убирает max-height
          if (readText)  readText.textContent = "Скрыть все";
          if (readArrow) readArrow.classList.add("active"); // поворот стрелки по твоему CSS
        } else {
          showFirst(8);
          container.classList.remove("active");
          if (readText)  readText.textContent = "Показать все";
          if (readArrow) readArrow.classList.remove("active");
        }
        expanded = !expanded;
      };
    }
  }

  function initMobile() {
    if (mode === "mobile") return;
    mode = "mobile";

    // Показать все карточки
    slides.forEach(slide => {
      slide.style.display = "block";
      // чистим возможные десктопные инлайны
      slide.style.marginRight = "";
      slide.style.width = "";
    });

    // ВАЖНО: для работы Swiper wrapper должен быть flex (ID #wrapper в твоём CSS делает grid и ломает слайдер)
    wrapper.style.display = "flex"; // инлайн перебьёт #wrapper{display:grid}

    // Показать пагинацию (в CSS есть #pagination {display:none !important;}, перебиваем инлайном с !important)
    if (pagination) pagination.style.setProperty("display", "block", "important");

    // Спрятать «Показать все»
    if (readMore) readMore.style.display = "none";
    container.classList.remove("active");

    // Инициализация Swiper
    swiper = new Swiper("#swiper", {
      slidesPerView: "auto",   // карточки по 240px уже заданы в CSS
      spaceBetween: 16,
      pagination: {
        el: "#pagination",
        clickable: true,
      },
    });
  }

  function applyMode() {
    if (window.innerWidth >= BREAKPOINT) {
      initDesktop();
    } else {
      initMobile();
    }
  }

  // Антидребезг ресайза
  function debounce(fn, ms) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(null, args), ms);
    };
  }

  applyMode();
  window.addEventListener("resize", debounce(applyMode, 150));
});