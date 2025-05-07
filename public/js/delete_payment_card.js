import { showToast } from './toast.js';

document.querySelector('.profile-content').addEventListener('click', async (e) => {
  if (e.target && e.target.closest('.btn-delete-card')) {
    const btn = e.target.closest('.btn-delete-card');
    const cardId = btn.dataset.cardId;

    try {
      const res = await fetch(`/profile/payments/delete-card/${cardId}`, { method: 'DELETE' });

      const data = await res.json();

      if (data.success) {
        btn.closest('.card-item').remove();
        showToast(data.message, 'success');

      } else {
        showToast(data.message || 'Ошибка при удалении карты', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Ошибка при удалении карты');
    }
  }
});