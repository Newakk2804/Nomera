import { showToast } from './toast.js';

const openCartBtn = document.getElementById('openCartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartModal = document.getElementById('cartModal');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartFooter = document.querySelector('.cart-footer');
const checkoutBtn = document.getElementById('checkoutBtn');

async function loadCart() {
  try {
    const res = await fetch('/cart/view');
    const data = await res.json();

    cartItemsContainer.innerHTML = '';
    cartFooter.querySelector('.cart-total')?.remove();

    if (data.items.length === 0) {
      cartItemsContainer.innerHTML = '<p>Корзина пуста</p>';
    } else {
      data.items.forEach((item) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.dataset.id = item.food.id;

        itemElement.innerHTML = `
          <img src="${item.food.imageUrl}" alt="${item.food.title}" class="cart-item-img">
          <div class="cart-item-details">
            <h4>${item.food.title}</h4>
            <p>Цена: ${item.food.price} BYN</p>
            <p>Сумма: ${item.food.price * item.quantity} BYM</p>
            <div class="cart-controls">
              <button class="decrease" data-id="${item.food.id}">➖</button>
              <span class="quantity">${item.quantity}</span>
              <button class="increase" data-id="${item.food.id}">➕</button>
              <button class="remove" data-id="${item.food.id}">❌</button>
            </div>
          </div>
        `;

        cartItemsContainer.appendChild(itemElement);
      });

      const totalBlock = document.createElement('div');
      totalBlock.classList.add('cart-total');
      totalBlock.innerHTML = `<strong>Итого:</strong> ${data.totalPrice} BYN`;
      cartFooter.insertBefore(totalBlock, checkoutBtn);
    }
  } catch (err) {
    console.error('Ошибка загрузки корзины', err);
    cartItemsContainer.innerHTML = '<p>Ошибка загрузки корзины</p>';
  }
}

openCartBtn.addEventListener('click', async (event) => {
  event.preventDefault();
  cartModal.classList.remove('hidden');
  await loadCart();
});

closeCartBtn.addEventListener('click', () => {
  cartModal.classList.add('hidden');
});

cartItemsContainer.addEventListener('click', async (e) => {
  const button = e.target.closest('button');
  if (!button) return;

  const foodId = button.dataset.id;
  if (!foodId) return;

  let endpoint = '';
  let method = 'POST';

  if (button.classList.contains('increase')) {
    endpoint = `/cart/increase/${foodId}`;
    showToast('Блюдо добавлено в корзину', 'success')
  } else if (button.classList.contains('decrease')) {
    endpoint = `/cart/decrease/${foodId}`;
    showToast('Блюдо удалено из корзины', 'warning')
  } else if (button.classList.contains('remove')) {
    endpoint = `/cart/remove/${foodId}`;
    method = 'DELETE';
    showToast('Блюдо удалено из корзины', 'warning')
  } else {
    return;
  }

  try {
    const res = await fetch(endpoint, { method });
    const data = await res.json();

    if (data.success) {
      await loadCart();
    }
  } catch (err) {
    console.error('Ошибка управления корзиной', err);
  }
});