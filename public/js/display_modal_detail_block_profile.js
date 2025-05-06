function attachAddToCartHandlers() {
  document.querySelector('.profile-content')?.addEventListener('click', (e) => {
    const button = e.target.closest('.btn-add-cart');
    if (!button) return;
    const foodId = button.dataset.id;

    fetch(`/foods/detail/${foodId}`)
      .then((res) => res.json())
      .then((data) => {
        const modal = document.getElementById('foodModal');
        modal.dataset.id = data.id;

        document.getElementById('modalTitle').textContent = data.title;
        document.getElementById('modalDescription').textContent = data.description;
        document.getElementById('modalPrice').textContent = data.price;
        document.getElementById('modalImage').src = data.imageUrl;
        document.getElementById('modalRating').textContent = data.rating;
        document.getElementById('modalCalories').textContent = data.nutritionalValue.calories;
        document.getElementById('modalProtein').textContent = data.nutritionalValue.protein;
        document.getElementById('modalFat').textContent = data.nutritionalValue.fat;
        document.getElementById('modalCarbs').textContent = data.nutritionalValue.carbs;

        if (data.quantityInCart > 0) {
          document.querySelector('#addToCartBtn').classList.add('hidden');
          document.querySelector('#quantityControls').classList.remove('hidden');
          document.querySelector('#quantityDisplay').textContent = data.quantityInCart;
        } else {
          document.querySelector('#addToCartBtn').classList.remove('hidden');
          document.querySelector('#quantityControls').classList.add('hidden');
        }

        modal.classList.remove('hidden');
        document.getElementById('modalOverlay').classList.remove('hidden');
      })
      .catch((err) => {
        console.error(err);
        alert('Ошибка при загрузке товара');
      });
  });

  document.querySelector('.close-modal-detail').addEventListener('click', () => {
    document.getElementById('foodModal').classList.add('hidden');
    document.getElementById('modalOverlay').classList.add('hidden');
  });

  document.getElementById('modalOverlay').addEventListener('click', () => {
    document.getElementById('foodModal').classList.add('hidden');
    document.getElementById('modalOverlay').classList.add('hidden');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  attachAddToCartHandlers();
});

export { attachAddToCartHandlers };
