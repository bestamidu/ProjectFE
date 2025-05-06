// Modal Functions
function openModal() {
  document.getElementById("accountModal").style.display = "block";
}

function closeModal() {
  document.getElementById("accountModal").style.display = "none";
}

function openEditModal() {
  document.getElementById("editCategoryModal").style.display = "block";
}

function closeEditModal() {
  document.getElementById("editCategoryModal").style.display = "none";
}

function openDeleteModal(month, categoryId) {
  deleteMonth = month;
  deleteCategoryId = categoryId;
  document.getElementById("deleteCategoryModal").style.display = "block";
}

function closeDeleteModal() {
  document.getElementById("deleteCategoryModal").style.display = "none";
  document.getElementById("error-deleteCategory").textContent = ""; // Clear error
  deleteMonth = null;
  deleteCategoryId = null;
}

function openDeleteTransactionModal(tranId) {
  transactionToDelete = tranId;
  document.getElementById("deleteTransactionModal").style.display = "block";
}

function closeDeleteTransactionModal() {
  document.getElementById("deleteTransactionModal").style.display = "none";
  transactionToDelete = null;
}

// Authentication Check
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) {
  window.location.href = "/pages/login.html";
}

// Data Initialization
let budgets = JSON.parse(localStorage.getItem("budgets")) || [];
let monthlyCategories = JSON.parse(localStorage.getItem("monthlyCategories")) || [];
let deleteMonth = null;
let deleteCategoryId = null;
let transactionToDelete = null;
let editMonth = "";
let editCategoryId = "";

// Error Handling Functions
function showInputError(inputId, message) {
  document.getElementById(`error-${inputId}`).textContent = message;
}

function clearInputError(inputId) {
  document.getElementById(`error-${inputId}`).textContent = "";
}

// Budget Management
document.querySelector(".btnSave").addEventListener("click", function () {
  const month = document.getElementById("monthInput").value;
  const budgetInput = document.getElementById("budgetInput").value.trim();
  clearInputError("monthInput");
  clearInputError("budgetInput");
  let hasError = false;

  if (!month) {
      showInputError("monthInput", "📅 Vui lòng chọn tháng!");
      hasError = true;
  }

  if (!budgetInput) {
      showInputError("budgetInput", "💰 Vui lòng nhập ngân sách tháng!");
      hasError = true;
  }

  if (hasError) return;

  const budgetValue = parseFloat(budgetInput.replace(/\./g, ""));
  if (isNaN(budgetValue)) {
      showInputError("budgetInput", "Ngân sách phải là số hợp lệ!");
      return;
  }

  let existingBudget = budgets.find(b => b.month === month);
  if (existingBudget) {
      existingBudget.budget = budgetValue;
      existingBudget.spent = existingBudget.spent || 0;
  } else {
      budgets.push({ month: month, budget: budgetValue, spent: 0 });
  }

  localStorage.setItem("budgets", JSON.stringify(budgets));
  renderBalance();
});

// Render Balance
function renderBalance() {
  const month = document.getElementById("monthInput").value;
  const balanceDisplay = document.getElementById("vnd");
  const currentBudget = budgets.find(b => b.month === month);
  if (!currentBudget) {
      balanceDisplay.textContent = "0 VND";
      return;
  }
  const remaining = currentBudget.budget - (currentBudget.spent || 0);
  balanceDisplay.textContent = `${remaining.toLocaleString()} VND`;
}

// Month Input Change Handler
document.getElementById("monthInput").addEventListener("change", function () {
  const month = this.value;
  clearCategoryInput();
  clearExpenseForm();
  renderCategoryOptions();
  renderCategoryList();
  renderTransactionList();
  renderBalance();
  const currentBudget = budgets.find(b => b.month === month);
  if (currentBudget) {
      document.getElementById("budgetInput").value = currentBudget.budget.toLocaleString();
  } else {
      document.getElementById("budgetInput").value = "";
  }
});

