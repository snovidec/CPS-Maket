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