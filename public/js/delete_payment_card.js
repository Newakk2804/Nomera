import { showToast } from './toast.js';

document.querySelector('.profile-content')?.addEventListener('click', async (e) => {
  const deleteBtn = e.target.closest('.btn-delete-card');
  if (!deleteBtn) return;

  const cardId = deleteBtn.dataset.cardId;
  if (!cardId) {
    console.warn('cardId не найден у кнопки');
    return;
  }

  try {
    const res = await fetch(`/profile/payments/delete-card/${cardId}`, {
      method: 'DELETE',
    });

    const data = await res.json();

    if (res.ok && data.success) {
      deleteBtn.closest('.card-item')?.remove();
      showToast(data.message || 'Карта удалена', 'success');
    } else {
      showToast(data.message || 'Ошибка при удалении карты', 'error');
    }
  } catch (err) {
    console.error('Ошибка при удалении карты:', err);
    showToast('Сетевая ошибка при удалении карты', 'error');
  }
});
