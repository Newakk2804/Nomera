import { showToast } from './toast.js';

export function initDeleteModalHandlers(getDishId) {
  document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
    document.getElementById('confirmDeleteModal').classList.add('hidden');
  });

  document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
    const dishIdToDelete = getDishId();
    if (!dishIdToDelete) return;

    try {
      const res = await fetch(`/admin/admin-dish/delete/${dishIdToDelete}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        document.querySelector(`[data-food-id="${dishIdToDelete}"]`)?.remove();

        document.getElementById('foodModal').classList.add('hidden');
        document.getElementById('modalOverlay').classList.add('hidden');
        document.getElementById('confirmDeleteModal').classList.add('hidden');

        showToast('Блюдо удалено');
      } else {
        showToast('Ошибка при удалении', 'error');
      }
    } catch (error) {
      console.error(err);
      showToast('Сетевая ошибка', 'error');
    }
  });
}
