import { showToast } from './toast.js';

document.addEventListener('click', async (e) => {
  const addBtn = e.target.closest('#addToCartBtn');
  const decreaseBtn = e.target.closest('#decreaseQty');
  const increaseBtn = e.target.closest('#increaseQty');

  if (!addBtn && !decreaseBtn && !increaseBtn) return;

  const modal = document.getElementById('foodModal');
  if (!modal) return;

  const foodId = modal.dataset.id;
  if (!foodId) return;

  let action = '';
  if (addBtn) action = 'add';
  else if (decreaseBtn) action = 'decrease';
  else if (increaseBtn) action = 'increase';

  try {
    const res = await fetch(`/cart/${action}/${foodId}`, { method: 'POST' });
    const data = await res.json();

    if (!data.success) {
      const errorMsgs = {
        add: 'Ошибка при добавлении товара в корзину',
        decrease: 'Не удалось уменьшить количество товара',
        increase: 'Не удалось увеличить количество товара',
      };
      showToast(errorMsgs[action] || 'Произошла ошибка', 'error');
      return;
    }

    updateCartUI(action, data.quantity);
  } catch (err) {
    console.error('Ошибка при обновлении корзины:', err);
    showToast('Необходимо авторизоваться', 'error');
  }
});

function updateCartUI(action, quantity) {
  const quantityControls = document.querySelector('#quantityControls');
  const addBtn = document.querySelector('#addToCartBtn');
  const display = document.querySelector('#quantityDisplay');

  switch (action) {
    case 'add':
      addBtn.classList.add('hidden');
      quantityControls.classList.remove('hidden');
      display.textContent = quantity;
      showToast('Товар добавлен в корзину', 'success');
      break;

    case 'decrease':
      if (quantity > 0) {
        display.textContent = quantity;
      } else {
        quantityControls.classList.add('hidden');
        addBtn.classList.remove('hidden');
      }
      showToast('Товар удалён из корзины', 'warning');
      break;

    case 'increase':
      display.textContent = quantity;
      showToast('Товар добавлен в корзину', 'success');
      break;
  }
}
