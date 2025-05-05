// document.querySelectorAll('.btn-add-cart').forEach((button) => {
//   button.addEventListener('click', function () {
//     const foodId = this.dataset.id;

//     fetch(`/foods/detail/${foodId}`)
//       .then((res) => {
//         if (!res.ok) throw new Error('Ошибка при получении данных');
//         return res.json();
//       })
//       .then((data) => {
//         document.getElementById('modalTitle').textContent = data.title;
//         document.getElementById('modalDescription').textContent = data.description;
//         document.getElementById('modalPrice').textContent = data.price;
//         document.getElementById('modalImage').src = data.imageUrl;
//         document.getElementById('modalRating').textContent = data.rating;
//         document.getElementById('modalCalories').textContent = data.nutritionalValue.calories;
//         document.getElementById('modalProtein').textContent = data.nutritionalValue.protein;
//         document.getElementById('modalFat').textContent = data.nutritionalValue.fat;
//         document.getElementById('modalCarbs').textContent = data.nutritionalValue.carbs;

//         document.getElementById('foodModal').classList.remove('hidden');
//         document.getElementById('modalOverlay').classList.remove('hidden');
//       })
//       .catch((err) => {
//         console.error('Ошибка: ', err);
//         alert('Ошибка при загрузке информации о блюде.');
//       });
//   });
// });

// document.querySelector('.close-modal-detail').addEventListener('click', () => {
//   document.getElementById('foodModal').classList.add('hidden');
//   document.getElementById('modalOverlay').classList.add('hidden');
// });

// document.getElementById('modalOverlay').addEventListener('click', () => {
//   document.getElementById('foodModal').classList.add('hidden');
//   document.getElementById('modalOverlay').classList.add('hidden');
// });

function attachAddToCartHandlers() {
  document.querySelectorAll('.btn-add-cart').forEach((button) => {
    button.addEventListener('click', function () {
      const foodId = this.dataset.id;

      fetch(`/foods/detail/${foodId}`)
        .then((res) => res.json())
        .then((data) => {
          const modal = document.getElementById('foodModal');
          modal.dataset.id = data._id;

          document.getElementById('modalTitle').textContent = data.title;
          document.getElementById('modalDescription').textContent = data.description;
          document.getElementById('modalPrice').textContent = data.price;
          document.getElementById('modalImage').src = data.imageUrl;
          document.getElementById('modalRating').textContent = data.rating;
          document.getElementById('modalCalories').textContent = data.nutritionalValue.calories;
          document.getElementById('modalProtein').textContent = data.nutritionalValue.protein;
          document.getElementById('modalFat').textContent = data.nutritionalValue.fat;
          document.getElementById('modalCarbs').textContent = data.nutritionalValue.carbs;

          modal.classList.remove('hidden');
          document.getElementById('modalOverlay').classList.remove('hidden');
        })
        .catch((err) => {
          console.error(err);
          alert('Ошибка при загрузке товара');
        });
    });
  });

  document.querySelector('.close-modal-detail').addEventListener('click', () => {
    document.getElementById('foodModal').classList.add('hidden');
    document.getElementById('modalOverlay').classList.add('hidden');
  });

  document.getElementById('modalOverlay').addEventListener('click', () => {
    document.getElementById('foodModal').classList.add('hidden');
    document.getElementById('modalOverlay').classList.add('hidden');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  attachAddToCartHandlers();
});

export { attachAddToCartHandlers };
