document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.tm-paging-link-profile');
  const contentContainer = document.querySelector('.profile-content');

  links.forEach((link) => {
    link.addEventListener('click', async (e) => {
      e.preventDefault();

      const section = link.dataset.section;

      links.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');

      try {
        const res = await fetch(`/profile/${section}`);
        const html = await res.text();
        contentContainer.innerHTML = html;

        if (section === 'cards') {
          const publishableKey = document.querySelector('#stripe-key')?.dataset.key;
          if (publishableKey && window.initStripeAddCard) {
            window.initStripeAddCard(publishableKey);
          }
        }

        attachOrderButtons();
      } catch (err) {
        contentContainer.innerHTML = '<p>Ошибка загрузки содержимого</p>';
        console.error(err);
      }
    });
  });

  document.querySelector('.tm-paging-link-profile.active').click();

  function attachOrderButtons() {
    const viewButtons = document.querySelectorAll('.view-order');
    viewButtons.forEach((button) => {
      button.addEventListener('click', async () => {
        const orderId = button.dataset.orderId;
        const orderDetailsDiv = document.getElementById(`order-${orderId}`);

        if (!orderDetailsDiv) return;

        if (orderDetailsDiv.style.display === 'block') {
          orderDetailsDiv.style.display = 'none';
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

          orderDetailsDiv.innerHTML = html;
          orderDetailsDiv.style.display = 'block';
        } catch (err) {
          console.error('Ошибка загрузки заказа', err);
        }
      });
    });
  }
});
