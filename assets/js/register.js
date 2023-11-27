/**
 * Initializes the user information and checks if already registered.
 */
async function initRegister() {
    loadUsers();
    validateInputFields();
    setPasswordVisibilityListener('password', 'passwordToggle');
    setPasswordVisibilityListener('PWconfirm', 'confirmToggle');
    loadMsgBox();
}


/**
 * Loads user data from storage.
 */
async function loadUsers() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}


/**
 * Registers a user.
 */
async function register() {
    validateInputFields();
    const errorElement = document.getElementById("passwordMismatchError");

    if (errorElement.textContent) {
        return;
    }

    const newUserName = userName.value;
    const newEmail = email.value;
    const existingUser = users.find((user) => user.userName === newUserName);
    const existingEmail = users.find((user) => user.email === newEmail);

    if (existingUser) {
        errorElement.textContent = "User with this username already registered";
        return;
    }

    if (existingEmail) {
        errorElement.textContent = "User with this email already registered";
        return;
    }

    registerBtn.disabled = true;

    users.push({
        userName: newUserName,
        email: email.value,
        password: password.value,
    });

    await setItem('users', JSON.stringify(users));
    resetForm();
    window.location.href = 'register.html?msg=You Signed Up successfully';
    setTimeout(function () {
        window.location.href = 'index.html';
    }, 2000);
}


/**
 * Resets the registration form after submission.
 */
function resetForm() {
    userName.value = '';
    email.value = '';
    password.value = '';
    PWconfirm.value = '';

    setTimeout(function () {
        registerBtn.disabled = false;
    }, 2000);
}


/**
 * Validates password equality.
 */
function validateInputFields() {
    const password = document.getElementById("password");
    const PWconfirm = document.getElementById("PWconfirm");
    const email = document.getElementById("email");
    const userName = document.getElementById("userName");
    const errorElement = document.getElementById("passwordMismatchError");

    if (password.value !== PWconfirm.value) {
        errorElement.textContent = "Ups! Your password doesn’t match";
        PWconfirm.classList.add("error-border");
    } else {
        errorElement.textContent = "";
        PWconfirm.classList.remove("error-border");
    }

    const existingEmail = users.find((user) => user.email === email.value);
    if (existingEmail) {
        errorElement.textContent = "User with this email already registered";
        email.classList.add("error-border");
    } else {
        email.classList.remove("error-border");
    }

    const existingUser = users.find((user) => user.userName === userName.value);
    if (existingUser) {
        errorElement.textContent = "User with this username already registered";
        userName.classList.add("error-border");
    } else {
        userName.classList.remove("error-border");
    }
}


/**
 * Toggles the visibility of a password field and updates the associated icon.
 * @param {string} fieldId - The ID of the password field to toggle.
 * @param {string} imgId - The ID of the associated icon to update.
 */
function togglePasswordVisibility(fieldId, imgId) {
    let passwordField = document.getElementById(fieldId);
    let eyeIcon = document.getElementById(imgId);

    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        eyeIcon.src = '/img/register-visibility.png';
    } else {
        passwordField.type = 'password';
        if (passwordField.value) {
            eyeIcon.src = '/img/register-visibility_off.png';
        } else {
            eyeIcon.src = '/img/login-lock.png';
        }
    }
}


/**
 * Initializes the password visibility toggle listener to update the icon based on user input.
 */
function setPasswordVisibilityListener(fieldId, imgId) {
    document.getElementById(fieldId).addEventListener('input', function () {
        let passwordField = document.getElementById(fieldId);
        let eyeIcon = document.getElementById(imgId);

        if (passwordField.type === 'password' && passwordField.value) {
            eyeIcon.src = '/img/register-visibility_off.png';
        } else if (passwordField.type === 'password' || 'text' && !passwordField.value) {
            eyeIcon.src = '/img/login-lock.png';
        } else if (passwordField.type === 'text' && passwordField.value) {
            eyeIcon.src = '/img/register-visibility.png';
        }
    });
}


/**
 * Loads a message box for success registration message.
 */
function loadMsgBox() {
    const urlParams = new URLSearchParams(window.location.search);
    const msg = urlParams.get('msg');
    const msgBox = document.getElementById('msgBox');
    const overlay = document.getElementById('register-body');

    if (msg) {
        msgBox.innerHTML = msg;
        overlay.classList.add('active');
        msgBox.classList.remove('d-none');
        msgBox.classList.add('slide-in');

        setTimeout(function () {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        msgBox.classList.add('d-none');
    }
}
