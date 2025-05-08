

// document.addEventListener('DOMContentLoaded', function () {
//     // تعريف العناصر
//     const form = document.getElementById('form');
//     const usernameInput = document.getElementById('username');
//     const emailInput = document.getElementById('email');
//     const passwordInput = document.getElementById('password');
//     const confpassInput = document.getElementById('confpass');

//     // تعريف دوال عرض الخطأ
//     function showError(input, message) {
//         const errorElement = document.getElementById(`error-${input.id}`);
//         if (errorElement) {
//             errorElement.textContent = message;
//             errorElement.style.display = 'block';
//         }
//     }

//     function clearError(input) {
//         const errorElement = document.getElementById(`error-${input.id}`);
//         if (errorElement) {
//             errorElement.textContent = '';
//             errorElement.style.display = 'none';
//         }
//     }

//     // دوال التحقق من الصحة
//     function validateUsername() {
//         const value = usernameInput.value;
//         if (value === '') {
//             showError(usernameInput, 'Name is required');
//             return false;
//         } else if (!/^[a-zA-Z]{3,}$/.test(value)) {
//             showError(usernameInput, 'only letters and be at least 2 characters long');
//             return false;
//         } else {
//             clearError(usernameInput);
//             return true;
//         }
//     }

//     function validateEmail() {
//         const value = emailInput.value;
//         if (value === '') {
//             showError(emailInput, 'Email is required');
//             return false;
//         } else if (!/^[\w.-]+@(gmail|yahoo)\.com$/.test(value)) {
//             showError(emailInput, 'Enter valid email (user@gmail/yahoo.com)');
//             return false;
//         } else {
//             clearError(emailInput);
//             return true;
//         }
//     }

//     function validatePassword() {
//         const value = passwordInput.value;
//         if (value === '') {
//             showError(passwordInput, 'Password is required');
//             return false;
//         } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value)) {
//             showError(passwordInput, 'Password needs 8+ chars with upper/lowercase, number & special char');
//             return false;
//         } else {
//             clearError(passwordInput);
//             return true;
//         }
//     }

//     function validateConfpass() {
//         const value = confpassInput.value;
//         if (value === '') {
//             showError(confpassInput, 'Confirm password is required');
//             return false;
//         } else if (value !== passwordInput.value) {
//             showError(confpassInput, "Passwords don't match");
//             return false;
//         } else {
//             clearError(confpassInput);
//             return true;
//         }
//     }

//     // إضافة مستمعات الأحداث للتحقق أثناء الكتابة
//     usernameInput.addEventListener('input', function () {
//         validateUsername();
//         // عند تغيير الاسم، تحقق من تأكيد كلمة المرور إذا كانت مدخلة
//         if (confpassInput.value) validateConfpass();
//     });

//     emailInput.addEventListener('input', validateEmail);

//     passwordInput.addEventListener('input', function () {
//         validatePassword();
//         // عند تغيير كلمة المرور، تحقق من تأكيدها إذا كانت مدخلة
//         if (confpassInput.value) validateConfpass();
//     });

//     confpassInput.addEventListener('input', validateConfpass);

//     // إضافة مستمعات الأحداث لتبديل عرض كلمة المرور
//     document.getElementById('toggle-password')?.addEventListener('click', function () {
//         togglePasswordVisibility(passwordInput, this);
//     });

//     document.getElementById('toggle-confpass')?.addEventListener('click', function () {
//         togglePasswordVisibility(confpassInput, this);
//     });

//     function togglePasswordVisibility(input, icon) {
//         input.type = input.type === 'password' ? 'text' : 'password';
//         icon.src = input.type === 'password' ? '../two-eyelashes.png' : '../cartoon-eyes.png';
//     }

//     // التحقق عند الإرسال
//     form.addEventListener('submit', function (e) {
//         e.preventDefault();

//         const isUsernameValid = validateUsername();
//         const isEmailValid = validateEmail();
//         const isPasswordValid = validatePassword();
//         const isConfpassValid = validateConfpass();

//         if (isUsernameValid && isEmailValid && isPasswordValid && isConfpassValid) {
//             const formData = {
//                 username: usernameInput.value,
//                 email: emailInput.value,
//                 password: passwordInput.value
//             };

//             localStorage.setItem('formData', JSON.stringify(formData));
//             form.reset();

//             // إخفاء جميع رسائل الخطأ بعد الإرسال الناجح
//             clearError(usernameInput);
//             clearError(emailInput);
//             clearError(passwordInput);
//             clearError(confpassInput);

