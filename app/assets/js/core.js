function initMenu() {
  const trigger = document.querySelector('#trigger-menu');
  if (!trigger) return;
  const menu = document.querySelector('.menu');
  trigger.addEventListener('click', () => {
    menu.classList.toggle('is-visible');
  })
}

function initSearchBox() {
  const searchBox = document.querySelector('.search-box');
  if (!searchBox) return;
  searchBox.addEventListener('click', e => {
    const target = e.target;
    if (target.localName == "button" && target.getAttribute('data-trigger') == "open") {
      searchBox.classList.add('is-visible');
      searchBox.querySelector('input').focus();
    };
    if (target.localName == "button" && target.getAttribute('data-trigger') == "close") searchBox.classList.remove('is-visible');
  })
}

export default (() => {
  initMenu();
  initSearchBox();
})();