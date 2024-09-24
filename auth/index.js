
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (!username || !password) {
        document.getElementById('error-message').textContent = "Please enter both username and password";
        return;
    }

    const loginData = {
        username: username,
        password: password
    };

    fetch('https://identity-service-qboe.onrender.com/identity/auth/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.result && data.result.token) {
            // Lưu token vào localStorage
            localStorage.setItem('token', data.result.token);
            alert("Login successful!");
            // Chuyển hướng và truyền username qua URL
            window.location.href = "../index.html";
        } else {
            // Hiển thị thông báo lỗi từ phản hồi
            document.getElementById('error-message').textContent = data.message || "Login failed";
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('error-message').textContent = "An error occurred. Please try again later.";
    });
}
function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const fristname = document.getElementById('fristname').value;
    const lastname = document.getElementById('lastname').value;
    const dob = document.getElementById('dob').value;
    
    if (!username || !password || !fristname || !lastname || !dob) {
        alert("Please enter complete information");
        return;
    }

    const registerData = {
        username: username,
        password: password,
        fristname: fristname,
        lastname: lastname,
        dob: dob
    };

    fetch('https://identity-service-qboe.onrender.com/identity/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerData)
    })
    .then(response => {
        if (response.ok) {
            // Đăng ký thành công, gửi yêu cầu đăng nhập ngay sau đó
            return response.json(); // Hoặc đơn giản trả về thành công mà không cần dữ liệu
        } else {
            return response.text().then(text => {throw new Error(text)});
        }
    })
    .then(() => {
        // Đăng nhập sau khi đăng ký thành công
        return login(); // Lưu ý: hàm login cần thông tin username và password, có thể cần điều chỉnh
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('message').textContent = "Registration failed: " + error.message;
    });
}
