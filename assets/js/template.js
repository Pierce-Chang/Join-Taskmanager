/**
 * Generates an HTML template for rendering a contact in a list.
 * @param {string} id - The ID of the contact.
 * @param {string} color - The background color for the contact's initials.
 * @param {string} name - The name of the contact.
 * @param {string} initials - The initials of the contact.
 * @returns {string} - The HTML template.
 */
function getHTMLTemplateRenderContactForList(id, color, name, initials) {
    return `
        <li id="selectContactLi-${id}" onclick="selectContact('${id}'); return false">
            <div class="contact-initials-and-name">
                <div class="contact_initial_image" style="background-color: ${color}">${initials}</div>
                <span>${name}</span>
            </div>
            <img id="addTaskCheckbox-${id}" src="../../img/remember-unchecked.png" alt="">
        </li>
    `;
}

/**
 * Generates an HTML template for rendering errorhandler in case of no found contacts.
 * @returns {string} - The HTML template.
 */
function getHTMLTemplateRenderNoContactForList() {
    return `
        <li>
            <div class="contact-initials-and-name">
                <span>No contacts found. Please add a contact or reload the page.</span>
            </div>
        </li>
    `;
}

/**
 * Generates an HTML template for rendering a contact assigned to a task.
 * @param {string} color - The background color for the contact's initials.
 * @param {number} zindex - The z-index for the contact's initials.
 * @param {string} initials - The initials of the contact.
 * @returns {string} - The HTML template.
 */
function getHTMLTemplateRenderContactAssignedTo(color, zindex, initials) {
    return `
        <div class="contact_initial_image" style="background-color: ${color}; z-index: ${zindex}; 
        margin-left: -10px; margin-right: 0px;">${initials}</div>
    `;
}

/**
 * Returns the HTML Template for rendering category name and color.
 * @param {string} name - The name of the category.
 * @param {string} color - The color of the category as '000000'.
 */
function getTemplateCategory(name, color) {
    return `
        <div class="category-color-and-name">
            <div class="category_color" style="background-color: ${color}"></div>
            <span>${name}</span>
        </div>
    `;
}

/**
 * Generates an HTML template for rendering a category in a list.
 * @param {number} i - The index of the category.
 * @param {string} template - The HTML template for the category.
 * @returns {string} - The HTML template.
 */
function getHTMLTemplateRenderCategoryForList(i, template) {
    return `
        <li id="selectCategoryLi-${i}" onclick="selectCategory('${i}'); return false">
            ${template}
        </li>
    `;
}

/**
 * Generates an HTML template for rendering errorhandler in case of no found categories.
 * @returns {string} - The HTML template.
 */
function getHTMLTemplateRenderNoCategoryForList() {
    return `
        <li>
            <span>No categories found. Please reload the page.</span>
        </li>
    `;
}

/**
 * Generates an HTML template for rendering a subtask in the "Add Task" form.
 * @param {number} i - The index of the subtask.
 * @param {string} checked - Whether the subtask checkbox should be checked or not.
 * @param {string} subtaskName - The name of the subtask.
 * @returns {string} - The HTML template.
 */
function getHTMLTemplateRenderAddTaskSubtask(i, checked, subtaskName) {
    return `
        <div class="subtask" id="subtask-${i}">
            <div>
                <input type="checkbox" id="subtask-checkbox-addForm-${i}" class="largerCheckbox" onclick="updateCheckedStatusAddForm()" ${checked}>
                <span class="linebreak" id="subtask-span-addForm-${i}" >${subtaskName}</span>
                <input type="text" class="d-none" id="subtask-input-addForm-${i}" value="${subtaskName}">
            </div>
            <div class="subtask-buttons">
                <img class="d-none" id="subtask-img-addForm-clear-${i}" src="../../img/clear.png" onclick="clearEditedSubtask(${i}); return false">
                <img id="subtask-img-addForm-edit-${i}" src="../../img/edit.png" onclick="startEditSubtask(${i}); return false">
                <div class="subtask-separator"></div>
                <img class="d-none" id="subtask-img-addForm-save-${i}" src="../../img/save.png" onclick="saveEditedSubtask(${i}); return false">
                <img id="subtask-img-addForm-delete-${i}" src="../../img/delete.png" onclick="deleteSubtask(${i}); return false">
            </div>
        </div>
    `;
}

/**
 * Builds the task array before pushing it into the global tasks array.
 */
