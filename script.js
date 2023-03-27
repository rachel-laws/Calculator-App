// Calculator --

// Number and operation buttons
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');

// Unique function buttons
const percentButton = document.querySelector('[data-percent]');
const squareRootButton = document.querySelector('[data-sqr]');
const changeSignButton = document.querySelector('[data-sign]');
const deleteButton = document.querySelector('[data-delete]');
const clearButton = document.querySelector('[data-clear]');
const equalsButton = document.querySelector('[data-equals]');

// Display previous and current numbers and operands
const previousOperandElement = document.querySelector('[data-previous]');
const currentOperandElement = document.querySelector('[data-current]');

class Calculator {
  constructor(previousOperandElement, currentOperandElement) {
    this.previousOperandElement = previousOperandElement;
    this.currentOperandElement = currentOperandElement;
    this.clear();
  }

  // Clear all
  clear() {
    this.currentOperand = '';
    this.previousOperand = '';
    this.operation = undefined;
  }

  // Delete last character
  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  // Append number to current operand
  appendNumber(number) {
    // Limit of one decimal point
    if (number === '.' && this.currentOperand.includes('.')) return;
    // Limit of 20 characters per operand
    else if (this.currentOperand.length > 20) return;
    this.currentOperand = this.currentOperand.toString() + number.toString();
  }

  // Choose operand
  chooseOperation(operation) {
    if (this.currentOperand === '') return; // None
    if (this.operation !== undefined) return; // Already present
    if (this.previousOperand !== '') {
      this.calculate();
    }
    // Clear current operation and operand
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
  }

  // Do the math!
  calculate() {
    let calculation;
    const previous = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(previous) || isNaN(current)) return;
    switch (this.operation) {
      case 'x':
        calculation = previous * current;
        break;
      case '÷':
        calculation = this.divide(previous, current);
        break;
      case '+':
        calculation = previous + current;
        break;
      case '−':
        calculation = previous - current;
        break;
      case '%':
        calculation = this.calculatePercent();
        break;
      case '√':
        calculation = this.calculateSquareRoot();
        break;
      case '^':
        calculation = previous ** current;
        break;
      case '+/-':
        calculation = this.changeSign();
        break;
      default:
        return;
    }
    // Set current, clear previous
    this.currentOperand = calculation;
    this.operation = undefined;
    this.previousOperand = '';
  }

  // Divide - Prevent dividing by 0
  divide(a, b) {
    return b === 0 ? 0 : a / b;
  }

  // Current operand to percent
  calculatePercent() {
    const current = parseFloat(this.currentOperand);
    if (isNaN(current)) {
      return;
    }
    const calculation = current / 100;
    this.currentOperand = calculation.toString();
  }

  // Square root of current operand
  calculateSquareRoot() {
    const current = parseFloat(this.currentOperand);
    if (isNaN(current)) {
      return;
    }
    const squareRoot = Math.sqrt(current);
    this.currentOperand = squareRoot.toString();
  }

  // Switch sign (+/-) of current operand
  changeSign() {
    let calculation;
    const current = parseFloat(this.currentOperand);
    if (isNaN(current)) return;
    calculation = current * -1;
    this.currentOperand = calculation;
  }

  // Display number to calculator output screen
  getDisplayNumber(number) {
    // Number --> String
    const stringNumber = number.toString();

    // String > Integer || Decimal
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];

    // Format with commas and decimals as needed
    const integerOutput = isNaN(integerDigits)
      ? ''
      : integerDigits.toLocaleString('en', {
          maximumFractionDigits: 0,
        });
    return decimalDigits != null
      ? `${integerOutput}.${decimalDigits}`
      : `${integerOutput}`;
  }

  // Calculator output screen
  updateOutput() {
    // Update current operand
    this.currentOperandElement.innerText = this.getDisplayNumber(
      this.currentOperand
    );

    // If an operation is in progress, switch operand symbol
    if (this.operation != null) {
      this.previousOperandElement.innerText =
        `${this.getDisplayNumber(this.previousOperand)}` +
        ` ${this.operation} `;
    } else {
      // Clear previous operand
      this.previousOperandElement.innerText = '';
    }
  }
}

// Instantiate new calculator
const calculator = new Calculator(
  previousOperandElement,
  currentOperandElement
);

// Event listeners --

// Number buttons
numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText);
    calculator.updateOutput();
  });
});

// Operation buttons
operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateOutput();
  });
});

// Equals
equalsButton.addEventListener('click', () => {
  calculator.calculate();
  calculator.updateOutput();
});

// clear
clearButton.addEventListener('click', () => {
  calculator.clear();
  calculator.updateOutput();
});

// Delete
deleteButton.addEventListener('click', () => {
  calculator.delete();
  calculator.updateOutput();
});

// Percent
percentButton.addEventListener('click', () => {
  calculator.calculatePercent();
  calculator.updateOutput();
});

// Square Root
squareRootButton.addEventListener('click', () => {
  calculator.calculateSquareRoot();
  calculator.updateOutput();
});

// Change Sign (+/-)
changeSignButton.addEventListener('click', () => {
  calculator.changeSign();
  calculator.updateOutput();
});

// Keypress functionality --

document.addEventListener('keydown', event => {
  const key = event.key;
  // Numbers (0-9)
  if (key >= 0 && key <= 10) {
    for (let i = 10; i >= 0; i--) {
      if (numberButtons[i].textContent === key) {
        numberButtons[i].click();
      } else if (key === '.') {
        numberButtons[10].click();
      }
    }
  } else {
    switch (key) {
      // Exponent
      case '^':
        operationButtons[0].click();
        break;
      // Multiply
      case '*':
        operationButtons[1].click();
        break;
      // Divide
      case '/':
        operationButtons[2].click();
        break;
      // Add
      case '+':
        operationButtons[3].click();
        break;
      // Subtract
      case '-':
        operationButtons[4].click();
        break;

      // Unique functions --

      // Percent
      case '%':
        percentButton.click();
        break;
      // Square Root
      case 'r':
        squareRootButton.click();
        break;
      // Change Sign
      case 'n':
        changeSignButton.click();
        break;
      // Delete
      case 'Backspace':
        deleteButton.click();
        break;
      // Clear
      case 'c':
        clearButton.click();
        break;
      // Equals
      case '=':
        equalsButton.click();
        break;
      default:
        break;
    }
  }
});

// Responsive Navigation --

const navBar = document.querySelector('.nav-bar');
const navToggle = document.querySelector('.nav-toggle');

navToggle.addEventListener('click', mobileNavToggle);

function mobileNavToggle() {
  const visibile = navBar.getAttribute('data-visible');
  if (visibile === 'false') {
    navBar.setAttribute('data-visible', true);
    navToggle.setAttribute('aria-expanded', true);
  } else {
    navBar.setAttribute('data-visible', false);
    navToggle.setAttribute('aria-expanded', false);
  }
}

function themeSelector() {
  const themeSelects = document.querySelectorAll('input[name="theme"]');
  const themeStyles = document.getElementById('themeStyles');

  function activateTheme(themeName) {
    themeStyles.setAttribute('href', `Themes/${themeName}.css`);
    localStorage.setItem('theme', themeName);
  }

  for (const themeSelect of themeSelects) {
    themeSelect.addEventListener('click', () => {
      if (themeSelect.checked) {
        activateTheme(themeSelect.value);
      }
    });

    if (themeSelect.value === localStorage.getItem('theme')) {
      themeSelect.checked = true;
      activateTheme(themeSelect.value);
    }
  }
}

themeSelector();
