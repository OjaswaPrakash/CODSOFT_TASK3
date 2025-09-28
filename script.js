document.addEventListener('DOMContentLoaded', () => {
  const display = document.getElementById('display');
  const buttons = document.querySelector('.buttons');

  // single event listener for all calculator buttons
  buttons.addEventListener('click', (e) => {
    const btn = e.target;
    if (!btn.matches('button')) return;

    if (btn.dataset.number != null) {
      appendNumber(btn.dataset.number);
    } else if (btn.dataset.operator != null) {
      appendOperator(btn.dataset.operator);
    } else if (btn.dataset.action != null) {
      const action = btn.dataset.action;
      if (action === 'clear') clearDisplay();
      else if (action === 'del') deleteLast();
      else if (action === 'equals') calculateResult();
    }
  });

  function appendNumber(n) {
    if (display.value === 'Error') display.value = '';
    // prevent multiple dots in the current number segment
    const lastSegment = display.value.split(/[\+\-\*\/]/).pop();
    if (n === '.' ) {
      if (lastSegment.includes('.')) return;       // already has dot
      if (lastSegment === '') { display.value += '0.'; return; } // leading dot -> 0.
    }
    display.value += n;
  }

  function appendOperator(op) {
    if (display.value === '' ) return; // don't start with operator
    const last = display.value.slice(-1);
    if ('+-*/'.includes(last)) return; // prevent double operator
    display.value += op;
  }

  function clearDisplay() { display.value = ''; }
  function deleteLast() { display.value = display.value.slice(0, -1); }

  function calculateResult() {
    try {
      // Basic sanitization: allow only digits, operators, dot and parentheses
      if (!/^[0-9+\-*/().\s]+$/.test(display.value)) {
        display.value = 'Error';
        return;
      }
      // safer-ish evaluation
      const result = Function('"use strict"; return (' + display.value + ')')();
      display.value = Number.isFinite(result) ? result : 'Error';
    } catch (err) {
      display.value = 'Error';
    }
  }
});