function buildTaskArray() {
    // Variablen definieren
    let assignedTo = selectedContacts;
    let subtasks = selectedSubtasks.slice();
    return {
        id: getTaskID(),
        title: document.getElementById('addTaskTitle').value,
        description: document.getElementById('addTaskDescription').value,
        assignedTo: assignedTo,
        dueDate: document.getElementById('addTaskDueDate').value,
        prio: selectedPrio,
        category: selectedCategory,
        subtasks: subtasks,
        progress: progress,
    };
}

/**
 * Generates an HTML template for creating a column on the board.
 * @param {number} i - The index of the column / progress level.
 * @returns {string} - The HTML template.
 */
function getHTMLTemplateCreateColumn(i) {
    return `
        <div class="board-column" id="board-column-${i}">
        </div>
    `;
}

/**
 * Generates an HTML template for creating a column header.
 * @param {number} i - The index of the column.
 * @param {string} progressName - The name of the progress status (e.g., "In Progress", "Done").
 * @returns {string} - The HTML template.
 */
function getHTMLTemplateCreateHeader(i, progressName) {
    return `
        <div class="board-column-header">
            <h3>${progressName}</h3>
            <div class="img-add" onclick="showAddTaskOverlay(${i}, 'add'); return false"></div>
        </div>
        <div class="board-column-content" id="board-column-content-${i}" 
            ondrop="moveTo(${i})" ondragover="allowDrop(event); addHighlight('board-column-content-${i}')" 
            ondragleave="removeHighlight('board-column-content-${i}')">
        </div>
    `;
}

/**
 * Generates an HTML template for creating a To-Do card.
 * @param {string} currentTaskId - The ID of the current task.
 * @returns {string} - The HTML template.
 */
function getHTMLTemplateCreateToDoCard(currentTaskId) {
    return `
        <div draggable="true" ondragstart="startDragging('${currentTaskId}')" 
        class="todo-card grow" id="todo-card-${currentTaskId}" 
        onclick="initDetailedCard('${currentTaskId}'); return false"></div>
    `;
}

/**
 * Generates an HTML template for displaying a message when there are no To-Do cards.
 * @param {string} progress - The current progress status.
 * @returns {string} - The HTML template.
 */
function getHTMLTemplateCreateNoToDoCard(progress) {
    return `
        <div class="no-todo-card">
            <p>No tasks ${progress}</p>
        </div>
    `;
}

/**
 * Generates an HTML template for rendering a task card.
 * @param {string} categoryColor - The color of the task's category.
 * @param {string} categoryName - The name of the task's category.
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {number} progressInPercent - The progress of the task in percentage.
 * @param {number} subtasksDone - The number of completed subtasks.
 * @param {number} subtasksLength - The total number of subtasks.
 * @param {string} assignedToTemplate - The HTML template for the users assigned to the task.
 * @param {string} taskprio - The priority of the task.
 * @returns {string} - The HTML template.
 */
function getHTMLTemplateRenderCard(categoryColor, categoryName, title, description, progressInPercent, subtasksDone, subtasksLength, assignedToTemplate, taskprio) {
    return `
        <div class="category-and-move-img">
            <p class="todo-category" style="background-color: ${categoryColor}">${categoryName}</p>
            <div class="img-drag desktop-hidden" onclick="toggleDropdownMobileDrag(event, this)"></div>
            <ul class="dropdown" style="display: none;">
                ${progresses.map((progress, index) => `<li onclick="moveToMobileDrag(event, ${index})">${progress}</li>`).join('')}
            </ul>
        </div>
        <div class="todo-title-and-description">
            <p class="todo-title">${title}</p>
            <p class="todo-description">${description}</p>
        </div>
        <div class="todo-progress-and-subtasks">
            <div class="todo-progress-100">
                <div class="todo-progress" style="width: ${progressInPercent}%"></div>
            </div>
            <p>${subtasksDone}/${subtasksLength} Subtasks</p>
        </div>
        <div class="todo-persons-and-prio">
            <div class="todo-persons">
                ${assignedToTemplate}
            </div>
            <div class="todo-prio ${taskprio}"></div>
        </div>
    `;
}

/**
 * Generates an HTML template for assigned contacts based on a task index.
 * @param {number} i - The index of the task in the globalTasks array.
 * @returns {string} - HTML template for assigned contacts.
 */
function getTemplateAssignedToContacts(i) {
    let assignedToContacts = globalTasks[i].assignedTo;
    let template = '';
    for (let j = 0; j < assignedToContacts.length; j++) {
        let id = assignedToContacts[j];
        let contactIndex = getIndexByIdFromComplexArray(id, contacts);
        if (contactIndex >= 0) {
            let initials = contacts[contactIndex].initials;
            let name = contacts[contactIndex].name;
            let color = contacts[contactIndex].color;
            template = template + getHTMLTemplateDetailedCardAssignedToContacts(color, initials, name);
        }
    };
    return template;
}

