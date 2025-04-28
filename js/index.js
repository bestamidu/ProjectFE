function openModal() {
    document.getElementById("accountModal").style.display = "block";
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
function showError(message) {
  document.getElementById("error-message").textContent = message;
}

// Hàm xóa lỗi
function clearError() {
  document.getElementById("error-message").textContent = "";
}
document.querySelector(".btnSave").addEventListener("click", function(){
  const month = document.getElementById("monthInput").value;
  const budgetInput = document.getElementById("budgetInput").value.trim();
  // const balanceDisplay = document.getElementById("vnd");
  clearError(); // Xóa lỗi cũ trước
     if (!month) {
     showError("Please You Must choose Month which you want!!!")
     return;
     }
     if (!budgetInput) {
      showError("Vui lòng nhập ngân sách tháng!");
      return;
    }
    const budgetValue = parseFloat(budgetInput.replace(/\./g, ''));

    if (isNaN(budgetValue)) {
      showError("Ngân sách phải là số hợp lệ!");
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
