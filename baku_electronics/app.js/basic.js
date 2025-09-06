const swiper = new Swiper('.swiper', {
  direction: 'horizontal',
  loop: true,

  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },

  navigation: {
    nextEl: '.custom-next',
    prevEl: '.custom-prev',
  },

  scrollbar: {
    el: '.swiper-scrollbar',
},
});
