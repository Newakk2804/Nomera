document.querySelector('.profile-content').addEventListener('submit', async (e) => {
  if (e.target && e.target.matches('#addressForm')) {
    e.preventDefault();

    const input = e.target.querySelector('#newAddress');
    const address = input.value.trim();

    if (!address) {
      return;
    }

    try {
      const res = await fetch('/profile/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });

      const data = await res.json();

      if (data.success) {
        location.reload();
      } else {
        alert(data.message || 'Ошибка добавления адреса');
      }
    } catch (err) {
      console.error(err);
      alert('Ошибка при добавлении адреса');
    }
  }
});

document.querySelector('.profile-content').addEventListener('click', async (e) => {
  if (e.target && e.target.closest('.deleteAddressBtn')) {
    const btn = e.target.closest('.deleteAddressBtn');
    const index = btn.dataset.index;

    try {
      const res = await fetch(`/profile/addresses/${index}`, { method: 'DELETE' });

      const data = await res.json();

      if (data.success) {
        location.reload();
      } else {
        alert(data.message || 'Ошибка удаления адреса');
      }
    } catch (err) {
      console.error(err);
      alert('Ошибка при удалении адреса');
    }
  }
});
