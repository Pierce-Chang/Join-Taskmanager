// Global variables
let contacts = [];
let selectedContactIndex = -1;

/**
 * Initialize the application.
 */
async function init() {
  loadContacts();
  initOverlays();
}

/**
 * Initializes the display of overlay elements by setting their display property to "flex".
 * This function makes the "addContactOverlay" and "editContactOverlay" elements visible.
 * @function
 * @returns {void}
 */
function initOverlays() {
  document.getElementById("addContactOverlay").style.display = "flex";
  document.getElementById("editContactOverlay").style.display = "flex";
}

/**
 * Load contacts from storage and display them.
 */
async function loadContacts() {
  try {
    contacts = JSON.parse(await getItem("contacts"));
    let savedColors = JSON.parse(localStorage.getItem("contactColors"));
    if (savedColors) {
      contacts.forEach((contact, index) => {
        contact.color = savedColors[index];
      });
    } else {
      contacts.forEach((contact, index) => {
        contact.color = contactColors[index % contactColors.length];
      });
      localStorage.setItem(
        "contactColors",
        JSON.stringify(contacts.map((contact) => contact.color))
      );
    }
    displayContacts();
  } catch (e) {
    console.error("Loading error:", e);
  }
}

/**
 * Show the overlay for adding a new contact.
 */
function showAddContactOverlay() {
  document.getElementById("addContactName").value = '';
  document.getElementById("addContactEmail").value = '';
  document.getElementById("addContactPhone").value = '';
  document.getElementById("addContactOverlay").style.right = "0";
  document.getElementById("addContactOverlay").classList.remove("hidden");
  document.getElementById("overlayBackground").style.display = "flex";
  document.getElementById("addContactOverlay").style.opacity = "100"
}

/**
 * Hide the overlay for adding a new contact.
 */
function hideAddContactOverlay() {
  document.getElementById("addContactOverlay").style.right = "-100%";
  document.getElementById("addContactOverlay").classList.add("hidden");
  document.getElementById("overlayBackground").style.display = "none";
}

/**
 * Show the overlay for editing a contact.
 * @param {number} contactIndex - The index of the contact to edit.
 */
function showEditContactOverlay(contactIndex) {
  selectedContactIndex = contactIndex;
  document.getElementById("editContactOverlay").style.right = "0";
  document.getElementById("editContactOverlay").classList.remove("hidden");
  document.getElementById("overlayBackground").style.display = "flex";
  document.getElementById("editContactOverlay").style.opacity = "100"
  populateEditFields(contactIndex);
}

/**
 * Hide the overlay for editing a contact.
 */
function hideEditContactOverlay() {
  document.getElementById("overlayBackground").style.display = "none";
  document.getElementById("editContactOverlay").style.right = "-100%";
  document.getElementById("editContactOverlay").classList.add("hidden");
}

/**
 * Generates a unique ID for a contact using a combination of timestamp and random string.
 *
 * @returns {string} A unique ID.
 */
function generateUniqueId() {
  let timestamp = new Date().getTime().toString();
  let randomString = Math.random().toString(36).substr(2, 9);
  return timestamp + randomString;
}


/**
 * Check if the provided string is a valid email address.
 *
 * @param {string} email - The email address to validate.
 * @returns {boolean} True if the email is valid, false otherwise.
 */
function isValidEmail(email) {
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}


/**
 * Add a new contact to the list.
 */
async function addContact(event) {
  let fullName = document.getElementById("addContactName").value;
  let email = document.getElementById("addContactEmail").value;
  let phone = document.getElementById("addContactPhone").value;
  let initials = getInitials(fullName);

  if (!checkForRightInput(fullName, email, phone) || !isValidEmail(email)) {
    return;
  }

  let randomColor =
    contactColors[Math.floor(Math.random() * contactColors.length)];

  contacts.push({
    name: fullName,
    email: email,
    phone: phone,
    initials: initials,
    color: randomColor,
    id: generateUniqueId(),
  });

  localStorage.setItem(
    "contactColors",
    JSON.stringify(contacts.map((contact) => contact.color))
  );

  await setItem("contacts", JSON.stringify(contacts));
  displayContacts();
  hideAddContactOverlay();
  init();
  showSuccessMessage('Contact succesfully created');
}

