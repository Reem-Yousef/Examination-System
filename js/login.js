
const form = document.getElementById("form");

const fields = [
    {
        id: "email",
        validation: value => {
            if (value === "") return "Email is required.";
            if (!/^(?:[a-zA-Z0-9._-]+)@(gmail\.com|yahoo\.com)$/.test(value)) {
                return "Please enter a valid email (e.g., user@gmail.com or user@yahoo.com).";
            }
            return "";
        },
        errorId: "error-email"
    },
    {
        id: "password",
        validation: value => value === ""
            ? "Password is required." : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z\d!@#$%^&*(),.?":{}|<>]{8,}$/.test(value)
                ? '' : "Password must be at least 8 characters long, contain both uppercase and lowercase letters, a number, and a special character",
        errorId: "error-password"
    },


];


const togglePassword = (inputId, iconId) => {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);

    icon.addEventListener('click', () => {
        const isHidden = input.type === 'password';
        input.type = isHidden ? 'text' : 'password';
        icon.src = isHidden ? '../cartoon-eyes.png' : '../two-eyelashes.png';
    });
};

document.addEventListener('DOMContentLoaded', () => {
    togglePassword('password', 'toggle-password');
});


const checkUser = (email, password) => {
    const savedData = localStorage.getItem('formData');
    if (!savedData) return { errorField: "email", message: "Email not registered. Please sign up first." };

    const userData = JSON.parse(savedData);

    if (email !== userData.email) {
        return { errorField: "email", message: "Email not found. Please check your email." };
    }

    if (password !== userData.password) {
        return { errorField: "password", message: "Incorrect password. Please try again." };
    }

    return { success: true };
};

form.addEventListener("submit", function (e) {
    e.preventDefault();
    let isValid = true;


    fields.forEach(field => {
        const inputElement = document.getElementById(field.id);
        const errorMessage = field.validation(inputElement.value);

        if (errorMessage) {
            setError(errorMessage, field.errorId);
            isValid = false;
        } else {
            setSuccess(field.errorId);
        }
    });


    if (isValid) {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const result = checkUser(email, password);

        if (!result.success) {
            setError(result.message, `error-${result.errorField}`);
            isValid = false;
        }
    }

    if (isValid) {
        alert("Login successful!");
        // توجيه المستخدم لصفحة أخرى
        // window.location.href = "dashboard.html";
    }
});

function setError(message, errorId) {
    const errorElement = document.getElementById(errorId);
    errorElement.textContent = message;
    errorElement.style.display = "block";
}

function setSuccess(errorId) {
    const errorElement = document.getElementById(errorId);
    errorElement.textContent = "";
    errorElement.style.display = "none";
}


fields.forEach(field => {
    const inputElement = document.getElementById(field.id);
    inputElement.addEventListener('input', () => {
        setSuccess(field.errorId);
    });
});