import { showToast } from './toast.js';

document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.tm-paging-link-admin');
  const contentContainer = document.querySelector('.admin-content');

  links.forEach(link =>
    link.addEventListener('click', async e => {
      e.preventDefault();
      await loadAdminSection(link, links, contentContainer);
    })
  );

  document.querySelector('.tm-paging-link-admin.active')?.click();
});

async function loadAdminSection(link, allLinks, container) {
  const section = link.dataset.section;

  allLinks.forEach(l => l.classList.remove('active'));
  link.classList.add('active');

  try {
    const res = await fetch(`/admin/${section}`);
    const html = await res.text();
    container.innerHTML = html;
    attachOrderButtons();
  } catch (err) {
    container.innerHTML = '<p>Ошибка загрузки содержимого</p>';
    console.error(err);
  }
}

function attachOrderButtons() {
  attachToggleButtons('.view-order-admin', loadOrderDetails);
  attachToggleButtons('.assign-courier-admin', loadCourierAssignment);
  attachStatusForms();
  attachCourierOrderButtons();
}

function attachToggleButtons(selector, handler) {
  document.querySelectorAll(selector).forEach(button => {
    button.addEventListener('click', async () => {
      const orderId = button.dataset.orderId;
      const container = document.getElementById(`order-${orderId}`);
      if (!container) return;

      if (container.style.display === 'block') {
        container.style.display = 'none';
        return;
      }

      await handler(orderId, container);
    });
  });
}

async function loadOrderDetails(orderId, container) {
  try {
    const res = await fetch(`/admin/list-orders/${orderId}`);
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
    console.error('Ошибка загрузки заказа', err);
  }
}

async function loadCourierAssignment(orderId, container) {
  try {
    const res = await fetch(`/admin/assign-courier/${orderId}`);
    const { couriers, currentCourierId } = await res.json();

    container.innerHTML = couriers.map(courier => {
      const isAssigned = currentCourierId === courier._id;
      return `
        <div class="courier-item">
          <span>${courier.firstName} ${courier.lastName} (${courier.email})</span>
          <button class="${isAssigned ? 'unassign-button' : 'assign-button'}" 
                  data-courier-id="${courier._id}" 
                  data-order-id="${orderId}">
            ${isAssigned ? 'Удалить' : 'Назначить'}
          </button>
        </div>`;
    }).join('');
    container.classList.add('assign-courier-list');
    container.style.display = 'block';

    bindCourierButtons(container);
  } catch (err) {
    console.error('Ошибка загрузки курьеров', err);
  }
}

function bindCourierButtons(container) {
  container.querySelectorAll('.assign-button').forEach(btn => {
    btn.addEventListener('click', async () => {
      await handleCourierAssignment(btn.dataset.courierId, btn.dataset.orderId);
    });
  });

  container.querySelectorAll('.unassign-button').forEach(btn => {
    btn.addEventListener('click', async () => {
      await handleCourierUnassignment(btn.dataset.orderId);
    });
  });
}

async function handleCourierAssignment(courierId, orderId) {
  try {
    const res = await fetch('/admin/assign-courier', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courierId, orderId }),
    });

    if (res.ok) {
      showToast('Курьер успешно назначен', 'success');
      document.querySelector('.tm-paging-link-admin.active')?.click();
    } else {
      showToast('Ошибка назначения курьера', 'error');
    }
  } catch (err) {
    console.error('Ошибка назначения', err);
  }
}

async function handleCourierUnassignment(orderId) {
  try {
    const res = await fetch('/admin/unassign-courier', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    });

    if (res.ok) {
      showToast('Курьер удалён', 'success');
      document.querySelector('.tm-paging-link-admin.active')?.click();
    } else {
      showToast('Ошибка удаления курьера', 'error');
    }
  } catch (err) {
    console.error('Ошибка удаления', err);
  }
}

function attachStatusForms() {
  document.querySelectorAll('.status-form').forEach(form => {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const orderId = form.dataset.orderId;
      const status = form.querySelector('.status-select').value;

      try {
        const res = await fetch('/admin/update-order-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, status }),
        });

        if (res.ok) {
          showToast('Статус успешно обновлён', 'success');
          document.querySelector('.tm-paging-link-admin.active')?.click();
        } else {
          showToast('Ошибка при обновлении статуса', 'error');
        }
      } catch (err) {
        console.error('Ошибка обновления статуса', err);
        showToast('Ошибка при подключении к серверу', 'error');
      }
    });
  });
}

function attachCourierOrderButtons() {
  document.querySelectorAll('.view-courier-orders').forEach(button => {
    button.addEventListener('click', async () => {
      const courierId = button.dataset.courierId;
      const container = document.getElementById(`courier-orders-${courierId}`);

      if (container.style.display === 'block') {
        container.style.display = 'none';
        container.innerHTML = '';
        return;
      }

      try {
        const res = await fetch(`/admin/courier-orders/${courierId}`);
        const { orders } = await res.json();

        container.innerHTML = orders.length
          ? orders.map(order => `
            <div class="courier-order-item ${
              order.status === 'Доставлен'
                ? 'success-order'
                : order.status === 'Отменен'
                ? 'canceled-order'
                : ''
            }">
              <p><strong>Заказ №${order._id}</strong></p>
              <p><span class="order-status">${order.status}</span></p>
              <p>Сумма: ${order.totalPrice} BYN</p>
              <p>Клиент: ${order.owner.firstName} ${order.owner.lastName}</p>
              <p>Адрес: ${order.address}</p>
              <p>Дата: ${new Date(order.createdAt).toLocaleString()}</p>
            </div>`).join('')
          : '<p>Нет заказов для этого курьера.</p>';

        container.style.display = 'block';
      } catch (err) {
        console.error('Ошибка загрузки заказов курьера: ', err);
        container.innerHTML = '<p>Ошибка загрузки заказов.</p>';
        container.style.display = 'block';
      }
    });
  });
}
