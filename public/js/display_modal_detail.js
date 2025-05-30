import { initDeleteModalHandlers } from './delete_dish.js';

let currentDishId = null;

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

  const editBtn = document.getElementById('editDishBtn');
  if (editBtn) {
    editBtn.onclick = () => {
      window.location.href = `/admin/admin-dish/edit/${data.id}`;
    };
  }

  const deleteBtn = document.getElementById('deleteDishBtn');
  if (deleteBtn) {
    deleteBtn.onclick = () => {
      document.getElementById('confirmDeleteModal').classList.remove('hidden');
    };
  }

  const addToCartBtn = document.querySelector('#addToCartBtn');
  const quantityControls = document.querySelector('#quantityControls');
  const quantityDisplay = document.querySelector('#quantityDisplay');

  if (data.quantityInCart > 0) {
    if (addToCartBtn) addToCartBtn.classList.add('hidden');
    if (quantityControls) quantityControls.classList.remove('hidden');
    if (quantityDisplay) quantityDisplay.textContent = data.quantityInCart;
  } else {
    if (addToCartBtn) addToCartBtn.classList.remove('hidden');
    if (quantityControls) quantityControls.classList.add('hidden');
  }

  showModal(modal);
}

function showModal(modal) {
  modal.classList.remove('hidden');
  document.getElementById('modalOverlay').classList.remove('hidden');
}

function hideModal(modalId) {
  document.getElementById(modalId).classList.add('hidden');
  document.getElementById('modalOverlay').classList.add('hidden');
}

function attachAddToCartHandlers() {
  const galleryPage = document.querySelector('.tm-gallery-page');
  const closeModal = document.querySelector('.close-modal-detail');
  const modalOverlay = document.getElementById('modalOverlay');
  const foodModal = document.getElementById('foodModal');

  galleryPage?.addEventListener('click', (e) => {
    const button = e.target.closest('.btn-add-cart');
    if (!button) return;
    const foodId = button.dataset.id;

    fetch(`/foods/detail/${foodId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Ошибка при загрузке данных');
        }
        return res.json();
      })
      .then((data) => {
        if (!data.id || !data.title) {
          throw new Error('Некоторые данные отсутствуют');
        }
        currentDishId = data.id;
        updateModalContent(data);
      })
      .catch((err) => {
        console.error(err);
        alert('Ошибка при загрузке товара');
      });
  });

  closeModal?.addEventListener('click', () => hideModal('foodModal'));
  modalOverlay?.addEventListener('click', () => hideModal('foodModal'));

  document.querySelector('.close-modal-detail')?.addEventListener('click', () => {
    hideModal('editDishModal');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  attachAddToCartHandlers();
  initDeleteModalHandlers(() => currentDishId);
});

export { attachAddToCartHandlers };
