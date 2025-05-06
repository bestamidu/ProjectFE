function openModal() {
    document.getElementById("accountModal").style.display = "block";
  }
  function closeEditModal() {
    document.getElementById("editCategoryModal").style.display = "none";
  }
  
  function closeModal() {
    document.getElementById("accountModal").style.display = "none";
  }
  function openDeleteModal(month, categoryId) {
    categoryToDelete = { month, categoryId };
    document.getElementById("deleteCategoryModal").style.display = "block";
  }
  
  // Hàm đóng modal xóa
  function closeDeleteModal() {
    document.getElementById("deleteCategoryModal").style.display = "none";
    categoryToDelete = null;
  }
  // Kiểm tra nếu chưa đăng nhập thì tự động chuyển về login
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
      window.location.href = "/pages/login.html";
  }
  
let budgets = JSON.parse(localStorage.getItem("budgets")) || [];
// function showError(message) {
//   document.getElementById("error-message").textContent = message;
// }

function showInputError(inputId, message) {
  document.getElementById(`error-${inputId}`).textContent = message;
}

function clearInputError(inputId) {
  document.getElementById(`error-${inputId}`).textContent = "";
}

// Hàm xóa lỗi
// function clearError() {
//   document.getElementById("error-message").textContent = "";
// }

document.querySelector(".btnSave").addEventListener("click", function(){
  const month = document.getElementById("monthInput").value;
  const budgetInput = document.getElementById("budgetInput").value.trim();
  // const balanceDisplay = document.getElementById("vnd");
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

  if (hasError) {
    return;
  }
    const budgetValue = parseFloat(budgetInput.replace(/\./g, ''));

    if (isNaN(budgetValue)) {
      showInputError("budgetInput", "Ngân sách phải là số hợp lệ!");
      return;
    }
    let existingBudget = budgets.find(b => b.month === month);
    if (existingBudget) {
      existingBudget.budget = budgetValue;
      existingBudget.spent = existingBudget.spent || 0;
    } else {
      budgets.push({ month: month, budget: budgetValue, spent:0 });
    }
  
    localStorage.setItem("budgets", JSON.stringify(budgets));
    renderBalance();
   
})

// function  renderBalance(){
//   const month = document.getElementById("monthInput").value;
//    const balanceDisplay = document.getElementById("vnd")
//    const currentBudget = budgets.find(b => b.month === month); //này là khi àm kh
//    if (!currentBudget) { 
//      balanceDisplay.textContent = "0 VND";
//      return;
//    }
//    const remaining = currentBudget.budget - (currentBudget.spent || 0);
//    balanceDisplay.textContent = `${remaining.toLocaleString()} VND`;

 

// }

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

// document.getElementById("monthInput").addEventListener("change", function() {
//   clearError();
//   renderBalance();
//   const currentBudget = budgets.find(b => b.month === month);
//   if (currentBudget) {
//     document.getElementById("budgetInput").value = currentBudget.budget.toLocaleString();
//   } else {
//     document.getElementById("budgetInput").value = "";
//   }
// });
document.getElementById("monthInput").addEventListener("change", function () {
  clearCategoryInput();  // Xóa các trường nhập liệu danh mục
  clearExpenseForm();    // Xóa các trường nhập liệu chi tiêu
  renderCategoryOptions();  // Làm mới danh mục
  renderCategoryList();  // Làm mới danh sách danh mục
  renderTransactionList();  // Làm mới danh sách giao dịch
  renderBalance(); // Thêm dòng này
  const month = this.value;
  const currentBudget = budgets.find((b) => b.month === month);
  if (currentBudget) {
    document.getElementById("budgetInput").value = currentBudget.budget.toLocaleString();
  } else {
    document.getElementById("budgetInput").value = "";
  }
});

let monthlyCategories = JSON.parse(localStorage.getItem("monthlyCategories")) || [];
document.querySelector(".addBtn").addEventListener("click", function() {
  const month = document.getElementById("monthInput").value;
  const name = document.getElementById("categoryName").value.trim();
  const limitVnd = document.getElementById("categoryLimit").value.trim();

  // Xóa lỗi cũ
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

  if (hasError) {
    return;
  }

  const limitValue = parseFloat(limitVnd.replace(/\./g, ''));
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
    id: Date.now(), // Tạo ID duy nhất
    name: name,
    budget: limitValue
  };
  
  monthData.categories.push(newData);
  localStorage.setItem("monthlyCategories", JSON.stringify(monthlyCategories));
  
  renderCategoryList();
  renderCategoryOptions();
  clearCategoryInput();
 });


  function clearCategoryInput() {
   document.getElementById("categoryName").value = "";
   document.getElementById("categoryLimit").value = "";
}

