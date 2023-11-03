/**
 * Task Management Application
 */

// ****************
// OVERHEAD
// ****************

// Global variables
let board;
let currentDraggedElement;


// Array for different progress levels
let progresses = [
    "To Do",
    "In Progress",
    "Await Feedback",
    "Done"
];

// ****************
// INITIALIZE
// ****************

/**
 * Initialize the application.
 */
async function initBoard() {
    await loadTasks();
    await loadContactsForTasks();
    renderTasksToBoard();
    hideTaskOverlay();
}

/**
 * Initialize the board content.
 */
function renderTasksToBoard() {
    let board = document.getElementById('board');
    board.innerHTML = '';
    createColumns();
    createHeaders();
    createCards();
    renderCards();
}

// ****************
// BOARD CONTENT
// ****************

/**
 * Creates columns for the board.
 */
function createColumns() {
    for (let i = 0; i < progresses.length; i++) {
        document.getElementById('board').innerHTML += `
            <div class="board-column" id="board-column-${i}">
            </div>
            `;
    }
}

/**
 * Creates headers for the board columns.
 */
function createHeaders() {
    for (let i = 0; i < progresses.length; i++) {
        let progressName = progresses[i];
        let column = document.getElementById(`board-column-${i}`);
        column.innerHTML += `
            <div class="board-column-header">
                <h3>${progressName}</h3>
                <img src="img/add.png" alt="" onclick="showAddTaskOverlay(${i}); return false">
            </div>
            <div class="board-column-content" id="board-column-content-${i}" 
                ondrop="moveTo(${i})" ondragover="allowDrop(event); addHighlight('board-column-content-${i}')" 
                ondragleave="removeHighlight('board-column-content-${i}')">
            </div>
        `;
    };
}

/**
 * Creates cards for tasks.
 */
function createCards() {
    for (let i = 0; i < progresses.length; i++) {
        let column = document.getElementById(`board-column-content-${i}`);
        let hasTask = false;
        // if there is an task with fitted progress then create card
        for (j = 0; j < tasks.length; j++) {
            if (tasks[j].progress == i) {
                hasTask = true;
                column.innerHTML += `<div draggable="true" ondragstart="startDragging(${j})" class="todo-card grow" id="todo-card-${j}" onclick="initDetailedCard(${j}); return false"></div>`;
            };
        };
        // if there is no ToDo-Card, then add a no-todo-card
        if (!hasTask) {
            column.innerHTML += `
                <div class="no-todo-card">
                    <p>No tasks ${progresses[i]}</p>
                </div>`;
        };
    };
}

/**
 * Renders the content of the cards.
 */
