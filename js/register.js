document.getElementById('registerBtn').addEventListener('click', function () {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    document.getElementById('emailError').textContent = "";
    document.getElementById('passwordError').textContent = "";
    document.getElementById('confirmError').textContent = "";
  
    let isValid = true;
  
    if (!email) {
      document.getElementById('emailError').textContent = 'Email không được để trống';
      isValid = false;
    }else if (!email.includes("@") || email.indexOf("@") === 0 || email.endsWith("@")) {
        document.getElementById('emailError').textContent = 'Email phải chứa "@" và không ở đầu/cuối';
        isValid = false;
      }
      else if (!email.includes(".")) {
        document.getElementById('emailError').textContent = 'Email phải chứa dấu chấm (.)';
        isValid = false;
      }
      
  
    if (!password) {
      document.getElementById('passwordError').textContent = 'Mật khẩu không được để trống';
      isValid = false;
    } else if (password.length < 6) {
      document.getElementById('passwordError').textContent = 'Mật khẩu tối thiểu 6 ký tự trở lên';
      isValid = false;
    }
  
    if (!confirmPassword) {
      document.getElementById('confirmError').textContent = 'Mật khẩu xác nhận không được để trống';
      isValid = false;
    } else if (password !== confirmPassword) {
      document.getElementById('confirmError').textContent = 'Mật khẩu xác nhận phải trùng khớp mật khẩu khi đăng ký';
      isValid = false;
    }

    if (!isValid) return;
  
    const accounts = JSON.parse(localStorage.getItem("user")) || [];
    const isExist = accounts.some(account => account.email === email);
    if (isExist) {
      document.getElementById('emailError').textContent = 'Email này đã được đăng ký!';
      return;
    }

    const newAccount = {
      email: email,
      password: password
    };
    accounts.push(newAccount);
    localStorage.setItem("user", JSON.stringify(accounts));
    window.location.href = "login.html";
  });
  