import { showToast } from './toast.js';

document.querySelector('.modal-detail-content').addEventListener('click', async (e) => {
  const addBtn = e.target.closest('#addToCartBtn');
  const decreaseBtn = e.target.closest('#decreaseQty');
  const increaseBtn = e.target.closest('#increaseQty');

  const foodId = document.getElementById('foodModal').dataset.id;
  if (!foodId) return;

  try {
    if (addBtn) {
      const res = await fetch(`/cart/add/${foodId}`, { method: 'POST' });
      const data = await res.json();

      if (data.success) {
        addBtn.classList.add('hidden');
        document.querySelector('#quantityControls').classList.remove('hidden');
        document.querySelector('#quantityDisplay').textContent = data.quantity;
        showToast('Товар добавлен в корзину', 'success');
      } else {
        alert('Ошибка при добавлении товара в корзину');
      }
    }

    if (decreaseBtn) {
      const res = await fetch(`/cart/decrease/${foodId}`, { method: 'POST' });
      const data = await res.json();

      if (data.success) {
        if (data.quantity > 0) {
          document.querySelector('#quantityDisplay').textContent = data.quantity;
        } else {
          document.querySelector('#quantityControls').classList.add('hidden');
          document.querySelector('#addToCartBtn').classList.remove('hidden');
        }
        showToast('Товар удалён из корзины', 'warning');
      } else {
        alert('Не удалось уменьшить количество товара');
      }
    }

    if (increaseBtn) {
      const res = await fetch(`/cart/increase/${foodId}`, { method: 'POST' });
      const data = await res.json();

      if (data.success) {
        document.querySelector('#quantityDisplay').textContent = data.quantity;
        showToast('Товар добавлен в корзину', 'success');
      } else {
        alert('Не удалось увеличить количество товара');
      }
    }
  } catch (err) {
    console.error('Ошибка при изменении количества товара: ', err);
    alert('Произошла ошибка при обновлении корзины');
  }
});



// document.querySelector('#addToCartBtn').addEventListener('click', async () => {

//   try {
//     const res = await fetch(`/cart/add/${foodId}`, {
//       method: 'POST',
//     });

//     const data = await res.json();
//     if (data.success) {
//       document.querySelector('#addToCartBtn').classList.add('hidden');
//       document.querySelector('#quantityControls').classList.remove('hidden');
//       document.querySelector('#quantityDisplay').textContent = data.quantity;
//       showToast('Товар добавлен в корзину', 'success');
//     } else {
//       alert('Ошибка при добавлении товара в корзину');
//     }
//   } catch (err) {
//     console.error('Ошибка: ', err);
//     alert('Ошибка при добавлении товара в корзину');
//   }
// });

// document.querySelector('#decreaseQty').addEventListener('click', async () => {
//   const foodId = document.getElementById('foodModal').dataset.id;

//   try {
//     const res = await fetch(`/cart/decrease/${foodId}`, {
//       method: 'POST',
//     });

//     const data = await res.json();

//     if (data.success) {
//       if (data.quantity > 0) {
//         document.querySelector('#quantityDisplay').textContent = data.quantity;
//       } else {
//         document.querySelector('#quantityControls').classList.add('hidden');
//         document.querySelector('#addToCartBtn').classList.remove('hidden');
//       }
//       showToast('Товар удалён из корзины', 'warning');
//     } else {
//       alert('Не удалось уменьшить количество товара');
//     }
//   } catch (err) {
//     console.error('Ошибка при уменьшении количества товара: ', err);
//     alert('Произошла ошибка при уменьшении количества товара');
//   }
// });

// document.querySelector('#increaseQty').addEventListener('click', async () => {
//   const foodId = document.getElementById('foodModal').dataset.id;

//   try {
//     const res = await fetch(`/cart/increase/${foodId}`, { method: 'POST' });

//     const data = await res.json();

//     if (data.success) {
//       document.querySelector('#quantityDisplay').textContent = data.quantity;
//       showToast('Товар добавлен в корзину', 'success');
//     } else {
//       alert('Не удалось увеличить количество товара');
//     }
//   } catch (err) {
//     console.error('Ошибка при увеличении количества: ', err);
//     alert('Произошла ошибка при увеличении количества товара');
//   }
// });
