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
      } catch (err) {
        contentContainer.innerHTML = '<p>Ошибка загрузки содержимого</p>';
        console.error(err);
      }
    });
  });

  document.querySelector('.tm-paging-link-profile.active').click();
});
