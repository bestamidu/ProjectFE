function openModal() {
    document.getElementById("accountModal").style.display = "block";
  }
  function closeEditModal() {
    document.getElementById("editCategoryModal").style.display = "none";
  }
  
  function closeModal() {
    document.getElementById("accountModal").style.display = "none";
  }
  // Kiểm tra nếu chưa đăng nhập thì tự động chuyển về login
const accounts = JSON.parse(localStorage.getItem("user")) || [];
if (accounts.length === 0) {
    window.location.href = "/pages/login.html"; // chỉnh đường dẫn cho đúng nếu khác
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
      budgets.push({ month: month, budget: budgetValue, spent: 1000 });
    }
  
    localStorage.setItem("budgets", JSON.stringify(budgets));
    renderBalance();
   
})

function  renderBalance(){
  const month = document.getElementById("monthInput").value;
   const balanceDisplay = document.getElementById("vnd")
   const currentBudget = budgets.find(b => b.month === month); //này là khi àm kh
   if (!currentBudget) { 
     balanceDisplay.textContent = "0 VND";
     return;
   }
   const remaining = currentBudget.budget - (currentBudget.spent || 0);
   balanceDisplay.textContent = `${remaining.toLocaleString()} VND`;

 

}


document.getElementById("monthInput").addEventListener("change", function() {
  clearError();
  renderBalance();
  const currentBudget = budgets.find(b => b.month === month);
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
  if (!monthData) return;

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

    // Lưu thông tin tạm
    editMonth = month;
    editCategoryId = categoryId;

    // Hiển thị thông tin cũ lên form
    document.getElementById("editCategoryName").value = category.name;
    document.getElementById("editCategoryLimit").value = category.budget;

    // Mở modal
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
  closeEditModal();
 
}
function deleteCategory(month, categoryId) {
  const monthData = monthlyCategories.find(m => m.month === month);
  if (!monthData) return;

  if (confirm("Bạn có chắc chắn muốn xóa danh mục này không?")) {
      monthData.categories = monthData.categories.filter(c => c.id !== categoryId);
      localStorage.setItem("monthlyCategories", JSON.stringify(monthlyCategories));
      renderCategoryList();
  }
}
function clearCategoryInput() {
  document.getElementById("categoryName").value = "";
  document.getElementById("categoryLimit").value = "";
}
document.getElementById("monthInput").addEventListener("change", function() {
  renderCategoryList();
});

renderCategoryList();
