import { showToast } from './toast.js';

export function initDeleteModalHandlers(getDishId) {
  const cancelBtn = document.getElementById('cancelDeleteBtn');
  const confirmBtn = document.getElementById('confirmDeleteBtn');
  const deleteModal = document.getElementById('confirmDeleteModal');
  const foodModal = document.getElementById('foodModal');
  const modalOverlay = document.getElementById('modalOverlay');

  if (!cancelBtn || !confirmBtn || !deleteModal) {
    console.warn('Не найдены элементы модального окна удаления');
    return;
  }

  cancelBtn.addEventListener('click', () => {
    hideElement(deleteModal);
  });

  confirmBtn.addEventListener('click', async () => {
    const dishId = getDishId();
    if (!dishId) return;

    try {
      const res = await fetch(`/admin/admin-dish/delete/${dishId}`, { method: 'DELETE' });

      if (res.ok) {
        document.querySelector(`[data-food-id="${dishId}"]`)?.remove();

        [foodModal, modalOverlay, deleteModal].forEach(hideElement);

        showToast('Блюдо удалено');
      } else {
        showToast('Ошибка при удалении', 'error');
      }
    } catch (err) {
      console.error('Ошибка при удалении блюда:', err);
      showToast('Сетевая ошибка', 'error');
    }
  });
}

function hideElement(element) {
  if (element) element.classList.add('hidden');
}
