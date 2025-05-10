import { showToast } from './toast.js';

document.addEventListener('DOMContentLoaded', () => {
  const profileContent = document.querySelector('.admin-content');

  if (!profileContent) {
    console.error('Элемент с классом "admin-content" не найден');
    return;
  }

  profileContent.addEventListener('submit', handleFormSubmit);
});

async function handleFormSubmit(e) {
  if (e.target && e.target.id === 'editForm') {
    e.preventDefault();

    const formData = getFormData();

    if (!formData) {
      showToast('Пожалуйста, заполните все поля', 'error');
      return;
    }

    try {
      const result = await updateProfileInfo(formData);
      handleResponse(result);
    } catch (error) {
      console.error('Ошибка:', error);
      showToast('Ошибка при обновлении данных', 'error');
    }
  }
}

function getFormData() {
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const phone = document.getElementById('phone').value.trim();

  if (!firstName || !lastName || !phone) {
    return null;
  }

  return { firstName, lastName, phone };
}

async function updateProfileInfo(data) {
  const response = await fetch('admin/admin-info/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Не удалось обновить данные');
  }

  return await response.json();
}

function handleResponse(result) {
  if (result.success) {
    showToast(result.message, 'success');
  } else {
    showToast(result.message, 'error');
  }
}
