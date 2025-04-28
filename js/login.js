document.getElementById("loginBtn").addEventListener("click", function(){
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    document.getElementById("loginEmailError").textContent ="";
    document.getElementById("loginPasswordError").textContent ="";
    let isValid = true;
    if (!email) {
        document.getElementById("loginEmailError").textContent = "Tên đăng nhập không được để trống";
        isValid = false;
      }
    
      if (!password) {
        document.getElementById("loginPasswordError").textContent = "Mật khẩu không được để trống";
        isValid = false;
      }
    
      if (!isValid) return;
    
      const accounts = JSON.parse(localStorage.getItem("user")) || [];
      const checkAccount = accounts.find(acc => acc.email === email);
      if (!checkAccount) {
        document.getElementById("loginEmailError").textContent = "Tài khoản không tồn tại!";
        return;
      }
      if (checkAccount.password !== password) {
        document.getElementById("loginPasswordError").textContent = "Sai mật khẩu!";
        return;
      }
      window.location.href = "../index.html";
})