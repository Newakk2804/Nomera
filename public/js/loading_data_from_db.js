document.querySelectorAll('.tm-paging-link').forEach(link => {
  link.addEventListener('click', async (e) => {
    e.preventDefault();
    const categoryId = link.dataset.id;

    document.querySelectorAll('.tm-paging-link').forEach(btn => {
      btn.classList.remove('active');
    });
    link.classList.add('active');

    try {
      const res = await fetch(`/foods/by-category/${categoryId}`);
      const foods = await res.json();

      const gallery = document.querySelector('#tm-gallery-page-pizza');
      gallery.innerHTML = '';

      foods.forEach(food => {
        const shortDesc = food.description.length > 40
          ? food.description.slice(0, 40) + '...'
          : food.description;

        const article = document.createElement('article');
        article.className = 'col-lg-3 col-md-4 col-sm-6 col-12 tm-gallery-item';
        article.innerHTML = `
          <figure>
            <img src="${food.imageUrl}" alt="${food.title}" class="img-fluid tm-gallery-img" />
            <figcaption>
              <div class="gallery-title-block">
                <h4 class="tm-gallery-title">${food.title}</h4>
              </div>
              <p class="tm-gallery-description">${shortDesc}</p>
              <div class="block-price-button">
                <p class="tm-gallery-price">${food.price} BYN</p>
                <button type="button" class="btn-add-cart">В корзину</button>
              </div>
            </figcaption>
          </figure>
        `;

        gallery.appendChild(article);
      });
    } catch (err) {
      console.error('Ошибка загрузки блюд:', err);
    }
  });
});