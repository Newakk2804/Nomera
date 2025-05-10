document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const modal = document.getElementById('thankYouModal');
  const modalBackground = document.getElementById('modalBackground');
  const closeModal = document.getElementById('closeModal');

  form.addEventListener('submit', (e) => handleFormSubmit(e, form, modal, modalBackground));
  closeModal.addEventListener('click', () => closeModalDisplay(modal, modalBackground));
  modalBackground.addEventListener('click', () => closeModalDisplay(modal, modalBackground));
});

async function handleFormSubmit(event, form, modal, modalBackground) {
  event.preventDefault();

  const data = gatherFormData(form);

  try {
    const response = await sendMessage(data);
    const responseData = await response.json();

    if (response.ok) {
      form.reset();
      openModal(modal, modalBackground);
    } else {
      alert(responseData.message || 'Ошибка отправки сообщения');
    }
  } catch (error) {
    console.error('Ошибка:', error);
    alert('Произошла ошибка. Попробуйте позже.');
  }
}

function gatherFormData(form) {
  const formData = new FormData(form);
  return {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  };
}

async function sendMessage(data) {
  return fetch('/contact/send-message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

function openModal(modal, modalBackground) {
  modal.style.display = 'flex';
  modalBackground.style.display = 'block';
}

function closeModalDisplay(modal, modalBackground) {
  modal.style.display = 'none';
  modalBackground.style.display = 'none';
}
