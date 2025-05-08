// document.addEventListener('DOMContentLoaded', function () {
//     const form = document.getElementById("form");
//     const emailInput = document.getElementById("email");
//     const passwordInput = document.getElementById("password");
//     const togglePasswordBtn = document.getElementById("toggle-password");

//     // 1. دوال التحقق من الصحة
//     function validateEmail() {
//         const value = emailInput.value.trim();
//         if (value === "") {
//             return "Email is required";
//         } else if (!/^[\w.-]+@(gmail|yahoo)\.com$/.test(value)) {
//             return "Enter valid email (user@gmail/yahoo.com)";
//         }
//         return "";
//     }

//     function validatePassword() {
//         const value = passwordInput.value;
//         if (value === "") {
//             return "Password is required";
//         } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value)) {
//             return "Password must contain 8+ chars, uppercase, lowercase, number & special char";
//         }
//         return "";
//     }

//     // 2. دوال عرض/إخفاء الأخطاء
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

//     // 3. التحقق أثناء الكتابة (تم التعديل هنا)
//     emailInput.addEventListener('input', () => {
//         const error = validateEmail();
//         if (error) {
//             showError(emailInput, error);
//         } else {
//             clearError(emailInput);
//         }
//     });

//     passwordInput.addEventListener('input', () => {
//         const error = validatePassword();
//         if (error) {
//             showError(passwordInput, error);
//         } else {
//             clearError(passwordInput);
//         }
//     });

//     // 4. التحقق من بيانات المستخدم في localStorage
//     function checkUserCredentials(email, password) {
//         const savedData = localStorage.getItem('formData');
//         if (!savedData) {
//             return { isValid: false, message: "Email not registered. Please sign up first.", field: "email" };
//         }

//         const userData = JSON.parse(savedData);
//         if (email !== userData.email) {
//             return { isValid: false, message: "Email not found. Please check your email.", field: "email" };
//         }

//         if (password !== userData.password) {
//             return { isValid: false, message: "Incorrect password. Please try again.", field: "password" };
//         }

//         return { isValid: true };
//     }

//     // 5. التحقق النهائي عند الإرسال
//     form.addEventListener('submit', function (e) {
//         e.preventDefault();
//         let isFormValid = true;

//         // تحقق من صحة الإيميل
//         const emailError = validateEmail();
//         if (emailError) {
//             showError(emailInput, emailError);
//             isFormValid = false;
//         }

//         // تحقق من صحة كلمة المرور
//         const passwordError = validatePassword();
//         if (passwordError) {
//             showError(passwordInput, passwordError);
//             isFormValid = false;
//         }

//         // إذا كانت البيانات صحيحة، تحقق من تطابقها مع المسجلة
//         if (isFormValid) {
//             const checkResult = checkUserCredentials(emailInput.value.trim(), passwordInput.value);
//             if (!checkResult.isValid) {
//                 showError(document.getElementById(checkResult.field), checkResult.message);
//                 isFormValid = false;
//             }
//         }

//         // إذا كان كل شيء صحيحاً
//         if (isFormValid) {

//             window.location.href = "launch.html";
//         }
//     });
// });

// login.js
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById("form");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const togglePasswordBtn = document.getElementById("toggle-password");
    const rememberCheckbox = document.getElementById("remember-me");

    // 1. تحميل بيانات "تذكرني" إذا وجدت وكانت مفعلة
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
        const { username, password, remember } = JSON.parse(rememberedUser);
        if (remember) {
            usernameInput.value = username;
            passwordInput.value = atob(password); // فك تشفير كلمة المرور
            rememberCheckbox.checked = true;
        } else {
            localStorage.removeItem('rememberedUser');
        }
    }

    // 2. إعداد التعبئة التلقائية عند الحاجة
    function setupSmartAutofill() {
        const savedData = localStorage.getItem('formData');
        if (!savedData) return;

        const { username, password } = JSON.parse(savedData);
        
        // عند الكتابة في حقل اسم المستخدم
        usernameInput.addEventListener('input', function() {
            if (this.value === username) {
                passwordInput.value = atob(password); // عرض كلمة المرور مؤقتًا
                setTimeout(() => {
                    if (passwordInput.value === atob(password)) {
                        passwordInput.value = ''; // مسح كلمة المرور بعد 3 ثواني
                    }
                }, 3000);
            }
        });
    }

    // 3. دوال التحقق من الصحة
    function validateUsername() {
        const value = usernameInput.value.trim();
        if (!value) return "Username is required";
        if (!/^[a-zA-Z]{3,}$/.test(value)) return "Username must be at least 3 letters";
        return "";
    }

    function validatePassword() {
        const value = passwordInput.value;
        if (!value) return "Password is required";
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value)) {
            return "Password must contain: 8+ chars, uppercase, lowercase, number & special char";
        }
        return "";
    }

    // 4. عرض وإخفاء الأخطاء
    function showError(input, message) {
        const errorElement = document.getElementById(`error-${input.id}`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            input.classList.add('invalid');
        }
    }

    function clearError(input) {
        const errorElement = document.getElementById(`error-${input.id}`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
            input.classList.remove('invalid');
        }
    }

    // 5. التحقق من بيانات المستخدم
    function checkUserCredentials(username, password) {
        const savedData = localStorage.getItem('formData');
        if (!savedData) return { isValid: false, message: "Username not registered", field: "username" };

        const { username: savedUsername, password: savedPassword } = JSON.parse(savedData);
        const decryptedPassword = atob(savedPassword);

        if (username !== savedUsername) {
            return { isValid: false, message: "Username not found", field: "username" };
        }

        if (password !== decryptedPassword) {
            return { isValid: false, message: "Incorrect password", field: "password" };
        }

        return { isValid: true };
    }

    // 6. التحقق أثناء الكتابة
    usernameInput.addEventListener('input', () => {
        clearError(usernameInput);
        const error = validateUsername();
        if (error) showError(usernameInput, error);
    });

    passwordInput.addEventListener('input', () => {
        clearError(passwordInput);
        const error = validatePassword();
        if (error) showError(passwordInput, error);
    });

    // 7. زر إظهار/إخفاء كلمة المرور
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function() {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            this.textContent = type === 'password' ? 'Show' : 'Hide';
        });
    }

    // 8. التحقق عند الإرسال
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        let isFormValid = true;

        // التحقق من صحة اسم المستخدم
        const usernameError = validateUsername();
        if (usernameError) {
            showError(usernameInput, usernameError);
            isFormValid = false;
        }

        // التحقق من صحة كلمة المرور
        const passwordError = validatePassword();
        if (passwordError) {
            showError(passwordInput, passwordError);
            isFormValid = false;
        }

        if (isFormValid) {
            const username = usernameInput.value.trim();
            const password = passwordInput.value;
            const remember = rememberCheckbox.checked;
            
            const { isValid, message, field } = checkUserCredentials(username, password);
            if (!isValid) {
                showError(document.getElementById(field), message);
                return;
            }

            // حفظ بيانات "تذكرني" إذا تم اختيارها
            if (remember) {
                localStorage.setItem('rememberedUser', JSON.stringify({
                    username,
                    password: btoa(password), // تشفير كلمة المرور
                    remember: true
                }));
            } else {
                localStorage.removeItem('rememberedUser');
            }

            window.location.href = "launch.html";
        }
    });

    // 9. تهيئة الصفحة
    setupSmartAutofill();
});