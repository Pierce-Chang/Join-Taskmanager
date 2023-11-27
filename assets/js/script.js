// global variables
let greetingMobileAlreadyShown;

/**
 * Looks for the index of an ID inside an array.
 * @param {string} id - The ID to search for in the array.
 * @param {array} array - The array to be searched.
 */
function getIndexById(id, array) {
  return array.indexOf(id);
}

/**
* Looks for the index of an contact-ID inside the contact-array.
* @param {string} id - The ID to search for in the array.
*/
function getIndexByIdFromComplexArray(id, array) {
  for (let i = 0; i < array.length; i++) {
      if (id == array[i].id) {
          return i;
      };
  };
  return -1;
}

/**
 * Show the success message when successfully created or edited contact or task
 * needs an html element with id 'success
 */
function showSuccessMessage(text) {
  let successMessage = document.getElementById('successmessage');

  successMessage.style.opacity = 0;
  successMessage.style.display = "flex";
  successMessage.innerHTML = text;
  setTimeout(() => {
    successMessage.style.opacity = 1;
  }, 1000);

  setTimeout(() => {
    successMessage.style.opacity = 0;
    setTimeout(() => {
      successMessage.style.display = "none";
    }, 1000);
  }, 3000);
}

function setGreetingMobileStatus() {
  localStorage.setItem('greetingMobileAlreadyShown', greetingMobileAlreadyShown);
}

function setGreetingMobileStatusToFalse() {
  greetingMobileAlreadyShown = false;
  setGreetingMobileStatus();
}

function setGreetingMobileStatusToTrue() {
  greetingMobileAlreadyShown = true;
  setGreetingMobileStatus();
}

function getGreetingMobileStatus() {
  greetingMobileAlreadyShown = localStorage.getItem('greetingMobileAlreadyShown');
}