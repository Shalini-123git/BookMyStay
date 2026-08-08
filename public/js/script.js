
// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
      const toggle = document.getElementById('darkToggle');
      const icon = document.getElementById('toggleIcon');
      const body = document.body;

      // Load saved preference
      if (localStorage.getItem('theme') === 'dark') {
          body.classList.add('dark-mode');
          icon.classList.replace('fa-moon', 'fa-sun');
      }

      toggle.addEventListener('click', () => {
          body.classList.toggle('dark-mode');
          const isDark = body.classList.contains('dark-mode');
          localStorage.setItem('theme', isDark ? 'dark' : 'light');
          
          if (isDark) {
              icon.classList.replace('fa-moon', 'fa-sun');
          } else {
              icon.classList.replace('fa-sun', 'fa-moon');
          }
          
          localStorage.setItem('theme', isDark ? 'dark' : 'light');
      });
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

const themeToggle = document.querySelector("#theme-toggle");

if (themeToggle) {
  const themeIcon = themeToggle.querySelector("i");

  const setThemeButton = theme => {
    const isDark = theme === "dark";
    themeIcon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  };

  const activeTheme = document.documentElement.getAttribute("data-bs-theme") || "light";
  setThemeButton(activeTheme);

  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-bs-theme") || "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-bs-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
    setThemeButton(nextTheme);
  });
}
