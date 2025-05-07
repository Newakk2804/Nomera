import { showToast } from './toast.js';

document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.tm-paging-link-admin');
  const contentContainer = document.querySelector('.admin-content');

  links.forEach((link) => {
    link.addEventListener('click', async (e) => {
      e.preventDefault();

      const section = link.dataset.section;

      links.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');

      try {
        const res = await fetch(`/admin/${section}`);
        const html = await res.text();
        contentContainer.innerHTML = html;

        attachOrderButtons();
      } catch (err) {
        contentContainer.innerHTML = '<p>Ошибка загрузки содержимого</p>';
        console.error(err);
      }
    });
  });

  document.querySelector('.tm-paging-link-admin.active').click();

  function attachOrderButtons() {
    const viewButtons = document.querySelectorAll('.view-order-admin');
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
          const res = await fetch(`/admin/list-orders/${orderId}`);
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

    const assignButtons = document.querySelectorAll('.assign-courier-admin');
    assignButtons.forEach((button) => {
      button.addEventListener('click', async () => {
        const orderId = button.dataset.orderId;
        const orderDetailsDiv = document.getElementById(`order-${orderId}`);

        if (!orderDetailsDiv) return;

        if (orderDetailsDiv.style.display === 'block') {
          orderDetailsDiv.style.display = 'none';
          return;
        }

        try {
          const res = await fetch(`/admin/assign-courier/${orderId}`);
          const data = await res.json();

          const couriersHTML = data.couriers
            .map((courier) => {
              const isAssigned = data.currentCourierId === courier._id;
              return `
              <div class="courier-item">
                <span>${courier.firstName} ${courier.lastName} (${courier.email})</span>
                <button class="${isAssigned ? 'unassign-button' : 'assign-button'}" 
                        data-courier-id="${courier._id}" 
                        data-order-id="${orderId}">
                  ${isAssigned ? 'Удалить' : 'Назначить'}
                </button>
              </div>`;
            })
            .join('');

          const html = `<div class="assign-courier-list">${couriersHTML}</div>`;

          orderDetailsDiv.innerHTML = html;
          orderDetailsDiv.style.display = 'block';

          orderDetailsDiv.querySelectorAll('.assign-button').forEach((assignBtn) => {
            assignBtn.addEventListener('click', async () => {
              const courierId = assignBtn.dataset.courierId;
              const orderId = assignBtn.dataset.orderId;

              try {
                const res = await fetch(`/admin/assign-courier`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ courierId, orderId }),
                });

                if (res.ok) {
                  showToast('Курьер успешно назначен', 'success');
                  document.querySelector('.tm-paging-link-admin.active').click();
                } else {
                  showToast('Ошибка назначения курьера', 'error');
                }
              } catch (err) {
                console.error('Ошибка назначения', err);
              }
            });
          });

          orderDetailsDiv.querySelectorAll('.unassign-button').forEach((unassignBtn) => {
            unassignBtn.addEventListener('click', async () => {
              const orderId = unassignBtn.dataset.orderId;

              try {
                const res = await fetch(`/admin/unassign-courier`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ orderId }),
                });

                if (res.ok) {
                  showToast('Курьер удалён', 'success');
                  document.querySelector('.tm-paging-link-admin.active').click();
                } else {
                  showToast('Ошибка удаления курьера', 'error');
                }
              } catch (err) {
                console.error('Ошибка удаления', err);
              }
            });
          });
        } catch (err) {
          console.error('Ошибка загрузки курьеров', err);
        }
      });
    });

    document.querySelectorAll('.status-form').forEach((form) => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const orderId = form.dataset.orderId;
        const select = form.querySelector('.status-select');
        const newStatus = select.value;

        try {
          const res = await fetch('/admin/update-order-status', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderId, status: newStatus }),
          });

          if (res.ok) {
            showToast('Статус успешно обновлён', 'success');
            document.querySelector('.tm-paging-link-admin.active').click();
          } else {
            showToast('Ошибка при обновлении статуса', 'error');
          }
        } catch (err) {
          console.error('Ошибка:', err);
          showToast('Ошибка при подключении к серверу', 'error');
        }
      });
    });
  }
});
