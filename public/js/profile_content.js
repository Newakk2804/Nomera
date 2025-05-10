document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.tm-paging-link-profile');
  const contentContainer = document.querySelector('.profile-content');

  links.forEach((link) => {
    link.addEventListener('click', (e) => handleLinkClick(e, link, contentContainer));
  });

  // Инициализация с активной вкладкой
  document.querySelector('.tm-paging-link-profile.active').click();
});

async function handleLinkClick(e, link, contentContainer) {
  e.preventDefault();

  const section = link.dataset.section;
  toggleActiveLink(link);

  try {
    const res = await fetch(`/profile/${section}`);
    const html = await res.text();
    contentContainer.innerHTML = html;

    if (section === 'cards') {
      initializeStripe();
    }

    attachOrderButtons();
  } catch (err) {
    contentContainer.innerHTML = '<p>Ошибка загрузки содержимого</p>';
    console.error(err);
  }
}

function toggleActiveLink(link) {
  const links = document.querySelectorAll('.tm-paging-link-profile');
  links.forEach((l) => l.classList.remove('active'));
  link.classList.add('active');
}

function initializeStripe() {
  const publishableKey = document.querySelector('#stripe-key')?.dataset.key;
  if (publishableKey && window.initStripeAddCard) {
    window.initStripeAddCard(publishableKey);
  }
}

function attachOrderButtons() {
  const viewButtons = document.querySelectorAll('.view-order');
  viewButtons.forEach((button) => {
    button.addEventListener('click', () => handleOrderView(button));
  });
}

async function handleOrderView(button) {
  const orderId = button.dataset.orderId;
  const orderDetailsDiv = document.getElementById(`order-${orderId}`);

  if (!orderDetailsDiv) return;

  if (orderDetailsDiv.style.display === 'block') {
    orderDetailsDiv.style.display = 'none';
    return;
  }

  try {
    const order = await fetchOrderDetails(orderId);
    orderDetailsDiv.innerHTML = createOrderDetailsHTML(order);
    orderDetailsDiv.style.display = 'block';
  } catch (err) {
    console.error('Ошибка загрузки заказа', err);
  }
}

async function fetchOrderDetails(orderId) {
  const res = await fetch(`/profile/orders/${orderId}`);
  return res.json();
}

function createOrderDetailsHTML(order) {
  const itemsHTML = order.arrayDishes
    .map(
      (item) => `
        <li>
          <span class="food-name">${item.food.title || 'Неизвестно'}</span>
          <span class="food-quantity">x ${item.quantity}</span>
          <span class="food-price">${item.food.price} BYN</span>
          <span class="food-total">${(item.food.price * item.quantity).toFixed(2)} BYN</span>
        </li>`
    )
    .join('');

  return `<ul>${itemsHTML}</ul>`;
}
