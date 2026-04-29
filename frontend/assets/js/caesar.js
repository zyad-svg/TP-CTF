document.addEventListener('DOMContentLoaded', function () {
  var cipherInput = document.getElementById('cipherInput');
  var plainOutput = document.getElementById('plainOutput');
  var shiftInput = document.getElementById('shiftInput');
  var decryptBtn = document.getElementById('decryptBtn');
  var bruteBtn = document.getElementById('bruteBtn');
  var clearBtn = document.getElementById('clearBtn');
  var brutePanel = document.getElementById('brutePanel');
  var bruteResults = document.getElementById('bruteResults');

  function caesarDecrypt(text, shift) {
    shift = ((shift % 26) + 26) % 26;
    return text.replace(/[a-zA-Z]/g, function (ch) {
      var base = ch >= 'a' ? 97 : 65;
      return String.fromCharCode(((ch.charCodeAt(0) - base - shift + 26) % 26) + base);
    });
  }

  if (decryptBtn) {
    decryptBtn.addEventListener('click', function () {
      var text = cipherInput.value;
      var shift = parseInt(shiftInput.value, 10) || 0;
      plainOutput.value = caesarDecrypt(text, shift);
      if (brutePanel) brutePanel.classList.add('hidden');
    });
  }

  if (bruteBtn) {
    bruteBtn.addEventListener('click', function () {
      var text = cipherInput.value;
      if (!text.trim()) return;

      bruteResults.innerHTML = '';
      for (var i = 1; i <= 25; i++) {
        var row = document.createElement('div');
        row.className = 'brute-row';

        var rotLabel = document.createElement('span');
        rotLabel.className = 'brute-rot';
        rotLabel.textContent = 'ROT' + i + ':';

        var rotText = document.createElement('span');
        rotText.textContent = caesarDecrypt(text, i);

        row.appendChild(rotLabel);
        row.appendChild(rotText);
        bruteResults.appendChild(row);
      }

      if (brutePanel) brutePanel.classList.remove('hidden');
      plainOutput.value = '';
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      cipherInput.value = '';
      plainOutput.value = '';
      if (bruteResults) bruteResults.innerHTML = '';
      if (brutePanel) brutePanel.classList.add('hidden');
    });
  }
});
