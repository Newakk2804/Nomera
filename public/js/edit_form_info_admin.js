import { showToast } from './toast.js';

document.addEventListener('DOMContentLoaded', function() {
  const profileContent = document.querySelector('.admin-content');

  if (!profileContent) {
    console.error('Элемент с классом "admin-content" не найден');
    return;
  }

  profileContent.addEventListener('submit', async function(e) {
    if (e.target && e.target.id === 'editForm') {
      e.preventDefault();

      const firstName = document.getElementById('firstName').value;
      const lastName = document.getElementById('lastName').value;
      const phone = document.getElementById('phone').value;

      const data = { firstName, lastName, phone };

      try {
        const response = await fetch('admin/admin-info/edit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (result.success) {
          showToast(result.message, 'success');
        } else {
          showToast(result.message, 'error');
        }
      } catch (error) {
        console.error('Ошибка:', error);
        showToast('Ошибка при обновлении данных', 'error');
      }
    }
  });
});