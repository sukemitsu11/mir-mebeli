const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');

function closeMenu() {
  mobileNav.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.textContent = 'Меню';
}

menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.textContent = open ? 'Закрыть' : 'Меню';
  mobileNav.hidden = !open;
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileNav.hidden) { closeMenu(); menuToggle.focus(); }
});
matchMedia('(min-width: 801px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

const filters = document.querySelectorAll('[data-filter]');
const items = document.querySelectorAll('[data-category]');
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(filter => {
    const active = filter === button;
    filter.classList.toggle('active', active);
    filter.setAttribute('aria-pressed', String(active));
  });
  items.forEach(item => { item.hidden = button.dataset.filter !== 'all' && item.dataset.category !== button.dataset.filter; });
  document.querySelector('#filter-status').textContent = `Показано: ${button.textContent}. Категорий: ${[...items].filter(item => !item.hidden).length}.`;
}));

const dialog = document.querySelector('.consult-dialog');
const form = document.querySelector('#consult-form');
const result = document.querySelector('#consult-result');
const furniture = document.querySelector('#furniture');
let consultTrigger;

document.querySelectorAll('[data-consult]').forEach(button => button.addEventListener('click', () => {
  consultTrigger = button;
  furniture.value = button.dataset.consult;
  form.hidden = false;
  result.hidden = true;
  dialog.showModal();
  document.body.style.overflow = 'hidden';
}));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.style.overflow = '';
  consultTrigger?.focus();
});
form.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const wishes = String(data.get('wishes')).trim();
  const message = `Здравствуйте, Мир мебели! Хочу обсудить мебель для дома.\nИнтересует: ${data.get('furniture')}.\nЭтап: ${data.get('stage')}.${wishes ? `\nПожелания: ${wishes}` : ''}\nПодскажите, пожалуйста, возможные решения, стоимость и сроки.`;
  document.querySelector('#message-preview').textContent = message;
  document.querySelector('#whatsapp-link').href = `https://wa.me/79377215891?text=${encodeURIComponent(message)}`;
  form.hidden = true;
  result.hidden = false;
  document.querySelector('#whatsapp-link').focus();
});
document.querySelector('#edit-message').addEventListener('click', () => {
  result.hidden = true;
  form.hidden = false;
  furniture.focus();
});
document.querySelector('#year').textContent = new Date().getFullYear();
