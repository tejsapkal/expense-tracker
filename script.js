const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const category = document.getElementById('category');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '' || category.value === '') {
    alert('Please enter description, amount, and category');
    return;
  }

  const transaction = {
    id: Date.now(),
    text: text.value,
    amount: +amount.value,
    category: category.value
  };

  transactions.push(transaction);
  updateLocalStorage();
  addTransactionToDOM(transaction);
  updateValues();

  text.value = '';
  amount.value = '';
  category.value = '';
}

function addTransactionToDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const li = document.createElement('li');

  li.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
  li.innerHTML = `
    ${transaction.text} <small>(${transaction.category})</small>
    <span>${sign}₹${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

  list.appendChild(li);
}

function updateValues() {
  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((acc, val) => acc + val, 0).toFixed(2);
  const incomeTotal = amounts
    .filter(val => val > 0)
    .reduce((acc, val) => acc + val, 0)
    .toFixed(2);
  const expenseTotal = amounts
    .filter(val => val < 0)
    .reduce((acc, val) => acc + val, 0)
    .toFixed(2);

  balance.innerText = `₹${total}`;
  income.innerText = `₹${incomeTotal}`;
  expense.innerText = `₹${Math.abs(expenseTotal)}`;
}

function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  init();
}

function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionToDOM);
  updateValues();
}

form.addEventListener('submit', addTransaction);

init();
