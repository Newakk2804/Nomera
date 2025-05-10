const Modal = (() => {
  const modal = document.getElementById('modal');
  const messageEl = document.getElementById('modal-message');
  const linkBlock = document.getElementById('modal-link-block');
  const closeBtn = document.querySelector('.modal-close');

  function open(message, showLink = false) {
    messageEl.textContent = message;
    linkBlock.classList.toggle('hidden', !showLink);
    modal.classList.remove('hidden');
  }

  function close() {
    modal.classList.add('hidden');
  }

  function init() {
    closeBtn?.addEventListener('click', close);
    window.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });
  }

  init();

  return { open, close };
})();

document.querySelector('.tm-gallery-page')?.addEventListener('click', async (e) => {
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

    updateFavoriteIcon(btn, data.added);
  } catch (err) {
    console.error('Ошибка добавления в избранное:', err);
    Modal.open('Ошибка сервера');
  }
});

function updateFavoriteIcon(button, isAdded) {
  const icon = button.querySelector('i');
  if (!icon) return;

  if (isAdded) {
    icon.classList.replace('fa-regular', 'fa-solid');
    Modal.open('Товар добавлен в избранное!', true);
  } else {
    icon.classList.replace('fa-solid', 'fa-regular');
    Modal.open('Товар удален из избранного');
  }
}
