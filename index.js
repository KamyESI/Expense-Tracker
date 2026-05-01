const globalAmount = document.getElementById("global-amount");
const incomeAmount = document.getElementById("income-amount");
const expenseAmount = document.getElementById("expense-amount");
const transactionList = document.querySelector(".transaction-list");
const transactionForm = document.getElementById("transaction-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");

/* GET DATA FROM THE LOCALSTORAGE AND DISPLAY THEM */
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
showTransctList(transactions);

let total = JSON.parse(localStorage.getItem("total")) || 0;
globalAmount.innerHTML = formatCurrency(total);

let storedIncome = JSON.parse(localStorage.getItem("income")) || 0;
incomeAmount.innerHTML = formatCurrency(storedIncome);

let storedExpense = JSON.parse(localStorage.getItem("expense")) || 0;
expenseAmount.innerHTML = formatCurrency(Math.abs(storedExpense));

/* ADD EVENT LISTENER TO THE FORM */
transactionForm.addEventListener("submit", submitFunc);

/* SUBMIT FUNCTION */
function submitFunc(e) {
  /* CREATE A TRANSACTION OBJECT FROM THE FORM'S INPUTS*/
  const transaction = {
    id: Date.now(),
    description: descriptionInput.value,
    amount: amountInput.value,
  };

  /* UPDATE LOCALSTORAGE AND TRANSACTION LIST AND RESET FORM */
  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  transactionForm.reset();

  /* RE-DISPLAY NEW TRANSACTIONS LIST */
  showTransctList(transactions);

  /* UPDATE BALANCE, INCOME, EXPENSES VALUES */
  if (transaction.amount > 0) {
    storedIncome += Number(transaction.amount);
    incomeAmount.innerHTML = formatCurrency(storedIncome);
    localStorage.setItem("income", JSON.stringify(storedIncome));
  } else {
    storedExpense += Number(transaction.amount);
    expenseAmount.innerHTML = formatCurrency(Math.abs(storedExpense));
    localStorage.setItem("expense", JSON.stringify(storedExpense));
  }
  total += Number(transaction.amount);
  globalAmount.innerHTML = formatCurrency(total);
  localStorage.setItem("total", JSON.stringify(total));
}

function showTransctList(transactions) {
  let historyOfTransactions = "";

  /* REVERSE THE LIST OF TRANSACTIONS TO DISPLAY THE LAST ONE INSERTED ON THE TOP */
  const sortedTransactions = [...transactions].reverse();

  sortedTransactions.forEach((trans) => {
    if (trans.amount > 0) {
      historyOfTransactions += `<li class="transaction income-trans">
                                    <span>${trans.description}</span>
                                    <div class="transaction-right">
                                      <span>${formatCurrency(trans.amount)}</span>
                                      <button class="delete-btn" onclick="removeTransaction(${trans.id})">x</button>
                                     </div>
                                </li>`;
    } else {
      historyOfTransactions += `<li class="transaction expences-trans">
                               <span>${trans.description}</span>
                               <div class="transaction-right">
                                      <span>${formatCurrency(trans.amount)}</span>
                                      <button class="delete-btn" onclick="removeTransaction(${trans.id})">x</button>
                                     </div>
                            </li>`;
    }
  });
  transactionList.innerHTML = historyOfTransactions;
}

function removeTransaction(id) {
  let updatedTrans = transactions.filter((item) => item.id !== Number(id));
  localStorage.setItem("transactions", JSON.stringify(updatedTrans));
  transactions = JSON.parse(localStorage.getItem("transactions"));
  showTransctList(transactions);

  let total = 0;
  let income = 0;
  let expense = 0;

  transactions.forEach((t) => {
    const amount = Number(t.amount);
    total += amount;

    if (amount > 0) {
      income += amount;
    } else {
      expense += amount;
    }
  });

  globalAmount.innerHTML = formatCurrency(total);
  incomeAmount.innerHTML = formatCurrency(income);
  expenseAmount.innerHTML = formatCurrency(Math.abs(expense));

  localStorage.setItem("total", JSON.stringify(total));
  localStorage.setItem("income", JSON.stringify(income));
  localStorage.setItem("expense", JSON.stringify(expense));
}

/* API THAT FORMATS NUMBERS TO CURRENCY */
function formatCurrency(number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(number);
}
