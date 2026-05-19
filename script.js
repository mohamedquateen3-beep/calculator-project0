const resultEl = document.getElementById('result');
const expressionEl = document.getElementById('expression');

let current = '0';
let expression = '';
let prevValue = null;
let operator = null;
let shouldReset = false;

function updateDisplay() {
  resultEl.textContent = current;
  expressionEl.textContent = expression;

  resultEl.classList.remove('small', 'xsmall');

  if (current.length > 12) {
    resultEl.classList.add('xsmall');
  } else if (current.length > 9) {
    resultEl.classList.add('small');
  }
}

function handleNumber(value) {
  if (current === 'Error') {
    current = '0';
    expression = '';
    operator = null;
    prevValue = null;
  }

  if (shouldReset) {
    current = value === '.' ? '0.' : value;
    shouldReset = false;
  } else {
    if (value === '.' && current.includes('.')) return;
    current = current === '0' && value !== '.' ? value : current + value;
  }

  updateDisplay();
}

function formatOp(op) {
  return {
    '+': '+',
    '-': '−',
    '*': '×',
    '/': '÷'
  }[op] || op;
}

function handleOperator(op) {
  if (current === 'Error') return;

  if (operator && !shouldReset) {
    calculate();
  }

  prevValue = parseFloat(current);
  operator = op;
  expression = current + ' ' + formatOp(op);
  shouldReset = true;

  updateDisplay();
}

function calculate() {
  if (operator === null || prevValue === null) return;

  const a = prevValue;
  const b = parseFloat(current);
  let res;

  switch (operator) {
    case '+':
      res = a + b;
      break;

    case '-':
      res = a - b;
      break;

    case '*':
      res = a * b;
      break;

    case '/':
      res = b !== 0 ? a / b : 'Error';
      break;
  }

  current = res === 'Error' ? 'Error' : String(parseFloat(res.toFixed(10)));
}

function handleEquals() {
  if (operator === null || prevValue === null || current === 'Error') return;

  const fullExpression = expression + ' ' + current + ' =';

  calculate();

  expression = fullExpression;
  operator = null;
  prevValue = null;
  shouldReset = true;

  updateDisplay();
}

function handleClear() {
  current = '0';
  expression = '';
  operator = null;
  prevValue = null;
  shouldReset = false;

  updateDisplay();
}

function handleSign() {
  if (current === '0' || current === 'Error') return;

  current = current.startsWith('-') ? current.slice(1) : '-' + current;

  updateDisplay();
}

function addRipple(btn, e) {
  const ripple = document.createElement('span');
  ripple.classList.add('ripple-el');

  const rect = btn.getBoundingClientRect();

  ripple.style.left = e.clientX - rect.left - 30 + 'px';
  ripple.style.top = e.clientY - rect.top - 30 + 'px';

  btn.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 400);
}

document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', e => {
    addRipple(btn, e);

    const value = btn.dataset.value;
    const action = btn.dataset.action;

    if (value !== undefined) {
      const operators = ['+', '-', '*', '/'];

      if (operators.includes(value)) {
        handleOperator(value);
      } else {
        handleNumber(value);
      }
    }

    if (action === 'clear') handleClear();
    if (action === 'equals') handleEquals();
    if (action === 'sign') handleSign();
  });
});

document.addEventListener('keydown', e => {
  const key = e.key;

  if ('0123456789.'.includes(key)) {
    handleNumber(key);
  } else if (['+', '-', '*', '/'].includes(key)) {
    handleOperator(key);
  } else if (key === 'Enter' || key === '=') {
    handleEquals();
  } else if (key === 'Escape') {
    handleClear();
  } else if (key === 'Backspace') {
    if (current.length > 1 && !shouldReset && current !== 'Error') {
      current = current.slice(0, -1);
    } else {
      current = '0';
    }

    updateDisplay();
  }
});

updateDisplay();