/**
 * Constant to store the storage token.
 * @type {string}
 */
const STORAGE_TOKEN = 'YDITW3FZPTKXOANID4RLEPARCUN9OMMKIJBM9WO8';


/**
 * Base URL for remote storage.
 * @type {string}
 */
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';


/**
 * Object to store the active user's information.
 * @type {Object}
 */
let activUser = {
    'name': '',
};


/**
 * Array to store user information.
 * @type {Array}
 */
let users = [];


/**
 * Asynchronously set an item in remote storage.
 * @param {string} key - The key to store the item under.
 * @param {any} value - The value to store.
 * @returns {Promise} A promise that resolves when the item is set.
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}


/**
 * Asynchronously get an item from remote storage.
 * @param {string} key - The key to retrieve the item.
 * @returns {Promise} A promise that resolves with the retrieved item.
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url)
        .then(res => res.json())
        .then(res => {
            if (res.data) {
                return res.data.value;
            }
            throw `Could not find data with key "${key}".`;
        });
}


/**
 * Initialize user-related summary information.
 */
async function initUserName() {       
    loadActiveUser();
    hideMenuIfNoActiveUser();
}


/**
 * Load the active user's information from localStorage.
 */
function loadActiveUser() {
    const activUserJSON = localStorage.getItem('activUser');

    if (activUserJSON) {
        activUser = JSON.parse(activUserJSON);
        userName = activUser.name;
    }
}


/**
 * Asynchronously display the user's name and initials.
 */
async function displayUserName() {
    if (activUser.name == "") {
        return;
    } else {
        const userNameElement = document.getElementById('activUserName');
        const userNameElementMobile = document.getElementById('activUserNameMobile');
        const userProfileElement = document.getElementById('profileButton');

        if (userNameElement && activUser.name) {
            userNameElement.textContent = activUser.name;
            userNameElementMobile.textContent = activUser.name;
        }
        userProfileElement.innerHTML = getInitialsOf(activUser.name || "");
    }
}


/**
 * Get the initials from a full name.
 * @param {string} name - The name to extract initials from.
 * @returns {string} The initials.
 */
function getInitialsOf(name) {
    return name
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase())
        .join("");
}


/**
 * Asynchronously hide the menu if the user is not active.
 */
async function hideMenuIfNoActiveUser() {
    if (typeof includeHTML === 'function') {
        await includeHTML();
    } else {
        return;
    }

    let dnMenu = document.getElementById("menu");
    let profileButton = document.getElementById("profileButton");
    if (activUser.name == "") {
        dnMenu.style.display = 'none';
        profileButton.style.display = 'none';
    }
    displayUserName();
}

