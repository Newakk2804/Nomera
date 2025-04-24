const form = document.getElementById('contactForm');
const modal = document.getElementById('thankYouModal');
const modalBackground = document.getElementById('modalBackground');
const closeModal = document.getElementById('closeModal');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  };

  try {
    const response = await fetch('/contact/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (response.ok) {
      form.reset();
      modal.style.display = 'flex';
      modalBackground.style.display = 'block';
    } else {
      alert(responseData.message || 'Ошибка отправки сообщения');
    }
  } catch (error) {
    console.error('Ошибка:', error);
    alert('Произошла ошибка. Попробуйте позже.');
  }
});

closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
  modalBackground.style.display = 'none';
});

modalBackground.addEventListener('click', () => {
  modal.style.display = 'none';
  modalBackground.style.display = 'none';
});
