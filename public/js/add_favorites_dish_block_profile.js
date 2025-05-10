const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modal-message');
const modalLinkButton = document.getElementById('modal-link-block');
const closeModalBtn = document.querySelector('.modal-close');
const profileContent = document.querySelector('.profile-content');

const Modal = {
  open(message, showLink = false) {
    modalMessage.textContent = message;
    modalLinkButton.classList.toggle('hidden', !showLink);
    modal.classList.remove('hidden');
  },

  close() {
    modal.classList.add('hidden');
  },

  init() {
    closeModalBtn?.addEventListener('click', this.close);
    window.addEventListener('click', (e) => {
      if (e.target === modal) this.close();
    });
  },
};

Modal.init();

profileContent?.addEventListener('click', async (e) => {
  const btn = e.target.closest('.btn-favorite');
  if (!btn) return;

  const foodId = btn.dataset.id;
  if (!foodId) return;

  try {
    const res = await fetch('/favorite/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ id: foodId }),
    });

    const data = await res.json();

    if (res.status === 401) {
      Modal.open('Необходимо авторизоваться для добавления в избранное');
      return;
    }

    if (!data.success) {
      Modal.open('Что-то пошло не так');
      return;
    }

    updateFavoriteUI(btn, data);
  } catch (err) {
    console.error('Ошибка добавления в избранное:', err);
    Modal.open('Ошибка сервера');
  }
});

function updateFavoriteUI(button, data) {
  const icon = button.querySelector('i');

  if (data.added) {
    icon?.classList.replace('fa-regular', 'fa-solid');
    Modal.open('Товар добавлен в избранное!', true);
  } else {
    icon?.classList.replace('fa-solid', 'fa-regular');
    Modal.open('Товар удален из избранного');

    const card = button.closest('.tm-gallery-item');
    if (card && window.location.pathname.includes('/profile')) {
      card.remove();
    }
  }
}
