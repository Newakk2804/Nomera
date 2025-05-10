import { attachAddToCartHandlers } from './display_modal_detail.js';

document.querySelectorAll('.tm-paging-link').forEach((link) => {
  link.addEventListener('click', async (e) => {
    e.preventDefault();
    const categoryId = link.dataset.id;

    handleActiveLink(link);

    try {
      const { foods, featuredFood, user } = await fetchCategoryFoods(categoryId);

      const gallery = document.querySelector('#tm-gallery-page-pizza');
      gallery.innerHTML = '';

      foods.forEach((food) => {
        const article = createFoodArticle(food, featuredFood, user);
        gallery.appendChild(article);
      });

      attachAddToCartHandlers();
    } catch (err) {
      console.error('Ошибка загрузки блюд:', err);
    }
  });
});

function handleActiveLink(link) {
  document.querySelectorAll('.tm-paging-link').forEach((btn) => {
    btn.classList.remove('active');
  });
  link.classList.add('active');
}

async function fetchCategoryFoods(categoryId) {
  const res = await fetch(`/foods/by-category/${categoryId}`);
  return await res.json();
}

function createFoodArticle(food, featuredFood, user) {
  const shortDesc = getShortDescription(food.description);
  const isFavorite = featuredFood.includes(food._id);
  const favoriteButtonHTML = getFavoriteButtonHTML(food, isFavorite, user);

  const article = document.createElement('article');
  article.className = 'col-lg-3 col-md-4 col-sm-6 col-12 tm-gallery-item';
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
  return article;
}

function getShortDescription(description) {
  return description.length > 40 ? description.slice(0, 40) + '...' : description;
}

function getFavoriteButtonHTML(food, isFavorite, user) {
  if (user && user.role === 'user') {
    return `
      <button type="button" class="btn-favorite" data-id="${food._id}">
        <i class="fa-star ${isFavorite ? 'fa-solid' : 'fa-regular'}"></i>
      </button>
    `;
  }
  return '';
}
