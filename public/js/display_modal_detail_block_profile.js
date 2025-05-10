function updateModalContent(data) {
  const modal = document.getElementById('foodModal');
  modal.dataset.id = data.id;

  document.getElementById('modalTitle').textContent = data.title;
  document.getElementById('modalDescription').textContent = data.description;
  document.getElementById('modalPrice').textContent = data.price;
  document.getElementById('modalImage').src = data.imageUrl;
  document.getElementById('modalWeight').textContent = data.weight;
  document.getElementById('modalCalories').textContent = data.nutritionalValue.calories;
  document.getElementById('modalProtein').textContent = data.nutritionalValue.protein;
  document.getElementById('modalFat').textContent = data.nutritionalValue.fat;
  document.getElementById('modalCarbs').textContent = data.nutritionalValue.carbs;

  const addToCartBtn = document.querySelector('#addToCartBtn');
  const quantityControls = document.querySelector('#quantityControls');
  const quantityDisplay = document.querySelector('#quantityDisplay');

  if (data.quantityInCart > 0) {
    addToCartBtn.classList.add('hidden');
    quantityControls.classList.remove('hidden');
    quantityDisplay.textContent = data.quantityInCart;
  } else {
    addToCartBtn.classList.remove('hidden');
    quantityControls.classList.add('hidden');
  }

  modal.classList.remove('hidden');
  document.getElementById('modalOverlay').classList.remove('hidden');
}

function attachAddToCartHandlers() {
  const profileContent = document.querySelector('.profile-content');
  const closeModal = document.querySelector('.close-modal-detail');
  const modalOverlay = document.getElementById('modalOverlay');
  const foodModal = document.getElementById('foodModal');

  profileContent?.addEventListener('click', (e) => {
    const button = e.target.closest('.btn-add-cart');
    if (!button) return;

    const foodId = button.dataset.id;

    fetch(`/foods/detail/${foodId}`)
      .then((res) => res.json())
      .then(updateModalContent)
      .catch((err) => {
        console.error(err);
        alert('Ошибка при загрузке товара');
      });
  });

  closeModal?.addEventListener('click', () => {
    foodModal.classList.add('hidden');
    modalOverlay.classList.add('hidden');
  });

  modalOverlay?.addEventListener('click', () => {
    foodModal.classList.add('hidden');
    modalOverlay.classList.add('hidden');
  });
}

document.addEventListener('DOMContentLoaded', attachAddToCartHandlers);

export { attachAddToCartHandlers };