/**
 * Generates an HTML template for displaying an assigned contact in the detailed card view.
 * @param {string} color - The background color for the contact's initials.
 * @param {string} initials - The initials of the contact.
 * @param {string} name - The name of the contact.
 * @returns {string} - The HTML template.
 */
function getHTMLTemplateDetailedCardAssignedToContacts(color, initials, name) {
    return `
        <li>
            <div class="contact-initials-and-name">
                <div class="contact_initial_image" style="background-color: ${color}">${initials}</div>
                <span>${name}</span>
            </div>
        </li>
    `;
}

/**
 * Generates an HTML template for subtasks based on a task index.
 * @param {number} i - The index of the task in the globalTasks array.
 * @returns {string} - HTML template for subtasks.
 */
function getTemplateSubtasks(i) {
    let subtasks = globalTasks[i].subtasks;
    let template = '';
    for (let j = 0; j < subtasks.length; j++) {
        let subtaskName = subtasks[j].name;
        let subtaskDone = subtasks[j].done;
        let checked = '';
        if (subtaskDone) {
            checked = 'checked';
        } else {
            checked = '';
        };
        template = template + getHTMLTemplateDetailedCardSubtasks(i, j, checked, subtaskName);
    };
    return template;
}

/**
 * Generates an HTML template for displaying a subtask in the detailed card view.
 * @param {number} i - The index of the task.
 * @param {number} j - The index of the subtask.
 * @param {string} checked - Whether the subtask checkbox should be checked or not.
 * @param {string} subtaskName - The name of the subtask.
 * @returns {string} - The HTML template.
 */
function getHTMLTemplateDetailedCardSubtasks(i, j, checked, subtaskName) {
    return `
        <div class="subtask" id="subtask-${j}">
            <div>
                <input type="checkbox" id="subtask-checkbox-showCard-${j}" class="largerCheckbox" onclick="updateCheckedStatusShowCard(${i})" ${checked}>
                <span>${subtaskName}</span>
            </div>
        </div>
    `;
}

/**
 * Create the HTML for the contact details.
 * @param {Object} contact - The contact object.
 * @param {number} contactIndex - The index of the contact.
 * @returns {string} - The HTML for the contact details.
 */
function createContactDetails(contact, contactIndex) {
    return `
      <div class="big_contact_top">
        <div class="big_contact_initial_image"><button style="background-color: ${
          contact.color
        }">${getInitials(contact.name)}</button></div>
        <div class="big_contact_name_settings">
          <div class="big_contact_name">${contact.name}</div>
          <div class="big_contact_settings">
            <button onclick="showEditContactOverlay(${contactIndex})"><img src="./img/edit.png" alt="Edit Icon">Edit</button>
            <button onclick="deleteContact(${contactIndex})"><img src="./img/delete.png" alt="Delete Icon">Delete</button>
          </div>
        </div>
      </div>
      <div class="big_contact_info">
        <div class="big_contact_headline">Contact Information</div>
        <div class="big_contact_mail">
          <b>Email</b>
          <div class="contact_mail"><a href="mailto:${contact.email}">${
      contact.email
    }</a></div>
        </div>
        <div class="big_contact_phone">
          <b>Phone</b>
          ${contact.phone}
        </div>
      </div>
  
  
      
      <div class="mobile_settings_box" id="mobileSettingsBox">
      <div class="edit_contact_mobile" onclick="showEditContactOverlay(${contactIndex})"><div><img src="./img/edit.png" alt="Edit"></div><div>Edit</div></div>
      <div class="delete_contact_mobile" onclick="deleteContact(${contactIndex})"><img src="./img/delete.png" alt="Delete"><span>Delete</span></div>
  </div>
      
      `;
  }

  /**
 * Create the HTML for a contact list item.
 * @param {Object} contact - The contact object.
 * @param {number} index - The index of the contact.
 * @returns {string} - The HTML for the contact list item.
 */
function createContactListItem(contact, index) {
    let initials = getInitials(contact.name);
    return `
      <button class="contact" onclick="showContactInfo(${index}), setButtonActive(${index})" id="contact${index}">
        <div class="contact_initial_image" style="background-color: ${contact.color}">${initials}</div>
        <div class="contact_name_mail">
          <div class="contact_name">${contact.name}</div>
          <div class="contact_mail">
            <a a href="mailto:${contact.email}">${contact.email}</a>
          </div>
        </div>
      </button>`;
  }