function renderCards() {
    for (let i = 0; i < tasks.length; i++) {
        let card = document.getElementById(`todo-card-${i}`);
        let title = tasks[i].title;
        let description = tasks[i].description;
        let categoryName = categories[tasks[i].category].name;
        let categoryColor = categories[tasks[i].category].color;
        let subtasksLength = tasks[i].subtasks.length;
        let subtasksDone = tasks[i].subtasks.filter(subtask => subtask.done === true).length;
        let progressInPercent = divideAndRound(subtasksDone, subtasksLength);
        let assignedToTemplate = getTemplateAssignedTo(tasks[i].assignedTo);
        let taskprio = tasks[i].prio;

        card.innerHTML = `
            <p class="todo-category" style="background-color: ${categoryColor}">${categoryName}</p>
            <div class="todo-title-and-description">
                <p class="todo-title">${title}</h3>
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
    };

}

/**
 * Generates the template for assigned contacts.
 * @param {string[]} assignedToArray - Array of assigned contact IDs.
 * @returns {string} - The generated template.
 */
function getTemplateAssignedTo(assignedToArray) {
    let compoundTemplate = '';
    for (let j = 0; j < assignedToArray.length; j++) {
        let k = getIndexByIdFromContacts(assignedToArray[j]);
        let initials = contacts[k].initials;
        let color = contacts[k].color;
        if (!color) {
            color = '#87CEFA';
        };
        let style = `background-color: ${color};`
        if (j > 0) {
            style += ` z-index: ${j}; margin-left: -10px;`;
        } else {
            style += '';
        }
        compoundTemplate += `
            <div class="" style="${style}">${initials}</div>
        `;
    }
    return compoundTemplate;
}

// ****************
// DRAG AND DROP
// ****************

function startDragging(i) {
    currentDraggedElement = i;
    console.log(currentDraggedElement);
}

function allowDrop(ev) {
    ev.preventDefault();
}

async function moveTo(i) {
    tasks[currentDraggedElement].progress = i;
    await saveTasks();
    renderTasksToBoard();
}

function addHighlight(element) {
    document.getElementById(element).classList.add('drag-highlight');
}

function removeHighlight(element) {
    document.getElementById(element).classList.remove('drag-highlight');
}


// ****************
// OVERLAY
// ****************

/**
 * Show the overlay for editing a contact.
 * @param {number} contactIndex - The index of the contact to edit.
 */
function showTaskOverlay() {
    // selectedContactIndex = contactIndex;
    document.getElementById("showTaskOverlay").style.right = "0";
    document.getElementById("showTaskOverlay").classList.remove("hidden");
    document.getElementById("overlayBackground").style.display = "flex";
    document.getElementById("showTaskOverlay").style.opacity = "100"
    // populateEditFields(contactIndex);
}

/**
 * Hide the overlay for editing a contact.
 */
function hideTaskOverlay() {
    document.getElementById("overlayBackground").style.display = "none";
    document.getElementById("showTaskOverlay").style.right = "-100%";
    document.getElementById("showTaskOverlay").classList.add("hidden");
}

function initDetailedCard(i) {
    showTaskOverlay();
    renderDetailedCard(i);
}


function renderDetailedCard(i) {
    document.getElementById('todo-card-detailed-category').innerHTML = categories[tasks[i].category].name;
    document.getElementById('todo-card-detailed-category').style.backgroundColor = categories[tasks[i].category].color;
    document.getElementById('todo-card-detailed-title').innerHTML = tasks[i].title;
    document.getElementById('todo-card-detailed-description').innerHTML = tasks[i].description;
    document.getElementById('todo-card-detailed-dueDate').innerHTML = new Date(tasks[i].dueDate).toLocaleDateString('en-GB');
    document.getElementById('todo-card-detailed-prioName').innerHTML = capitalizePrio(i);
    document.getElementById('todo-card-detailed-prioImg').src = `img/prio-${tasks[i].prio}.png`;
    document.getElementById('todo-card-detailed-assignedToList').innerHTML = getTemplateAssignedToContacts(i);
    document.getElementById('todo-card-detailed-subtasks').innerHTML = getTemplateSubtasks(i);
    document.getElementById('todo-card-detailed-btnTaskDelete').setAttribute('onclick',`deleteTask(${i}); return false`)
    document.getElementById('todo-card-detailed-btnTaskEdit').setAttribute('onclick',`editTask(${i}); return false`)
}

function capitalizePrio(i) {
    let string = tasks[i].prio;
    if (string == 'med') {
        return string[0].toUpperCase() + string.slice(1) + 'ium';
    } else {
        return string[0].toUpperCase() + string.slice(1);
    };
}

function getTemplateAssignedToContacts(i) {
    let assignedToContacts = tasks[i].assignedTo;
    let template = '';
    for (let j = 0; j < assignedToContacts.length; j++) {
        let id = assignedToContacts[j];
        let contactIndex = getIndexByIdFromContacts(id);
        let initials = contacts[contactIndex].initials;
        let name = contacts[contactIndex].name;
        let color = contacts[contactIndex].color;
        template = template + `
            <li>
                <div class="contact-initials-and-name">
                    <div class="contact_initial_image" style="background-color: ${color}">${initials}</div>
                    <span>${name}</span>
                </div>
            </li>
        `;
    };
    return template;
}

function getTemplateSubtasks(i) {
    selectedSubtasks = tasks[i].subtasks;
    let template = '';
    for (let j = 0; j < selectedSubtasks.length; j++) {
        let subtaskName = selectedSubtasks[j].name;
        let subtaskDone = selectedSubtasks[j].done;
        let checked = '';
        if (subtaskDone) {
            checked = 'checked';
        } else {
            checked = '';
        }
        template = template + `
            <div class="subtask" id="subtask-${j}">
                <div>
                    <input type="checkbox" id="subtask-checkbox-${j}" class="largerCheckbox" onclick="updateCheckedStatus(${i})" ${checked}>
                    <span>${subtaskName}</span>
                </div>
            </div>
        `;
    };
    return template;
}

async function updateCheckedStatus(i) {
    selectedSubtasks = tasks[i].subtasks;
    updateSubtasksCheckedStatus();
    tasks[i].subtasks = selectedSubtasks;
    await saveTasks();
    renderCards();
    selectedSubtasks = [];
}

async function deleteTask(i) {
    tasks.splice(i, 1);
    await saveTasks();
    hideTaskOverlay();
    renderTasksToBoard();
    showSuccessMessage('Task successfully deleted');
}

function editTask(i) {
    selectedContacts = tasks[i].assignedTo;
    showAddTaskOverlay(0);
    renderTaskForm(i);
}

function renderTaskForm(i) {
    document.getElementById('addTask-header-h1').innerHTML = 'Edit Task';
    document.getElementById('addTaskTitle').value = tasks[i].title;
    document.getElementById('addTaskDescription').value = tasks[i].description;

    document.getElementById('addTaskShowSelectedContacts').innerHTML = '';

    selectedContacts = tasks[i].assignedTo;
    for (let j = 0; j < selectedContacts; j++) {
        let id = selectedContacts[j];
        selectContact(id);
    }
    // renderSelectedContacts();

}


// ****************
// HELPING FUNCTIONS
// ****************



function divideAndRound(a, b) {
    if (a === 0 || b === 0) {
        return 0; // Verhindert Division durch Null und gibt 0 zurück, wenn einer der Werte 0 ist
    }
    return Math.round(a / b * 100);
}

