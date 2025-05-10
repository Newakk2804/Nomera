document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.tm-paging-link-courier');
  const contentContainer = document.querySelector('.courier-content');

  links.forEach(link => {
    link.addEventListener('click', event => handleSectionClick(event, link, links, contentContainer));
  });

  // Активировать первую вкладку при загрузке
  document.querySelector('.tm-paging-link-courier.active')?.click();
});

async function handleSectionClick(event, link, allLinks, container) {
  event.preventDefault();

  allLinks.forEach(l => l.classList.remove('active'));
  link.classList.add('active');

  const section = link.dataset.section;

  try {
    const res = await fetch(`/courier/${section}`);
    const html = await res.text();
    container.innerHTML = html;
    attachOrderButtons();
  } catch (err) {
    container.innerHTML = '<p>Ошибка загрузки содержимого</p>';
    console.error('Ошибка при загрузке раздела:', err);
  }
}

function attachOrderButtons() {
  document.querySelectorAll('.view-order-courier-btn').forEach(button => {
    button.addEventListener('click', () => handleOrderToggle(button));
  });
}

async function handleOrderToggle(button) {
  const orderId = button.dataset.orderId;
  const container = document.getElementById(`order-courier-${orderId}`);

  if (!container) return;

  if (container.style.display === 'block') {
    container.style.display = 'none';
    return;
  }

  try {
    const res = await fetch(`/profile/orders/${orderId}`);
    const { arrayDishes } = await res.json();

    const itemsHTML = arrayDishes
      .map(item => `
        <li>
          <span class="food-name">${item.food.title || 'Неизвестно'}</span>
          <span class="food-quantity">x ${item.quantity}</span>
          <span class="food-price">${item.food.price} BYN</span>
          <span class="food-total">${(item.food.price * item.quantity).toFixed(2)} BYN</span>
        </li>`)
      .join('');

    container.innerHTML = `<ul>${itemsHTML}</ul>`;
    container.style.display = 'block';
  } catch (err) {
    container.innerHTML = '<p>Ошибка загрузки содержимого</p>';
    container.style.display = 'block';
    console.error('Ошибка при загрузке заказа:', err);
  }
}
