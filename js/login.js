document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById("form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const togglePasswordBtn = document.getElementById("toggle-password");

    // 1. دوال التحقق من الصحة
    function validateEmail() {
        const value = emailInput.value.trim();
        if (value === "") {
            return "Email is required";
        } else if (!/^[\w.-]+@(gmail|yahoo)\.com$/.test(value)) {
            return "Enter valid email (user@gmail/yahoo.com)";
        }
        return "";
    }

    function validatePassword() {
        const value = passwordInput.value;
        if (value === "") {
            return "Password is required";
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value)) {
            return "Password must contain 8+ chars, uppercase, lowercase, number & special char";
        }
        return "";
    }

    // 2. دوال عرض/إخفاء الأخطاء
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

    // 3. التحقق أثناء الكتابة (تم التعديل هنا)
    emailInput.addEventListener('input', () => {
        const error = validateEmail();
        if (error) {
            showError(emailInput, error);
        } else {
            clearError(emailInput);
        }
    });

    passwordInput.addEventListener('input', () => {
        const error = validatePassword();
        if (error) {
            showError(passwordInput, error);
        } else {
            clearError(passwordInput);
        }
    });

    // 4. التحقق من بيانات المستخدم في localStorage
    function checkUserCredentials(email, password) {
        const savedData = localStorage.getItem('formData');
        if (!savedData) {
            return { isValid: false, message: "Email not registered. Please sign up first.", field: "email" };
        }

        const userData = JSON.parse(savedData);
        if (email !== userData.email) {
            return { isValid: false, message: "Email not found. Please check your email.", field: "email" };
        }

        if (password !== userData.password) {
            return { isValid: false, message: "Incorrect password. Please try again.", field: "password" };
        }

        return { isValid: true };
    }

    // 5. التحقق النهائي عند الإرسال
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        let isFormValid = true;

        // تحقق من صحة الإيميل
        const emailError = validateEmail();
        if (emailError) {
            showError(emailInput, emailError);
            isFormValid = false;
        }

        // تحقق من صحة كلمة المرور
        const passwordError = validatePassword();
        if (passwordError) {
            showError(passwordInput, passwordError);
            isFormValid = false;
        }

        // إذا كانت البيانات صحيحة، تحقق من تطابقها مع المسجلة
        if (isFormValid) {
            const checkResult = checkUserCredentials(emailInput.value.trim(), passwordInput.value);
            if (!checkResult.isValid) {
                showError(document.getElementById(checkResult.field), checkResult.message);
                isFormValid = false;
            }
        }

        // إذا كان كل شيء صحيحاً
        if (isFormValid) {

            window.location.href = "launch.html";
        }
    });
});