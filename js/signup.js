document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form');
    const inputs = {
        username: document.getElementById('username'),
        email: document.getElementById('email'),
        password: document.getElementById('password'),
        confpass: document.getElementById('confpass')
    };

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

    function setupRealTimeValidation() {
        Object.keys(inputs).forEach(inputName => {
            inputs[inputName].addEventListener('input', function() {
                clearTimeout(this.debounceTimer);
                this.debounceTimer = setTimeout(() => {
                    validateInput(inputName);
                }, 500);
            });

            inputs[inputName].addEventListener('blur', function() {
                validateInput(inputName);
            });
        });
    }

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
                password: btoa(inputs.password.value) 
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


    setupRealTimeValidation();
    setupPasswordToggles();

//     const formData = {
//     username: inputs.username.value,
//     email: inputs.email.value,
//     password: btoa(inputs.password.value) // تشفير الباسوورد
// };

// localStorage.setItem('formData', JSON.stringify(formData));

});

