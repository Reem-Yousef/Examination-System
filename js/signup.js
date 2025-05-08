

// const form = document.getElementById("form");

// const fields = [
//     {
//         id: "username",
//         validation: value => value === ""
//             ? "Name is required."
//             : /^[a-zA-Z]{2,}$/.test(value)
//                 ? ''
//                 : "Name must contain only letters and be at least 2 characters long.",
//         errorId: "error-username"
//     },
//     {
//         id: "email",
//         validation: value => value === ""
//             ? "Email is required."
//             : /^(?:[a-zA-Z0-9._-]+)@(gmail\.com|yahoo\.com)$/.test(value)
//                 ? ''
//                 : "Please enter a valid email (e.g., user@gmail.com or user@yahoo.com).",
//         errorId: "error-email"
//     },
//     {
//         id: "password",
//         validation: value => value === ""
//             ? "Password is required." : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z\d!@#$%^&*(),.?":{}|<>]{8,}$/.test(value)
//                 ? '' : "Password must be at least 8 characters long, contain both uppercase and lowercase letters, a number, and a special character",
//         errorId: "error-password"
//     },
//     {
//         id: "confpass",
//         validation: value => value === ""
//             ? "Confirm password is required." : value === document.getElementById("password").value
//                 ? '' : "Please enter the same password to confirm",
//         errorId: "error-confpass"
//     }
// ];



// const togglePassword = (inputId, iconId) => {
//     const input = document.getElementById(inputId);
//     const icon = document.getElementById(iconId);

//     icon.addEventListener('click', () => {
//         const isHidden = input.type === 'password';
//         input.type = isHidden ? 'text' : 'password';
//         icon.src = isHidden ? '../cartoon-eyes.png' : '../two-eyelashes.png';
//     });
// };
// document.addEventListener('DOMContentLoaded', () => {
//     togglePassword('password', 'toggle-password');
//     togglePassword('confpass', 'toggle-confpass');
// });



// form.addEventListener("submit", function (e) {
//     e.preventDefault();
//     let formData = {};
//     let isValid = true;


//     fields.forEach(field => {
//         const inputElement = document.getElementById(field.id);
//         const errorMessage = field.validation(inputElement.value);

//         if (errorMessage) {
//             setError(errorMessage, field.errorId);
//             isValid = false;
//         } else {
//             setSuccess(field.errorId);
//             formData[field.id] = inputElement.value;
//         }
//     });



//     if (isValid) {
//         localStorage.setItem('formData', JSON.stringify(formData));
//         form.reset();
//         fields.forEach(field => setSuccess(field.errorId));
//     }
// });


// fields.forEach(field => {
//     const inputElement = document.getElementById(field.id);
//     inputElement.addEventListener('input', () => {
//         setSuccess(field.errorId);
//     });
// });


// function setError(message, errorId) {
//     const errorElement = document.getElementById(errorId);
//     errorElement.textContent = message;
//     errorElement.style.display = "block";
// }


// function setSuccess(errorId) {
//     const errorElement = document.getElementById(errorId);
//     errorElement.textContent = "";
//     errorElement.style.display = "none";
// }



////////////////////////////////////////////////////////////////////////////////////


// const form = document.getElementById("form");

// const fields = [
//     {
//         id: "username",
//         validation: value =>
//             value === ""
//                 ? "Name is required."
//                 : /^[a-zA-Z]{2,}$/.test(value)
//                     ? ""
//                     : "Name must contain only letters and be at least 2 characters long.",
//         errorId: "error-username"
//     },
//     {
//         id: "email",
//         validation: value =>
//             value === ""
//                 ? "Email is required."
//                 : /^(?:[a-zA-Z0-9._-]+)@(gmail\.com|yahoo\.com)$/.test(value)
//                     ? ""
//                     : "Please enter a valid email (e.g., user@gmail.com or user@yahoo.com).",
//         errorId: "error-email"
//     },
//     {
//         id: "password",
//         validation: value =>
//             value === ""
//                 ? "Password is required."
//                 : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?\":{}|<>])[a-zA-Z\d!@#$%^&*(),.?\":{}|<>]{8,}$/.test(value)
//                     ? ""
//                     : "Password must be at least 8 characters long, contain uppercase, lowercase, a number, and a special character.",
//         errorId: "error-password"
//     },
//     {
//         id: "confpass",
//         validation: value =>
//             value === ""
//                 ? "Confirm password is required."
//                 : value === document.getElementById("password").value
//                     ? ""
//                     : "Please enter the same password to confirm.",
//         errorId: "error-confpass"
//     }
// ];

// function setError(message, errorId) {
//     const errorEl = document.getElementById(errorId);
//     errorEl.textContent = message;
//     errorEl.style.display = "block";
// }

// function setSuccess(errorId) {
//     const errorEl = document.getElementById(errorId);
//     errorEl.textContent = "";
//     errorEl.style.display = "none";
// }

