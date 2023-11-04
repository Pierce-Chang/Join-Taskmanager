/**
 * @module Register_Module
 * @description The register area of the page
 */

/**
 * Initializes the user information and checks if already registered.
 */
async function initRegister() {
    loadUsers();
    validatePassword();
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
    validatePassword(); // Perform validation
    const errorElement = document.getElementById("passwordMismatchError");

    if (errorElement.textContent) {
        return; // Abort registration if there's an error
    }

    const newUserName = userName.value;
    const newEmail = email.value;
    // Check if the username or email already exists
    const existingUser = users.find((user) => user.userName === newUserName);
    const existingEmail = users.find((user) => user.email === newEmail);

    if (existingUser) {
        // Display an error message if the user is already registered.
        errorElement.textContent = "User with this username already registered";
        return;
    }

    if (existingEmail) {
        // Display an error message if the email already exists.
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
    // Delay the redirection to the login page after showing the success message
    setTimeout(function () {
        window.location.href = 'index.html';
    }, 2000); // Adjust the delay time as needed
}

/**
 * Resets the registration form after submission.
 */
function resetForm() {
    userName.value = '';
    email.value = '';
    password.value = '';
    PWconfirm.value = '';

    // Add a delay before re-enabling the button
    setTimeout(function () {
        registerBtn.disabled = false;
    }, 2000); // Adjust the delay time as needed
}

// Password Validation ///////////////////////////////////////////////

/**
 * Validates password equality.
 */
function validatePassword() {
    const password = document.getElementById("password");
    const PWconfirm = document.getElementById("PWconfirm");
    const errorElement = document.getElementById("passwordMismatchError");

    if (password.value !== PWconfirm.value) {
        errorElement.textContent = "Ups! your password doesn’t match";
        PWconfirm.classList.add("error-border");
    } else {
        errorElement.textContent = "";
        PWconfirm.classList.remove("error-border");
    }
}

// Visual Functions ///////////////////////////////////////////////////////

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
        eyeIcon.src = '/img/register-visibility.png'; // Change the icon to "visibility.png"
    } else {
        passwordField.type = 'password';
        if (passwordField.value) {
            eyeIcon.src = '/img/register-visibility_off.png'; // Change the icon to "visibility-off.png"
        } else {
            eyeIcon.src = '/img/login-lock.png'; // Change the icon to "lock.png"
        }
    }
}

/**
 * Initializes the password visibility toggle listener to update the icon based on user input.
 */
function setPasswordVisibilityListener(fieldId, imgId) {
    // Monitor the input field for changes
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
        overlay.classList.add('active'); // Activate the overlay
        msgBox.classList.remove('d-none');
        msgBox.classList.add('slide-in');
        // Redirect to the login page after a 1-second delay
        setTimeout(function () {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        msgBox.classList.add('d-none');
    }
}
