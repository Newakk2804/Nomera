const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modal-message');
const modalLinkButton = document.getElementById('modal-link-block');
const closeModalBtn = document.querySelector('.modal-close');

function openModal(message, showLink = false) {
  modalMessage.textContent = message;
  if (showLink) {
    modalLinkButton.classList.remove('hidden');
  } else {
    modalLinkButton.classList.add('hidden');
  }
  modal.classList.remove('hidden');
}

function closeModal() {
  modal.classList.add('hidden');
}

closeModalBtn.addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

document.querySelectorAll('.btn-favorite').forEach((btn) => {
  btn.addEventListener('click', async (e) => {
    const foodId = btn.dataset.id;

    try {
      const response = await fetch('/favorite/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ id: foodId }),
      });

      const data = await response.json();

      if (response.status === 401) {
        openModal('Необходимо авторизоваться для добавления в избранное');
      } else if (data.success) {
        const icon = btn.querySelector('i');
        if (data.added) {
          icon.classList.remove('fa-regular');
          icon.classList.add('fa-solid');
          openModal('Товар добавлен в избранное!', true);
        } else {
          icon.classList.remove('fa-solid');
          icon.classList.add('fa-regular');
          openModal('Товар удален из избранного');
        }
      } else {
        openModal('Что-то пошло не так');
      }
    } catch (error) {
      console.error('Ошибка добавления в избранное: ', error);
      openModal('Ошибка сервера');
    }
  });
});
