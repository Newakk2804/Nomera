import { showToast } from './toast.js';

const openCartBtn = document.getElementById('openCartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartModal = document.getElementById('cartModal');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartFooter = document.querySelector('.cart-footer');
const checkoutBtn = document.getElementById('checkoutBtn');

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

  const action = getCartAction(button);
  if (!action) return;

  try {
    const res = await fetch(action.endpoint, { method: action.method });
    const data = await res.json();

    if (data.success) {
      await loadCart();
      showToast(action.toastMessage, action.toastType);
    }
  } catch (err) {
    console.error('Ошибка управления корзиной', err);
  }
});

async function loadCart() {
  try {
    const res = await fetch('/cart/view');
    const data = await res.json();

    renderCartItems(data);
  } catch (err) {
    console.error('Ошибка загрузки корзины', err);
    cartItemsContainer.innerHTML = '<p>Ошибка загрузки корзины</p>';
  }
}

function renderCartItems(data) {
  cartItemsContainer.innerHTML = '';
  cartFooter.querySelector('.cart-total')?.remove();

  if (data.items.length === 0) {
    cartItemsContainer.innerHTML = '<p>Корзина пуста</p>';
  } else {
    data.items.forEach((item) => {
      const itemElement = createCartItemElement(item);
      cartItemsContainer.appendChild(itemElement);
    });

    const totalBlock = createCartTotalElement(data.totalPrice);
    cartFooter.insertBefore(totalBlock, checkoutBtn);
  }
}

function createCartItemElement(item) {
  const itemElement = document.createElement('div');
  itemElement.classList.add('cart-item');
  itemElement.dataset.id = item.food.id;

  itemElement.innerHTML = `
    <img src="${item.food.imageUrl}" alt="${item.food.title}" class="cart-item-img">
    <div class="cart-item-details">
      <h4>${item.food.title}</h4>
      <p>Цена: ${item.food.price} BYN</p>
      <p>Сумма: ${item.food.price * item.quantity} BYN</p>
      <div class="cart-controls">
        <button class="decrease" data-id="${item.food.id}">➖</button>
        <span class="quantity">${item.quantity}</span>
        <button class="increase" data-id="${item.food.id}">➕</button>
        <button class="remove" data-id="${item.food.id}">❌</button>
      </div>
    </div>
  `;
  return itemElement;
}

function createCartTotalElement(totalPrice) {
  const totalBlock = document.createElement('div');
  totalBlock.classList.add('cart-total');
  totalBlock.innerHTML = `<strong>Итого:</strong> ${totalPrice} BYN`;
  return totalBlock;
}

function getCartAction(button) {
  const foodId = button.dataset.id;
  let endpoint = '';
  let method = 'POST';
  let toastMessage = '';
  let toastType = '';

  if (button.classList.contains('increase')) {
    endpoint = `/cart/increase/${foodId}`;
    toastMessage = 'Блюдо добавлено в корзину';
    toastType = 'success';
  } else if (button.classList.contains('decrease')) {
    endpoint = `/cart/decrease/${foodId}`;
    toastMessage = 'Блюдо удалено из корзины';
    toastType = 'warning';
  } else if (button.classList.contains('remove')) {
    endpoint = `/cart/remove/${foodId}`;
    method = 'DELETE';
    toastMessage = 'Блюдо удалено из корзины';
    toastType = 'warning';
  } else {
    return null;
  }

  return { endpoint, method, toastMessage, toastType };
}
