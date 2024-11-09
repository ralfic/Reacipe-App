export const swiper = new Swiper('.swiper', {
  direction: 'horizontal',
  autoHeight: true,
  slidesPerView: 2,
  spaceBetween: 16,
  navigation: {
    nextEl: '.swiper-btn-next',
    prevEl: '.swiper-btn-prev',
  },

  breakpoints: {
    800: { slidesPerView: 2, spaceBetween: 14 },
    600: { slidesPerView: 1, spaceBetween: 14 },
    300: { slidesPerView: 1, spaceBetween: 14 },
  },
});