/**
 * Get the initials from a name.
 * @param {string} name - The name to extract initials from.
 * @returns {string} The initials.
 */
function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

/**
 * Display the list of contacts.
 */
function displayContacts() {
  let contactListDiv = document.getElementById("contactList");
  contactListDiv.innerHTML = "";
  contacts.sort((a, b) => a.name.localeCompare(b.name));

  let currentInitial = "";
  contacts.forEach((contact, index) => {
    let contactListItemHTML = createContactListItem(contact, index);
    let initials = getInitials(contact.name);
    let firstInitial = initials.charAt(0).toUpperCase();

    if (firstInitial !== currentInitial) {
      currentInitial = firstInitial;
      contactListDiv.innerHTML += `
        <div class="contact_letter">${currentInitial}</div>
        <div class="space_line"></div>`;
    }

    contactListDiv.innerHTML += contactListItemHTML;
  });
}

/**
 * Display the details of a selected contact.
 * @param {number} contactIndex - The index of the contact to display.
 */
function showContactInfo(contactIndex) {
  let contact = contacts[contactIndex];
  let bigContactDiv = document.getElementById("contactDetails");

  if (window.innerWidth < 770) {
    hideContactsListShowContactInfo();
  }

  bigContactSlide();

  let contactDetailsHTML = createContactDetails(contact, contactIndex);
  bigContactDiv.innerHTML = contactDetailsHTML;

  setButtonActive(contactIndex);
}

/**
 * Function to hide the contact list and show contact information.
 */
function hideContactsListShowContactInfo() {
  document.getElementById("rightSideContactHeader").style.display = "flex";
  document.getElementById("contactsDiv").style.display = "none";
  document.getElementById("addContactMobileButton").style.display = "none";
  document.getElementById("contactSettingsMobile").style.display = "flex";
}

/**
 * Function to show the contact list and hide contact information.
 */
function showContactsListHideContactInfo() {
  document.getElementById("rightSideContactHeader").style.display = "none";
  document.getElementById("contactsDiv").style.display = "flex";
  document.getElementById("addContactMobileButton").style.display = "flex";
  document.getElementById("contactSettingsMobile").style.display = "none";
}

/**
 * Animates the sliding in and out of a large contact details container.
 * This function first removes the 'big_contact_slide_in' class, triggers a reflow,
 * and then adds the class back to create the slide animation effect.
 * @function
 * @returns {void}
 */
function bigContactSlide() {
  let bigContactDiv = document.getElementById("contactDetails");
  bigContactDiv.classList.remove("big_contact_slide_in");
  void bigContactDiv.offsetWidth; // Trigger Reflow
  bigContactDiv.classList.add("big_contact_slide_in");
}

/**
 * Delete a contact.
 * @param {number} contactIndex - The index of the contact to delete.
 */
function deleteContact(contactIndex) {
  if (confirm("Are you sure you want to delete this contact?")) {
    contacts.splice(contactIndex, 1);
    localStorage.setItem(
      "contactColors",
      JSON.stringify(contacts.map((contact) => contact.color))
    );
    setItem("contacts", JSON.stringify(contacts));
    displayContacts();
    hideEditContactOverlay();
    let bigContactDiv = document.getElementById("contactDetails");
    bigContactDiv.innerHTML = "";
  }
}

/**
 * Save changes to a contact.
 */