// Category Management
document.querySelector(".addBtn").addEventListener("click", function () {
  const month = document.getElementById("monthInput").value;
  const name = document.getElementById("categoryName").value.trim();
  const limitVnd = document.getElementById("categoryLimit").value.trim();

  clearInputError("categoryName");
  clearInputError("categoryLimit");
  let hasError = false;

  if (!name) {
      showInputError("categoryName", "Vui lòng nhập tên danh mục!");
      hasError = true;
  }

  if (!limitVnd) {
      showInputError("categoryLimit", "Vui lòng nhập giới hạn chi tiêu!");
      hasError = true;
  }

  if (hasError) return;

  const limitValue = parseFloat(limitVnd.replace(/\./g, ""));
  if (isNaN(limitValue)) {
      showInputError("categoryLimit", "Giới hạn phải là số hợp lệ!");
      return;
  }

  let monthData = monthlyCategories.find(m => m.month === month);
  if (!monthData) {
      monthData = {
          id: monthlyCategories.length + 1,
          month: month,
          categories: [],
          amount: 0
      };
      monthlyCategories.push(monthData);
  }

  const newData = {
      id: Date.now(),
      name: name,
      budget: limitValue
  };

  monthData.categories.push(newData);
  localStorage.setItem("monthlyCategories", JSON.stringify(monthlyCategories));
  renderCategoryList();
  renderCategoryOptions();
  clearCategoryInput();
});

// xoa du lieu form cho sach
function clearCategoryInput() {
  document.getElementById("categoryName").value = "";
  document.getElementById("categoryLimit").value = "";
}

function clearExpenseForm() {
  document.getElementById("chooseMoney").value = "";
  document.getElementById("optionCate").value = "";
  document.getElementById("noteCate").value = "";
}

// Hien thi danh sach danh muc 
function renderCategoryList() {
  const month = document.getElementById("monthInput").value;
  const list = document.getElementById("categoryList");
  list.innerHTML = "";
  const checkkk = document.getElementById("checkkk");

  const monthData = monthlyCategories.find(m => m.month === month);
  if (!monthData) {
      checkkk.textContent = "Chưa có dữ liệu";
      return;
  }

  checkkk.textContent = "";
  monthData.categories.forEach(category => {
      list.innerHTML += `
          <li>
              <strong>${category.name}</strong>: ${category.budget.toLocaleString()} VND 
              <div class="buttonCouple">
                  <button class="editBtn" onclick="editCategory('${monthData.month}', ${category.id})">Sửa</button>
                  <button class="deleteBtn" onclick="openDeleteModal('${monthData.month}', ${category.id})">Xóa</button>
              </div>
          </li>
      `;
  });
}

// chinh sua danh muc
function editCategory(month, categoryId) {
  const monthData = monthlyCategories.find(m => m.month === month);
  if (!monthData) return;

  const category = monthData.categories.find(c => c.id === categoryId);
  if (!category) return;

  editMonth = month;
  editCategoryId = categoryId;

  document.getElementById("editCategoryName").value = category.name;
  document.getElementById("editCategoryLimit").value = category.budget;
  document.getElementById("editCategoryModal").style.display = "block";
}

function saveEditCategory() {
  const newName = document.getElementById("editCategoryName").value.trim();
  const newLimit = document.getElementById("editCategoryLimit").value.trim();

  if (!newName || !newLimit) {
      alert("Vui lòng nhập đủ tên và giới hạn!");
      return;
  }

  const limitValue = parseFloat(newLimit.replace(/\./g, ""));
  if (isNaN(limitValue)) {
      alert("Giới hạn mới phải là số hợp lệ!");
      return;
  }

  const monthData = monthlyCategories.find(m => m.month === editMonth);
  if (!monthData) return;

  const category = monthData.categories.find(c => c.id === editCategoryId);
  if (!category) return;

  category.name = newName;
  category.budget = limitValue;
  localStorage.setItem("monthlyCategories", JSON.stringify(monthlyCategories));
  renderCategoryList();
  renderCategoryOptions();
  closeEditModal();
  renderTransactionList();
}

