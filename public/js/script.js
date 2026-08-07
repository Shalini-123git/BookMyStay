
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