function saveContact() {
  let editContactName = document.getElementById("editContactName").value;
  let editContactEmail = document.getElementById("editContactEmail").value;
  let editContactPhone = document.getElementById("editContactPhone").value;

  if (
    !checkForRightInput(editContactName, editContactEmail, editContactPhone)
  ) {
    return;
  }

  contacts[selectedContactIndex].name = editContactName;
  contacts[selectedContactIndex].email = editContactEmail;
  contacts[selectedContactIndex].phone = editContactPhone;

  setItem("contacts", JSON.stringify(contacts));
  displayContacts(selectedContactIndex);
  showContactInfo(selectedContactIndex);
  hideEditContactOverlay();
  showSuccessMessage('Contact succesfully edited');
}

/**
 * Check if the input values are correct.
 * @param {string} fullName - The full name input.
 * @param {string} email - The email input.
 * @param {string} phone - The phone input.
 */
function checkForRightInput(fullName, email, phone) {
  let errors = [];

  if (fullName.length < 3) {
    errors.push("Name should have at least 3 characters.");
    showErrorMessage("Name should have at least 3 characters.");
  }

  if (email.length < 3) {
    errors.push("Email should have at least 3 characters.");
    showErrorMessage("Email should have at least 3 characters.");
  }

  if (phone.length < 3) {
    errors.push("Phone should have at least 3 characters.");
    showErrorMessage("Phone should have at least 3 characters.");
  }

  if (fullName.split(" ").length < 2) {
    errors.push("Name should contain both first and last name.");
    showErrorMessage("Name should contain both first and last name.");
  }

  if(!isValidEmail(email)){
    errors.push("Please enter a valid mail adress.");
    showErrorMessage("Please enter a valid mail adress.");
  }

  if (errors.length > 0) {
    return false;
  }

  return true;
}

/**
 * Show an error message div.
 * @param {string} errorMessage - The error message to display.
 */
function showErrorMessage(errorMessage) {
  let errorDiv = document.getElementById("error_message");
  errorDiv.style.display = "flex";
  errorDiv.innerHTML = errorMessage;

  setTimeout(() => {
    errorDiv.style.opacity = 1;
  }, 100);

  setTimeout(() => {
    errorDiv.style.opacity = 0;
    setTimeout(() => {
      errorDiv.style.display = "none";
    }, 1000);
  }, 3000);
}

/**
 * Populate the edit fields with contact information.
 * @param {number} contactIndex - The index of the contact to populate the fields for.
 */
function populateEditFields(contactIndex) {
  let contact = contacts[contactIndex];
  document.getElementById("editContactName").value = contact.name;
  document.getElementById("editContactEmail").value = contact.email;
  document.getElementById("editContactPhone").value = contact.phone;
  let initialsButton = document.getElementById("editContactInitials");
  initialsButton.innerText = getInitials(contact.name);
  initialsButton.style.backgroundColor = contact.color;
}

/**
 * Display a warning when there are too few letters in the input fields.
 */
function tooFewLettersWarning() {
  alert(
    "Please enter at least 3 letters in the name, email address, and phone number. The name must contain your first and last name. "
  );
}

/**
 * Sets the active state for a contact and removes the active state from all other contacts.
 *
 * @param {number} contactIndex - The index of the contact to set as active.
 * @throws {Error} If the `contactIndex` is out of bounds or invalid.
 * @see {@link contacts} - An array of contact elements.
 */
function setButtonActive(contactIndex) {
  if (window.innerWidth > 770) {
    contacts.forEach((_, index) => {
      let contact = document.getElementById(`contact${index}`);
      contact.classList.remove("contact_active");
    });
    let activeContact = document.getElementById(`contact${contactIndex}`);
    activeContact.classList.add("contact_active");
  }
}


/**
 * Opens the mobile settings box.
 * Displays the mobile settings box by changing its display style to "flex".
 */
function openMobileSettingsBox() {
  document.getElementById("mobileSettingsBox").style.display = "flex";
}

/**
 * Closes the mobile settings box.
 * Hides the mobile settings box by changing its display style to "none".
 */
function closeMobileSettingsBox() {

  if (window.innerWidth < 770 && document.getElementById("mobileSettingsBox").style.display === "flex") {
    document.getElementById("mobileSettingsBox").style.display = "none";
  }
}