// xoa dah mucmuc
function confirmDeleteCategory() {
  const monthData = monthlyCategories.find(m => m.month === deleteMonth);
  if (!monthData) return;

  const category = monthData.categories.find(c => c.id === deleteCategoryId);
  if (!category) return;

  // lọc thángtháng
  let transactions = JSON.parse(localStorage.getItem("transactions")) ;
  const hasTransactions = transactions.some(
      t => t.month === deleteMonth && t.categoryId === category.name
  );

  if (hasTransactions) {
      document.getElementById("error-deleteCategory").textContent = 
          "❌ Vui lòng xóa tất cả giao dịch liên quan đến danh mục này trước!";
      return;
  }
  // xóa danh mục, lọc kh trùng idid
  monthData.categories = monthData.categories.filter(c => c.id !== deleteCategoryId);
  localStorage.setItem("monthlyCategories", JSON.stringify(monthlyCategories));
  renderCategoryList();
  renderCategoryOptions();
  closeDeleteModal();
}

// show cac optionsoptions
function renderCategoryOptions() {
  const month = document.getElementById("monthInput").value;
  const categorySelect = document.getElementById("optionCate");
  categorySelect.innerHTML = `<option value="">Chọn danh mục</option>`;

  const monthData = monthlyCategories.find(m => m.month === month);
  if (!monthData) return;

  monthData.categories.forEach(category => {
      const option = document.createElement("option");
      option.value = category.name;
      option.textContent = category.name;
      categorySelect.appendChild(option);
  });
}

// Transaction Management
document.querySelector(".btn1").addEventListener("click", function () {
  const moneyInput = document.getElementById("chooseMoney").value.trim();
  const categorySelect = document.getElementById("optionCate").value;
  const noteInput = document.getElementById("noteCate").value.trim();
  const month = document.getElementById("monthInput").value;

  clearInputError("chooseMoney");
  clearInputError("optionCate");
  clearInputError("noteCate");
  clearInputError("monthInput");
  let hasError = false;

  if (!month) {
      showInputError("monthInput", "📅 Vui lòng chọn tháng trước khi thêm chi tiêu!");
      hasError = true;
  }
  if (!moneyInput) {
      showInputError("chooseMoney", "💰 Vui lòng nhập số tiền!");
      hasError = true;
  }
  if (!categorySelect) {
      showInputError("optionCate", "❗ Vui lòng chọn danh mục!");
      hasError = true;
  }
  if (hasError) return;

  const amount = parseFloat(moneyInput.replace(/\./g, ""));
  if (isNaN(amount) || amount <= 0) {
      showInputError("chooseMoney", "💰 Số tiền phải là số hợp lệ lớn hơn 0!");
      return;
  }

  const monthData = monthlyCategories.find(m => m.month === month);
  if (!monthData) {
      showInputError("monthInput", "❌ Tháng chưa có dữ liệu danh mục!");
      return;
  }

  const selectedCategory = monthData.categories.find(c => c.name === categorySelect);
  if (!selectedCategory) {
      showInputError("optionCate", "❌ Danh mục không hợp lệ!");
      return;
  }

  let currentBudget = budgets.find(b => b.month === month);
  if (currentBudget) {
      currentBudget.spent = (currentBudget.spent || 0) + amount;
      localStorage.setItem("budgets", JSON.stringify(budgets));
  }

  monthData.amount += amount;
  localStorage.setItem("monthlyCategories", JSON.stringify(monthlyCategories));

  const newTransaction = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      amount: amount,
      description: noteInput || "Không có ghi chú",
      categoryId: categorySelect,
      month: month
  };

  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  transactions.push(newTransaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));

  renderBalance();
  renderTransactionList();
  renderCategoryList();
  renderCategoryOptions();
  clearExpenseForm();
  clearCategoryInput();

  showInputError("noteCate", "✅ Thêm chi tiêu thành công!");
  document.getElementById("error-noteCate").style.color = "green";
});

