

document.addEventListener('DOMContentLoaded', function () {
    // تعريف العناصر
    const form = document.getElementById('form');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confpassInput = document.getElementById('confpass');

    // تعريف دوال عرض الخطأ
    function showError(input, message) {
        const errorElement = document.getElementById(`error-${input.id}`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    function clearError(input) {
        const errorElement = document.getElementById(`error-${input.id}`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    // دوال التحقق من الصحة
    function validateUsername() {
        const value = usernameInput.value;
        if (value === '') {
            showError(usernameInput, 'Name is required');
            return false;
        } else if (!/^[a-zA-Z]{3,}$/.test(value)) {
            showError(usernameInput, 'only letters and be at least 2 characters long');
            return false;
        } else {
            clearError(usernameInput);
            return true;
        }
    }

    function validateEmail() {
        const value = emailInput.value;
        if (value === '') {
            showError(emailInput, 'Email is required');
            return false;
        } else if (!/^[\w.-]+@(gmail|yahoo)\.com$/.test(value)) {
            showError(emailInput, 'Enter valid email (user@gmail/yahoo.com)');
            return false;
        } else {
            clearError(emailInput);
            return true;
        }
    }

    function validatePassword() {
        const value = passwordInput.value;
        if (value === '') {
            showError(passwordInput, 'Password is required');
            return false;
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value)) {
            showError(passwordInput, 'Password needs 8+ chars with upper/lowercase, number & special char');
            return false;
        } else {
            clearError(passwordInput);
            return true;
        }
    }

    function validateConfpass() {
        const value = confpassInput.value;
        if (value === '') {
            showError(confpassInput, 'Confirm password is required');
            return false;
        } else if (value !== passwordInput.value) {
            showError(confpassInput, "Passwords don't match");
            return false;
        } else {
            clearError(confpassInput);
            return true;
        }
    }

    // إضافة مستمعات الأحداث للتحقق أثناء الكتابة
    usernameInput.addEventListener('input', function () {
        validateUsername();
        // عند تغيير الاسم، تحقق من تأكيد كلمة المرور إذا كانت مدخلة
        if (confpassInput.value) validateConfpass();
    });

    emailInput.addEventListener('input', validateEmail);

    passwordInput.addEventListener('input', function () {
        validatePassword();
        // عند تغيير كلمة المرور، تحقق من تأكيدها إذا كانت مدخلة
        if (confpassInput.value) validateConfpass();
    });

    confpassInput.addEventListener('input', validateConfpass);

    // إضافة مستمعات الأحداث لتبديل عرض كلمة المرور
    document.getElementById('toggle-password')?.addEventListener('click', function () {
        togglePasswordVisibility(passwordInput, this);
    });

    document.getElementById('toggle-confpass')?.addEventListener('click', function () {
        togglePasswordVisibility(confpassInput, this);
    });

    function togglePasswordVisibility(input, icon) {
        input.type = input.type === 'password' ? 'text' : 'password';
        icon.src = input.type === 'password' ? '../two-eyelashes.png' : '../cartoon-eyes.png';
    }

    // التحقق عند الإرسال
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const isUsernameValid = validateUsername();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfpassValid = validateConfpass();

        if (isUsernameValid && isEmailValid && isPasswordValid && isConfpassValid) {
            const formData = {
                username: usernameInput.value,
                email: emailInput.value,
                password: passwordInput.value
            };

            localStorage.setItem('formData', JSON.stringify(formData));
            form.reset();

            // إخفاء جميع رسائل الخطأ بعد الإرسال الناجح
            clearError(usernameInput);
            clearError(emailInput);
            clearError(passwordInput);
            clearError(confpassInput);

            window.location.href = 'login.html';
        }
    });
});