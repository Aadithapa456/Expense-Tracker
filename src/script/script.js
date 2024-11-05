// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAS74xlvS9mOiX3DnQ8XhFv6WYdgRy5bDs",
//   authDomain: "expense-tracker-f4ede.firebaseapp.com",
//   databaseURL: "https://expense-tracker-f4ede-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "expense-tracker-f4ede",
//   storageBucket: "expense-tracker-f4ede.firebasestorage.app",
//   messagingSenderId: "782372323186",
//   appId: "1:782372323186:web:de043f6b6a7f959aa767eb",
//   measurementId: "G-VKY9LG3XPT"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

let mainSectionWrapper = document.querySelector(".main-section-wrapper");
let dashboardBtn = document.querySelector(".tab-button-dashboard");
let reportsBtn = document.querySelector(".tab-button-report");
reportsBtn.addEventListener("click", showReports);
dashboardBtn.addEventListener("click", showTransaction);
let reportsContainer = document.querySelector(".reports-section");
let dashboardContainer = document.querySelector(".new-transaction-section");
function showReports() {
  setActiveTab(reportsBtn);
  reportsContainer.style.display = "block";
  dashboardContainer.style.display = "none";
  populateTable();
}
function showTransaction() {
  setActiveTab(dashboardBtn);
  dashboardContainer.style.display = "block";
  reportsContainer.style.display = "none";
}
function setActiveTab(activeButton) {
  // Remove active class from all buttons
  document
    .querySelectorAll(".tab-button-dashboard, .tab-button-report")
    .forEach((button) => {
      button.classList.remove("active");
    });
  // Add active class to the clicked button
  activeButton.classList.add("active");
}
const ctx = document.querySelector(".report");
new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["Income", "Expense"],
    datasets: [
      {
        label: "% of Amount spent",
        data: [12, 19],
        borderWidth: 1,
      },
    ],
    hoverOffset: 4,
  },
  options: {
    layout: {
      padding: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20,
      },
    },

    // scales: {
    //   x: {
    //     ticks: {
    //       display: false, // Set to false to remove the x-axis labels
    //     },
    //   },
    //   y: {
    //     ticks: {
    //       display: false, // Set to false to remove the y-axis labels
    //     },
    //     beginAtZero: true,
    //   },
    // },
  },
});
let submitBtn = document.querySelector(".submit-transaction");
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  addNewTransaction();
  updateAmountInfo();

});
function addNewTransaction() {
  let amountInputField = document.querySelector(".input-amount");
  let descriptionInputField = document.querySelector(".input-description");
  let amountTypeInputField = document.querySelector(".amount-type");
  let transaction = {
    amount: amountInputField.value,
    description: descriptionInputField.value,
    amountType: amountTypeInputField.value,
    time: new Date().toLocaleDateString(),
  };
  saveTransaction(transaction);
}
function saveTransaction(transaction) {
  let transactions = getTransactionData() || {};
  const transactionId = new Date().getTime().toString().slice(6);
  transactions[transactionId] = transaction;
  localStorage.setItem("transactions", JSON.stringify(transactions));
  // updateTransaction(transaction);
}
function getTransactionData() {
  return JSON.parse(localStorage.getItem("transactions")) || {};
}
// function updateTransaction(transaction) {
//   const transactions = getTransactionData();
//   const transactionId = new Date().getTime().toString(); // Use timestamp as unique ID
//   transactions[transactionId] = transaction;
//   localStorage.setItem("transactions", JSON.stringify(transactions));
// }
function populateTable() {
  updateAmountInfo();
  const transactions = getTransactionData();
  const transactionsTbody = document.querySelector(
    ".manage-transactions-tbody",
  );
  transactionsTbody.innerHTML = "";
  Object.entries(transactions).map(([id, data]) => {
    const newRow = `
      <tr class = "p-4 text-center">
        <td class="border-b border-gray-200 px-3 py-4" data-label = "Time">${data.time}</td>
        <td class="border-b border-gray-200 px-3 py-4" data-label = "Description">${data.description}</td>
        <td class="border-b border-gray-200 px-3 py-4" data-label = "Amount">${data.amount}</td>
        <td class="border-b border-gray-200 px-3 py-4" data-label = "Type">
          <span class="rounded-lg bg-orange-300 px-3 py-1 text-gray-100">${data.amountType}</span>
        </td>
      </tr>
    `;
    transactionsTbody.insertAdjacentHTML("beforeend", newRow);
  });
}
let totalIncome;
function updateAmountInfo() {
  const transactionsTotal = getTransactionData();
  totalIncome = 0;
  Object.entries(transactionsTotal).map(([id, data]) => {
    console.log(data.amount);
    totalIncome += Number(data.amount);
  });
  let incomeAmountDisplay = document.querySelector(".income-amount");
  incomeAmountDisplay.innerHTML = totalIncome + "$";
}
