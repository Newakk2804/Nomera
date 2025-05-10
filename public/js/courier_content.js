document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.tm-paging-link-courier');
  const contentContainer = document.querySelector('.courier-content');

  links.forEach((link) => {
    link.addEventListener('click', async (e) => {
      e.preventDefault();

      links.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');

      const section = link.dataset.section;

      try {
        const res = await fetch(`/courier/${section}`);
        const html = await res.text();
        contentContainer.innerHTML = html;
        attachOrderButtons();
      } catch (err) {
        contentContainer.innerHTML = '<p>Ошибка загрузки содержимого</p>';
        console.error(err);
      }
    });
  });

  // Инициировать первую вкладку
  document.querySelector('.tm-paging-link-courier.active').click();
});


function attachOrderButtons() {
  const buttons = document.querySelectorAll('.view-order-courier-btn');

  buttons.forEach((button) => {
    button.addEventListener('click', async () => {
      const orderId = button.dataset.orderId;
      const container = document.getElementById(`order-courier-${orderId}`);

      if (!container) return;

      if (container.style.display === 'block') {
        container.style.display = 'none';
        return;
      }

      try {
        const res = await fetch(`/profile/orders/${orderId}`);
        const order = await res.json();

        const itemsHTML = order.arrayDishes
          .map(
            (item) => `    <li>
    <span class="food-name">${item.food.title || 'Неизвестно'}</span>
    <span class="food-quantity">x ${item.quantity}</span>
    <span class="food-price">${item.food.price} BYN</span>
    <span class="food-total">${(item.food.price * item.quantity).toFixed(2)} BYN</span>
  </li>`
          )
          .join('');

        const html = `
          <ul>${itemsHTML}</ul>
        `;
        container.innerHTML = html;
        container.style.display = 'block';
      } catch (error) {
        container.innerHTML = '<p>Ошибка загрузки содержимого</p>';
        container.style.display = 'block';
        console.error(error);
      }
    });
  });
}