function renderCategoryList() {
  const month = document.getElementById("monthInput").value;
  const list = document.getElementById("categoryList");
  list.innerHTML = "";

  const monthData = monthlyCategories.find(m => m.month === month);
  if (!monthData) {
    document.getElementById("checkkk").textContent = "Chưa có dữ liệu";
    return;
  }
  checkkk.textContent = "";
  monthData.categories.forEach(category => {
      list.innerHTML += `
          <li>
              <strong>${category.name}</strong>: ${category.budget.toLocaleString()} VND 
            <div class="buttonCouple">
            <button  class="editBtn" onclick="editCategory('${monthData.month}', ${category.id})">Sửa</button>
            <button class="deleteBtn" onclick="deleteCategory('${monthData.month}', ${category.id})">Xóa</button>
        </div>
          </li>
      `;
  });
}
  let editMonth = "";
  let editCategoryId = "";
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

  const limitValue = parseFloat(newLimit.replace(/\./g, ''));
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
///xóaxóa
let deleteMonth = null;
let deleteCategoryId = null;
function deleteCategory(month, categoryId) {
  deleteMonth = month;          
  deleteCategoryId = categoryId;
  document.getElementById("deleteCategoryModal").style.display = "block";
}
function confirmDeleteCategory() {
  const monthData = monthlyCategories.find(m => m.month === deleteMonth);
  if (!monthData) return;

  monthData.categories = monthData.categories.filter(c => c.id !== deleteCategoryId);
  localStorage.setItem("monthlyCategories", JSON.stringify(monthlyCategories));
  renderCategoryList();
  
  closeDeleteModal();
}

function clearCategoryInput() {
  document.getElementById("categoryName").value = "";
  document.getElementById("categoryLimit").value = "";
}

function clearExpenseForm() {
   document.getElementById("chooseMoney").value = "";
  document.getElementById("optionCate").value = "";
   document.getElementById("noteCate").value = "";
}


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
  document.getElementById("monthInput").addEventListener("change", function() {
    renderBalance();
    renderCategoryOptions();
    renderCategoryList();
    renderTransactionList();
});

document.querySelector(".btn1").addEventListener("click", function () {
  const moneyInput = document.getElementById("chooseMoney").value.trim();
  const categorySelect = document.getElementById("optionCate").value;
  const noteInput = document.getElementById("noteCate").value.trim();
  const month = document.getElementById("monthInput").value;

  // Xóa lỗi cũ
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
  if (hasError) {
    return;
  }

  const amount = parseFloat(moneyInput.replace(/\./g, ""));
  if (isNaN(amount) || amount <= 0) {
    showInputError("chooseMoney", "💰 Số tiền phải là số hợp lệ lớn hơn 0!");
    return;
  }

  const monthData = monthlyCategories.find((m) => m.month === month);
  if (!monthData) {
    showInputError("monthInput", "❌ Tháng chưa có dữ liệu danh mục!");
    return;
  }

  const selectedCategory = monthData.categories.find((c) => c.name === categorySelect);
  if (!selectedCategory) {
    showInputError("optionCate", "❌ Danh mục không hợp lệ!");
    return;
  }

  // Cập nhật chi tiêu trong budgets
  let currentBudget = budgets.find((b) => b.month === month);
  if (currentBudget) {
    currentBudget.spent = (currentBudget.spent || 0) + amount;
    localStorage.setItem("budgets", JSON.stringify(budgets));
  }

  // Cập nhật tổng chi tiêu trong monthlyCategories
  monthData.amount += amount;
  localStorage.setItem("monthlyCategories", JSON.stringify(monthlyCategories));

  // Thêm giao dịch mới vào transactions
  const newTransaction = {
    id: Date.now(),
    date: new Date().toLocaleDateString(),
    amount: amount,
    description: noteInput || "Không có ghi chú",
    categoryId: categorySelect,
    month: month, // Thêm thuộc tính month
  };

  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  transactions.push(newTransaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));

  // Cập nhật giao diện
  renderBalance();
  renderTransactionList(); // Hiển thị danh sách giao dịch
  renderCategoryList();
  renderCategoryOptions();
  clearExpenseForm();
  clearCategoryInput();

  // Hiển thị thông báo thành công
  showInputError("noteCate", "✅ Thêm chi tiêu thành công!");
  document.getElementById("error-noteCate").style.color = "green";
});
let transactionToDelete = null;

function openDeleteTransactionModal(tranId) {
  transactionToDelete = tranId;
  document.getElementById("deleteTransactionModal").style.display = "block";
}

