import { attachAddToCartHandlers } from './display_modal_detail.js';

document.querySelectorAll('.tm-paging-link').forEach((link) => {
  link.addEventListener('click', async (e) => {
    e.preventDefault();
    const categoryId = link.dataset.id;

    document.querySelectorAll('.tm-paging-link').forEach((btn) => {
      btn.classList.remove('active');
    });
    link.classList.add('active');

    try {
      const res = await fetch(`/foods/by-category/${categoryId}`);
      const { foods, featuredFood, user } = await res.json();

      const gallery = document.querySelector('#tm-gallery-page-pizza');
      gallery.innerHTML = '';

      foods.forEach((food) => {
        const shortDesc =
          food.description.length > 40 ? food.description.slice(0, 40) + '...' : food.description;

        const isFavorite = featuredFood.includes(food._id);

        const article = document.createElement('article');
        article.className = 'col-lg-3 col-md-4 col-sm-6 col-12 tm-gallery-item';
        const showFavorite = user && user.role === 'user';
        const favoriteButtonHTML = showFavorite
          ? `<button type="button" class="btn-favorite" data-id="${food._id}">
            <i class="fa-star ${isFavorite ? 'fa-solid' : 'fa-regular'}"></i>
            </button>`
          : '';

        article.innerHTML = `
          <figure>
            <img src="${food.imageUrl}" alt="${food.title}" class="img-fluid tm-gallery-img" />
            ${favoriteButtonHTML}
            <figcaption>
              <div class="gallery-title-block">
                <h4 class="tm-gallery-title">${food.title}</h4>
              </div>
              <p class="tm-gallery-description">${shortDesc}</p>
              <div class="block-price-button">
                <p class="tm-gallery-price">${food.price} BYN</p>
                <button type="button" class="btn-add-cart" data-id="${food._id}">Выбрать</button>
              </div>
            </figcaption>
          </figure>
        `;

        gallery.appendChild(article);
      });
      attachAddToCartHandlers();
    } catch (err) {
      console.error('Ошибка загрузки блюд:', err);
    }
  });
});
