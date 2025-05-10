document.querySelector('.profile-content')?.addEventListener('submit', async (e) => {
  if (!e.target?.matches('#addressForm')) return;

  e.preventDefault();

  const address = e.target.querySelector('#newAddress')?.value.trim();
  if (!address) return;

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
});

document.querySelector('.profile-content')?.addEventListener('click', async (e) => {
  const btn = e.target.closest('.deleteAddressBtn');
  if (!btn) return;

  const index = btn.dataset.index;
  if (!index) return;

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
});