function closeDeleteTransactionModal() {
  document.getElementById("deleteTransactionModal").style.display = "none";
  transactionToDelete = null;
}
function confirmDeleteTransaction() {
  if (transactionToDelete !== null) {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    const transaction = transactions.find(t => t.id === transactionToDelete);

    if (transaction) {
      const month = transaction.month;
      const amount = transaction.amount;

      // Cập nhật số tiền đã chi trong budgets
      let currentBudget = budgets.find(b => b.month === month);
      if (currentBudget) {
        currentBudget.spent -= amount;
        localStorage.setItem("budgets", JSON.stringify(budgets));
      }

      // Cập nhật tổng chi tiêu trong monthlyCategories
      let monthData = monthlyCategories.find(m => m.month === month);
      if (monthData) {
        monthData.amount -= amount;
        localStorage.setItem("monthlyCategories", JSON.stringify(monthlyCategories));
      }

      // Xóa giao dịch
      transactions = transactions.filter(t => t.id !== transactionToDelete);
      localStorage.setItem("transactions", JSON.stringify(transactions));

      // Cập nhật giao diện
      renderTransactionList();
      renderBalance();
      renderCategoryList();
      renderCategoryOptions();
    }
    closeDeleteTransactionModal();
  }
}


document.getElementById("searchInput").addEventListener("input", function () {
  const searchQuery = this.value.trim();  
  renderTransactionList(searchQuery);  
});

document.getElementById("sortAscBtn").addEventListener("click", function () {
  sortTransactions("asc"); 
});
document.getElementById("sortDescBtn").addEventListener("click", function () {
  sortTransactions("desc"); 
});
// Hàm sắp xếp giao dịch
function sortTransactions(received) {
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  if (received === 'asc') {
    transactions.sort((a, b) => a.amount - b.amount);
  } else if (received === 'desc') {
    transactions.sort((a, b) => b.amount- a.amount); 
  }
  localStorage.setItem("transactions", JSON.stringify(transactions));
  renderTransactionList();
}
const transactionsPerPage = 2;  // Số giao dịch mỗi trang
let currentPage = 1;  // Trang hiện tại

// Hàm hiển thị danh sách giao dịch với phân trang
function renderTransactionList(searchQuery = "") {
  const transactionList = document.getElementById("transactionList");
  transactionList.innerHTML = ""; // Xóa toàn bộ giao dịch cũ

  const selectedMonth = document.getElementById("monthInput").value; // Lấy giá trị tháng hiện tại
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  // Lọc các giao dịch theo tháng và tìm kiếm
  const filteredTrans = transactions.filter(
    (transaction) =>
      transaction.month === selectedMonth &&
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Tính toán số trang
  const totalPages = Math.ceil(filteredTrans.length / transactionsPerPage);
  const startIndex = (currentPage - 1) * transactionsPerPage;
  const endIndex = startIndex + transactionsPerPage;
  const paginatedTrans = filteredTrans.slice(startIndex, endIndex);

  // Hiển thị các giao dịch trong trang hiện tại
// Trong hàm renderTransactionList:
paginatedTrans.forEach((transaction) => {
  transactionList.innerHTML += `
    <li>
      <span>${transaction.description} - ${transaction.amount.toLocaleString()} VND - Danh mục: ${transaction.categoryId}</span>
     <button id="deleteTrans" onclick="openDeleteTransactionModal(${transaction.id})">Xóa</button>
    </li>
  `;
});
  // Hiển thị số trang hiện tại
  document.getElementById("currentPage").textContent = currentPage;

  // Cập nhật trạng thái các nút phân trang
  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = currentPage === totalPages;
}

document.getElementById("prevPage").addEventListener("click", function () {
  if (currentPage > 1) {
    currentPage--; // Giảm số trang
    renderTransactionList();
  }
});

document.getElementById("nextPage").addEventListener("click", function () {
  const selectedMonth = document.getElementById("monthInput").value;
  const searchQuery = document.getElementById("searchInput").value.trim();

  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  // Lọc các giao dịch theo tháng và tìm kiếm
  const filteredTrans = transactions.filter(
    (transaction) =>
      transaction.month === selectedMonth &&
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTrans.length / transactionsPerPage);
  if (currentPage < totalPages) {
    currentPage++; // Tăng số trang
    renderTransactionList(searchQuery);  
 
  }
});

document.getElementById("monthInput").addEventListener("change", function () {
  currentPage = 1;
  renderTransactionList();
});

document.getElementById("searchInput").addEventListener("input", function () {
  const searchQuery = this.value.trim();  
  renderTransactionList(searchQuery);  
});