// // real-time validation on input
// fields.forEach(field => {
//     const input = document.getElementById(field.id);
//     input.addEventListener("input", () => {
//         const msg = field.validation(input.value);
//         if (msg) setError(msg, field.errorId);
//         else setSuccess(field.errorId);
//     });
// });

// // final validation on submit
// form.addEventListener("submit", function (e) {
//     e.preventDefault();
//     let isValid = true;
//     let formData = {};

//     fields.forEach(field => {
//         const input = document.getElementById(field.id);
//         const msg = field.validation(input.value);
//         if (msg) {
//             setError(msg, field.errorId);
//             isValid = false;
//         } else {
//             setSuccess(field.errorId);
//             formData[field.id] = input.value;
//         }
//     });
//     if (isValid) {
//         console.log("Form data:", formData);
//         form.reset();
//         fields.forEach(f => setSuccess(f.errorId));
//     }
// });

/////////////////////////////////////////////////////////////////////////////////////

// const form = document.getElementById("form");

// const fields = [
//     {
//         id: "username",
//         validation: value => value === ""
//             ? "Name is required."
//             : /^[a-zA-Z]{2,}$/.test(value)
//                 ? ''
//                 : "Name must contain only letters and be at least 2 characters long.",
//         errorId: "error-username"
//     },
//     {
//         id: "email",
//         validation: value => value === ""
//             ? "Email is required."
//             : /^(?:[a-zA-Z0-9._-]+)@(gmail\.com|yahoo\.com)$/.test(value)
//                 ? ''
//                 : "Please enter a valid email (e.g., user@gmail.com or user@yahoo.com).",
//         errorId: "error-email"
//     },
//     {
//         id: "password",
//         validation: value => value === ""
//             ? "Password is required." : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z\d!@#$%^&*(),.?":{}|<>]{8,}$/.test(value)
//                 ? '' : "Password must be at least 8 characters long, contain both uppercase and lowercase letters, a number, and a special character",
//         errorId: "error-password"
//     },
//     {
//         id: "confpass",
//         validation: value => value === ""
//             ? "Confirm password is required." : value === document.getElementById("password").value
//                 ? '' : "Please enter the same password to confirm",
//         errorId: "error-confpass"
//     }
// ];

// const togglePassword = (inputId, iconId) => {
//     const input = document.getElementById(inputId);
//     const icon = document.getElementById(iconId);

//     icon.addEventListener('click', () => {
//         const isHidden = input.type === 'password';
//         input.type = isHidden ? 'text' : 'password';
//         icon.src = isHidden ? '../cartoon-eyes.png' : '../two-eyelashes.png';
//     });
// };

// document.addEventListener('DOMContentLoaded', () => {
//     togglePassword('password', 'toggle-password');
//     togglePassword('confpass', 'toggle-confpass');

//     // إضافة التحقق أثناء الكتابة لكل حقل
//     fields.forEach(field => {
//         const inputElement = document.getElementById(field.id);

//         inputElement.addEventListener('input', () => {
//             const errorMessage = field.validation(inputElement.value);
//             if (errorMessage) {
//                 setError(errorMessage, field.errorId);
//             } else {
//                 setSuccess(field.errorId);
//             }

//             // تحقق خاص لحقل تأكيد كلمة المرور عند تغيير أي من الحقلين
//             if (field.id === 'password') {
//                 const confpassElement = document.getElementById('confpass');
//                 const confpassError = fields.find(f => f.id === 'confpass').validation(confpassElement.value);
//                 if (confpassError) {
//                     setError(confpassError, 'error-confpass');
//                 } else {
//                     setSuccess('error-confpass');
//                 }
//             }
//         });
//     });
// });

// form.addEventListener("submit", function (e) {
//     e.preventDefault();
//     let formData = {};
//     let isValid = true;

//     fields.forEach(field => {
//         const inputElement = document.getElementById(field.id);
//         const errorMessage = field.validation(inputElement.value);

//         if (errorMessage) {
//             setError(errorMessage, field.errorId);
//             isValid = false;
//         } else {
//             setSuccess(field.errorId);
//             formData[field.id] = inputElement.value;
//         }
//     });

//     if (isValid) {
//         localStorage.setItem('formData', JSON.stringify(formData));
//         form.reset();
//         fields.forEach(field => setSuccess(field.errorId));
//     }
// });

// function setError(message, errorId) {
//     const errorElement = document.getElementById(errorId);
//     errorElement.textContent = message;
//     errorElement.style.display = "block";
// }

// function setSuccess(errorId) {
//     const errorElement = document.getElementById(errorId);
//     errorElement.textContent = "";
//     errorElement.style.display = "none";
// }

// // /////////////////////////////////////////////////////////////////////////

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
        } else if (!/^[a-zA-Z]{2,}$/.test(value)) {
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

            alert('Form submitted successfully!');
        }
    });
});