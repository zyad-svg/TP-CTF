document.addEventListener('DOMContentLoaded', function () {
  var lines = [
    { el: '.term-line', delay: 0 },
  ];

  var termBody = document.querySelector('.terminal-body');
  if (termBody) {
    var cursor = document.createElement('span');
    cursor.className = 'term-cursor';
    cursor.textContent = '_';
    termBody.appendChild(cursor);
  }

  var loginForm = document.getElementById('loginForm');
  var formError = document.getElementById('formError');
  var errorMsg = document.getElementById('errorMsg');

  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var username = document.getElementById('username').value.trim();
      var password = document.getElementById('password').value.trim();

      if (!username || !password) {
        showError('All fields are required.');
        return;
      }

      /* TODO: Replace with server-side authentication logic */
      /* SQL injection vulnerability should be implemented server-side */
      handleLoginAttempt(username, password);
    });
  }

  function showError(msg) {
    if (formError && errorMsg) {
      errorMsg.textContent = msg;
      formError.classList.remove('hidden');
    }
  }

  function hideError() {
    if (formError) {
      formError.classList.add('hidden');
    }
  }

  function handleLoginAttempt(username, password) {
    /* Placeholder — implement authentication here */
    hideError();
    showError('Authentication failed. Invalid credentials.');
  }
});
