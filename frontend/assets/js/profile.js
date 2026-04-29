document.addEventListener('DOMContentLoaded', function () {
  var avatarInput = document.getElementById('avatarInput');
  var avatarImg = document.getElementById('avatarImg');
  var avatarPlaceholder = document.getElementById('avatarPlaceholder');

  if (avatarInput) {
    avatarInput.addEventListener('change', function (e) {
      var file = e.target.files[0];
      if (!file) return;

      if (file.type.startsWith('image/')) {
        var reader = new FileReader();
        reader.onload = function (ev) {
          avatarImg.src = ev.target.result;
          avatarImg.classList.remove('hidden');
          if (avatarPlaceholder) avatarPlaceholder.classList.add('hidden');
        };
        reader.readAsDataURL(file);
      } else {
        /* XML or other file types — TODO: implement XXE processing server-side */
        handleFileUpload(file);
      }
    });
  }

  function handleFileUpload(file) {
    /* Placeholder — implement server-side XML/file processing here */
    var reader = new FileReader();
    reader.onload = function (ev) {
      /* File content available at ev.target.result */
      /* Send to server endpoint for processing */
    };
    reader.readAsText(file);
  }

  var profileForm = document.getElementById('profileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', function (e) {
      e.preventDefault();
      /* TODO: Implement profile save via fetch/AJAX to server endpoint */
    });
  }

  var resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      if (profileForm) profileForm.reset();
    });
  }
});
