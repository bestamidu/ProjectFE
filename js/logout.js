  const logoutLink = document.getElementById("logoutLi");
  const modal = document.getElementById("logoutModal");
  const overlay = document.querySelector("#logoutModal .modal-overlay");
  const cancelBtn = document.getElementById("cancelLogout");
  const confirmBtn = document.getElementById("confirmLogout");

  logoutLink.addEventListener("click", function (e) {
    e.preventDefault();
    openModalLogOut();
    // closeModal();
  });
  
  overlay.addEventListener("click", closeModal );
  cancelBtn.addEventListener("click", closeModal);

  function openModalLogOut (){
    modal.style.display = "block";
  }
  function closeModal1 (){
    modal.style.display = "none";
  }
  // confirmBtn.addEventListener("click", function () {
  //   // localStorage.removeItem("user");
  //   window.location.href = "/pages/login.html";
  // });
  confirmBtn.addEventListener("click", function () {
    localStorage.removeItem("currentUser"); // Xóa user đang đăng nhập
    window.location.href = "/pages/login.html";
});

// Logout Modal Functions
document.getElementById("logoutLi").addEventListener("click", function () {
  document.getElementById("logoutModal").style.display = "block";
});

document.getElementById("confirmLogout").addEventListener("click", function () {
  localStorage.removeItem("currentUser");
  window.location.href = "/pages/login.html";
});

document.getElementById("cancelLogout").addEventListener("click", function () {
  document.getElementById("logoutModal").style.display = "none";
});