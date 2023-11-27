/**
 * Initializes the login page.
 * Loads user data, handles animations, and displays success messages.
 */
async function initLogin() {
    activUser = {
        'name': '',
    };

    localStorage.setItem('activUser', JSON.stringify(activUser));
    loadUsers();
    initLogoAnimation();
    setPasswordVisibilityListener();

    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberedPassword = localStorage.getItem('rememberedPassword');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    if (rememberedEmail && rememberedPassword) {
        emailInput.value = rememberedEmail;
        passwordInput.value = rememberedPassword;
        document.getElementById("customRememberMe").checked = true;
    }
}


/**
 * Loads user data from the server for login comparisons.
 * @async
 */
async function loadUsers() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}


/**
 * Logs in the user and stores the username and credentials in activUser.
 */
function login() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const email = emailInput.value;
    const password = passwordInput.value;
    const user = users.find(u => u.email === email && u.password === password);
    const errorElement = document.getElementById("passwordMismatchError");

    if (user) {
        // Successful login
        activUser.name = user.userName;
        localStorage.setItem('activUser', JSON.stringify(activUser));

        if (document.getElementById("customRememberMe").checked) {
            localStorage.setItem('rememberedEmail', email);
            localStorage.setItem('rememberedPassword', password);
        } else {
            localStorage.removeItem('rememberedEmail');
            localStorage.removeItem('rememberedPassword');
        }

        setGreetingMobileStatusToFalse();
        window.location.href = 'summary.html';

    } else {
        passwordInput.classList.add("error-border");
        errorElement.textContent = "Wrong password. Please try again.";
    }
}


/**
 * Logs in a user as a guest and fills default data arrays.
 */
function guestLogin() {
    activUser.name = 'Guest 743';
    localStorage.setItem('activUser', JSON.stringify(activUser));
    setGreetingMobileStatusToFalse();
    window.location.href = "./summary.html";
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
function setPasswordVisibilityListener() {
    document.getElementById('password').addEventListener('input', function () {
        let passwordField = document.getElementById('password');
        let eyeIcon = document.getElementById('passwordToggle');

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
 * Initializes the logo animation for the login page.
 */
function initLogoAnimation() {
    const loginDark = document.getElementById('overlay');
    const loginLogo = document.getElementById("login-logo");
    const loginMainContainer = document.getElementById("login-maincontainer");
    const loginNav = document.getElementById("login-nav");
    const loginBottom = document.getElementById("login-bottom-part");

    setTimeout(() => {
        loginLogo.classList.add("move-to-top-left");
        loginDark.style.display = 'none';
    }, 800);
    setTimeout(() => {
        loginMainContainer.classList.add('blend-in');
        loginNav.classList.add('blend-in');
        loginBottom.classList.add('blend-in');
    }, 800);
}