// ham xoa giao dichdich
function confirmDeleteTransaction() {
  if (transactionToDelete === null) return;

  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  const transaction = transactions.find(t => t.id === transactionToDelete);

  if (transaction) {
      const month = transaction.month;
      const amount = transaction.amount;

      let currentBudget = budgets.find(b => b.month === month);
      if (currentBudget) {
          currentBudget.spent -= amount;
          localStorage.setItem("budgets", JSON.stringify(budgets));
      }

      let monthData = monthlyCategories.find(m => m.month === month);
      if (monthData) {
          monthData.amount -= amount;
          localStorage.setItem("monthlyCategories", JSON.stringify(monthlyCategories));
      }

      transactions = transactions.filter(t => t.id !== transactionToDelete);
      localStorage.setItem("transactions", JSON.stringify(transactions));

      renderTransactionList();
      renderBalance();
      renderCategoryList();
      renderCategoryOptions();
  }
  closeDeleteTransactionModal();
}

//pham trang va sap xep va hthihthi
const transactionsPerPage = 2;
let currentPage = 1;

function sortTransactions(order) {
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  if (order === "asc") {
      transactions.sort((a, b) => a.amount - b.amount);
  } else if (order === "desc") {
      transactions.sort((a, b) => b.amount - a.amount);
  }
  localStorage.setItem("transactions", JSON.stringify(transactions));
  renderTransactionList();
}

function renderTransactionList(searchQuery = "") {
  const transactionList = document.getElementById("transactionList");
  transactionList.innerHTML = "";
  const selectedMonth = document.getElementById("monthInput").value;
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  const filteredTrans = transactions.filter(
      transaction =>
          transaction.month === selectedMonth &&
          transaction.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTrans.length / transactionsPerPage);
  const startIndex = (currentPage - 1) * transactionsPerPage;
  const endIndex = startIndex + transactionsPerPage;
  const paginatedTrans = filteredTrans.slice(startIndex, endIndex);

  paginatedTrans.forEach(transaction => {
      transactionList.innerHTML += `
          <li>
              <span>${transaction.description} - ${transaction.amount.toLocaleString()} VND - Danh mục: ${transaction.categoryId}</span>
              <button id="deleteTrans" onclick="openDeleteTransactionModal(${transaction.id})">Xóa</button>
          </li>
      `;
  });

  document.getElementById("currentPage").textContent = currentPage;
  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = currentPage === totalPages;
}

// Event Listeners
document.getElementById("searchInput").addEventListener("input", function () {
  currentPage = 1;
  renderTransactionList(this.value.trim());
});

document.getElementById("sortAscBtn").addEventListener("click", function () {
  sortTransactions("asc");
});

document.getElementById("sortDescBtn").addEventListener("click", function () {
  sortTransactions("desc");
});

document.getElementById("prevPage").addEventListener("click", function () {
  if (currentPage > 1) {
      currentPage--;
      renderTransactionList(document.getElementById("searchInput").value.trim());
  }
});

document.getElementById("nextPage").addEventListener("click", function () {
  const selectedMonth = document.getElementById("monthInput").value;
  const searchQuery = document.getElementById("searchInput").value.trim();
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  const filteredTrans = transactions.filter(
      transaction =>
          transaction.month === selectedMonth &&
          transaction.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredTrans.length / transactionsPerPage);
  if (currentPage < totalPages) {
      currentPage++;
      renderTransactionList(searchQuery);
  }
});

document.getElementById("monthInput").addEventListener("change", function () {
  currentPage = 1;
  renderTransactionList();
});