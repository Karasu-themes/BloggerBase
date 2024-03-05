(() => {

  function preferColorDetected() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return "dark";
    } else return "light";
  }

  const html = document.documentElement;
  const preferColor = localStorage.getItem("theme-prefer-color") ? localStorage.getItem("theme-prefer-color") : preferColorDetected();
  html.setAttribute('data-theme', preferColor);

  document.addEventListener('DOMContentLoaded', () => {
    const switchButton = document.getElementById('trigger-switch-theme');
    if (switchButton) {
      switchButton.setAttribute('data-current-theme', preferColor);
      switchButton.addEventListener('click', () => {
        const preferColor = switchButton.getAttribute('data-current-theme');
        if (preferColor == "light") {
          switchButton.setAttribute('data-current-theme', "dark");
          localStorage.setItem("theme-prefer-color", "dark");
          html.setAttribute('data-theme', "dark");
        } else if (preferColor == "dark") {
          switchButton.setAttribute('data-current-theme', "light");
          localStorage.setItem("theme-prefer-color", "light");
          html.setAttribute('data-theme', "light");
        }
      });
    }
  });

})();