//             window.location.href = 'login.html';
//         }
//     });
// });


document.addEventListener('DOMContentLoaded', function () {
    // تعريف العناصر
    const form = document.getElementById('form');
    const inputs = {
        username: document.getElementById('username'),
        email: document.getElementById('email'),
        password: document.getElementById('password'),
        confpass: document.getElementById('confpass')
    };

    // تعريف محددات الصحة (Validators)
    const validators = {
        username: {
            validate: (value) => {
                if (!value) return 'Name is required';
                if (!/^[a-zA-Z]{3,}$/.test(value)) return 'Only letters (min 3 characters)';
                return '';
            },
            errorElement: document.getElementById('error-username')
        },
        email: {
            validate: (value) => {
                if (!value) return 'Email is required';
                if (!/^[\w.-]+@(gmail|yahoo)\.com$/.test(value)) return 'Enter valid email (user@gmail/yahoo.com)';
                return '';
            },
            errorElement: document.getElementById('error-email')
        },
        password: {
            validate: (value) => {
                if (!value) return 'Password is required';
                if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value)) {
                    return 'Password must contain: 8+ chars, uppercase, lowercase, number & special char';
                }
                return '';
            },
            errorElement: document.getElementById('error-password')
        },
        confpass: {
            validate: (value, passwordValue) => {
                if (!value) return 'Please confirm your password';
                if (value !== passwordValue) return "Passwords don't match";
                return '';
            },
            errorElement: document.getElementById('error-confpass')
        }
    };

    // دوال التحكم في الأخطاء
    function showError(inputName, message) {
        const { errorElement } = validators[inputName];
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        inputs[inputName].classList.add('invalid');
    }

    function clearError(inputName) {
        const { errorElement } = validators[inputName];
        errorElement.textContent = '';
        errorElement.style.display = 'none';
        inputs[inputName].classList.remove('invalid');
    }

    // التحقق أثناء الكتابة مع Debounce
    function setupRealTimeValidation() {
        Object.keys(inputs).forEach(inputName => {
            inputs[inputName].addEventListener('input', function() {
                // Debounce للتحقق بعد 500ms من توقف الكتابة
                clearTimeout(this.debounceTimer);
                this.debounceTimer = setTimeout(() => {
                    validateInput(inputName);
                }, 500);
            });

            // التحقق عند فقدان التركيز (Blur)
            inputs[inputName].addEventListener('blur', function() {
                validateInput(inputName);
            });
        });
    }

    // دالة التحقق من حقل معين
    function validateInput(inputName) {
        const value = inputs[inputName].value;
        let error = '';
        
        if (inputName === 'confpass') {
            error = validators.confpass.validate(value, inputs.password.value);
        } else {
            error = validators[inputName].validate(value);
        }

        if (error) {
            showError(inputName, error);
            return false;
        } else {
            clearError(inputName);
            return true;
        }
    }

    // تبديل عرض كلمة المرور
    function setupPasswordToggles() {
        document.getElementById('toggle-password')?.addEventListener('click', function() {
            togglePasswordVisibility(inputs.password, this);
        });

        document.getElementById('toggle-confpass')?.addEventListener('click', function() {
            togglePasswordVisibility(inputs.confpass, this);
        });
    }

    function togglePasswordVisibility(input, icon) {
        input.type = input.type === 'password' ? 'text' : 'password';
        icon.src = input.type === 'password' ? '../two-eyelashes.png' : '../cartoon-eyes.png';
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isFormValid = true;
        const results = {};
        
        Object.keys(inputs).forEach(inputName => {
            const isValid = validateInput(inputName);
            if (!isValid) isFormValid = false;
            results[inputName] = isValid;
        });

        if (isFormValid) {
            const formData = {
                username: inputs.username.value,
                email: inputs.email.value,
                password: btoa(inputs.password.value) // التشفير هنا
            };

            localStorage.setItem('formData', JSON.stringify(formData));
            
            form.classList.add('submitting');
            setTimeout(() => {
                form.reset();
                form.classList.remove('submitting');
                window.location.href = 'login.html';
            }, 1000);
        } else {
            const firstInvalid = Object.keys(results).find(key => !results[key]);
            if (firstInvalid) inputs[firstInvalid].focus();
        }
    });


    // تهيئة الصفحة
    setupRealTimeValidation();
    setupPasswordToggles();

//     const formData = {
//     username: inputs.username.value,
//     email: inputs.email.value,
//     password: btoa(inputs.password.value) // تشفير الباسوورد
// };

// localStorage.setItem('formData', JSON.stringify(formData));

});

