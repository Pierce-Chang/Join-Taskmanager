// Global variables
let board;
let currentDraggedElementId;
let currentDraggedElementIndex
let currentTaskId;
let currentTaskIndex;
let overlayToDoCardActive = false;
let overlayAddFormActive = false;

/**
 * Initialize the application.
 * @async
 */
async function initBoard() {
    await loadTasks();
    await loadContactsForTasks();
    renderTasksToBoard();
    hideTaskOverlay();
}

/**
 * Initializes the board content.
 */
function renderTasksToBoard() {
    let board = document.getElementById('board');
    board.innerHTML = '';
    createColumns();
    createHeaders();
    setFilteredTasksBySearch();
    createCards();
    renderCards();
}


/**
 * Filters task IDs based on a search term in the "board-search" input field.
 * @returns {number[]} An array of filtered task IDs.
 */
function setFilteredTasksBySearch() {
    let searchQuery = document.getElementById('board-search').value.toLowerCase();

    // When no tasks is found give all tasks back
    if (!searchQuery.trim()) {
        filteredTaskIDs = globalTasks.map(task => task.id);
    } else {
        // filters tasks and gives IDs back
        filteredTaskIDs = globalTasks.filter(task => {
            return task.title.toLowerCase().includes(searchQuery) ||
                task.description.toLowerCase().includes(searchQuery);
        }).map(task => task.id);
    };
}

/**
 * Update the board content according to the search query.
 */
function updateBoardBySearch() {
    // setFilteredTasksBySearch();
    renderTasksToBoard();
}

/**
 * Creates columns for the tasks board.
 */
function createColumns() {
    let board = document.getElementById('board');
    for (let i = 0; i < progresses.length; i++) {
        board.innerHTML += getHTMLTemplateCreateColumn(i);
    }
}

/**
 * Creates headers for each column on the board.
 */
function createHeaders() {
    for (let i = 0; i < progresses.length; i++) {
        let progressName = progresses[i];
        let column = document.getElementById(`board-column-${i}`);
        column.innerHTML += getHTMLTemplateCreateHeader(i, progressName);
    };
}

/**
 * Creates cards for each task.
 */
function createCards() {
    for (let i = 0; i < progresses.length; i++) {
        let column = document.getElementById(`board-column-content-${i}`);
        let hasTask = false;
        for (let j = 0; j < filteredTaskIDs.length; j++) {
            setCurrentTaskIdAndIndex(filteredTaskIDs[j]);
            if (globalTasks[currentTaskIndex].progress == i) {
                hasTask = true;
                column.innerHTML += getHTMLTemplateCreateToDoCard(currentTaskId);
            };
        };
        if (!hasTask) {
            column.innerHTML += getHTMLTemplateCreateNoToDoCard(progresses[i]);
        };
    };
}

/**
 * Renders the content of each card.
 */
function renderCards() {
    for (let i = 0; i < filteredTaskIDs.length; i++) {
        setCurrentTaskIdAndIndex(filteredTaskIDs[i]);
        let card = document.getElementById(`todo-card-${currentTaskId}`);
        let title = globalTasks[currentTaskIndex].title;
        let description = globalTasks[currentTaskIndex].description;
        let categoryName = categories[globalTasks[currentTaskIndex].category].name;
        let categoryColor = categories[globalTasks[currentTaskIndex].category].color;
        let subtasksLength = globalTasks[currentTaskIndex].subtasks.length;
        let subtasksDone = globalTasks[currentTaskIndex].subtasks.filter(subtask => subtask.done === true).length;
        let progressInPercent = divideAndRound(subtasksDone, subtasksLength);
        let assignedToTemplate = getTemplateAssignedTo(globalTasks[currentTaskIndex].assignedTo);
        let taskprio = globalTasks[currentTaskIndex].prio;
        card.innerHTML = getHTMLTemplateRenderCard(categoryColor, categoryName, title, description, progressInPercent, subtasksDone, subtasksLength, assignedToTemplate, taskprio);
    };
}

/**
 * Generates a template for displaying assigned contacts.
 * @param {string[]} assignedToArray - Array of assigned contact IDs.
 * @returns {string} The generated HTML template.
 */
function getTemplateAssignedTo(assignedToArray) {
    let compoundTemplate = '';
    let k = 0;
    for (let i = 0; i < assignedToArray.length; i++) {
        let j = getIndexByIdFromComplexArray(assignedToArray[i], contacts);
        if (j >= 0) {
            let initials = contacts[j].initials;
            let color = contacts[j].color;
            if (k == 0) {
                compoundTemplate += `<div class="" style="background-color: ${color};">${initials}</div>`;
                k = k + 1;
            } else if (k > 0 && k < 3) {
                compoundTemplate += `<div class="" style="background-color: ${color};z-index: ${i}; margin-left: -10px;">${initials}</div>`;
                k = k + 1;
            } else {
                let numberFurtherContacts = assignedToArray.length - i;
                compoundTemplate += `<div class="" style="background-color: #2A3647;z-index: ${i}; margin-left: -10px;">+${numberFurtherContacts}</div>`;
                return compoundTemplate;
            };
        };
    }
    return compoundTemplate;
}

/**
 * Initializes dragging for an element with a specified ID.
 * @param {string} id - The ID of the draggable element.
 */
function startDragging(id) {
    currentDraggedElementId = id;
    currentDraggedElementIndex = getIndexByIdFromComplexArray(currentDraggedElementId, globalTasks);
}

/**
 * Allows dropping of elements.
 * @param {Event} ev - The drag event.
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * Moves a dragged element to a specified category/column.
 * @param {number} i - The index of the destination column.
 * @async
 */
async function moveTo(i) {
    globalTasks[currentDraggedElementIndex].progress = i;
    await saveTasks();
    renderTasksToBoard();
}

/**
 * Adds the 'drag-highlight' class to an element.
 * @param {string} element - The ID of the DOM element to be highlighted.
 */
function addHighlight(element) {
    document.getElementById(element).classList.add('drag-highlight');
}

/**
 * Removes the 'drag-highlight' class from an element.
 * @param {string} element - The ID of the DOM element to remove the highlight from.
 */
function removeHighlight(element) {
    document.getElementById(element).classList.remove('drag-highlight');
}

/**
 * Toggles the visibility of a dropdown list for mobile drag actions.
 * @param {Event} event - Das Event-Objekt, das von einem Klick-Ereignis stammt.
 * @param {HTMLElement} element - Das HTML-Element, das als Schalter für das Dropdown dient.
 */
function toggleDropdownMobileDrag(event, element) {
    event.stopPropagation();
    var dropdown = element.nextElementSibling;
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
}

/**
 * Handles the logic to move a task to a different progress stage in a mobile drag context.
 * @param {Event} event - Das Event-Objekt, das von einem Klick-Ereignis stammt.
 * @param {number} progress - Der Index des Fortschrittsstatus, zu dem die Aufgabe verschoben werden soll.
 */
function moveToMobileDrag(event, progress) {
    event.stopPropagation();
    startDragging(currentTaskId);
    moveTo(progress);
    event.target.parentElement.style.display = 'none';
}

/**
 * Closes dropdown ul by clicking outside the dropdown.
 */
window.onclick = function(event) {
    var dropdowns = document.getElementsByClassName("dropdown");
    for (var i = 0; i < dropdowns.length; i++) {
        dropdowns[i].style.display = 'none';
    }
}

/**
 * Show the overlay for editing a task.
 */
function showTaskOverlay() {
    document.getElementById("showTaskOverlay").style.right = "0";
    document.getElementById("showTaskOverlay").classList.remove("hidden");
    document.getElementById("overlayBackground").style.display = "flex";
    document.getElementById("showTaskOverlay").style.opacity = "100";
    overlayToDoCardActive = true;
}

/**
 * Hide the overlay for editing a task.
 */
function hideTaskOverlay() {
    document.getElementById("overlayBackground").style.display = "none";
    document.getElementById("showTaskOverlay").style.right = "-100%";
    document.getElementById("showTaskOverlay").classList.add("hidden");
    overlayToDoCardActive = false;
}

/**
 * Initializes the detailed view for a task.
 * @param {string} id - The ID of the task.
 */
function initDetailedCard(id) {
    setCurrentTaskIdAndIndex(id);
    showTaskOverlay();
    renderDetailedCard(currentTaskIndex);
}

/**
 * Renders the detailed view of a task card based on its index.
 * @param {number} i - The index of the task in the globalTasks array.
 */
function renderDetailedCard(i) {
    document.getElementById('todo-card-detailed-category').innerHTML = categories[globalTasks[i].category].name;
    document.getElementById('todo-card-detailed-category').style.backgroundColor = categories[globalTasks[i].category].color;
    document.getElementById('todo-card-detailed-title').innerHTML = globalTasks[i].title;
    document.getElementById('todo-card-detailed-description').innerHTML = globalTasks[i].description;
    document.getElementById('todo-card-detailed-dueDate').innerHTML = new Date(globalTasks[i].dueDate).toLocaleDateString('en-GB');
    document.getElementById('todo-card-detailed-prioName').innerHTML = capitalizePrio(i);
    document.getElementById('todo-card-detailed-prioImg').src = `img/prio-${globalTasks[i].prio}.png`;
    document.getElementById('todo-card-detailed-assignedToList').innerHTML = getTemplateAssignedToContacts(i);
    document.getElementById('todo-card-detailed-subtasks').innerHTML = getTemplateSubtasks(i);
    document.getElementById('todo-card-detailed-btnTaskDelete').setAttribute('onclick', `deleteTask('${globalTasks[i].id}'); return false`)
    document.getElementById('todo-card-detailed-btnTaskEdit').setAttribute('onclick', `editTask('${globalTasks[i].id}'); return false`)
}

/**
 * Capitalizes the priority string. 'med' will be changed to 'Medium'.
 * @param {number} i - The index of the task in the globalTasks array.
 * @returns {string} - Capitalized priority string.
 */
function capitalizePrio(i) {
    let string = globalTasks[i].prio;
    if (string == 'med') {
        return string[0].toUpperCase() + string.slice(1) + 'ium';
    } else {
        return string[0].toUpperCase() + string.slice(1);
    };
}

/**
 * Updates the checked status of subtasks in a card.
 * @param {number} i - The index of the task in the globalTasks array.
 * @async
 */
async function updateCheckedStatusShowCard(i) {
    globalTasks[i].subtasks = updatedArrayCheckedStatus(globalTasks[i].subtasks, "showCard");
    await saveTasks();
    renderCards();
}

/**
 * Deletes a task based on its ID.
 * @param {string} id - The ID of the task in globalTasks Array.
 */
async function deleteTask(id) {
    setCurrentTaskIdAndIndex(id);
    globalTasks.splice(currentTaskIndex, 1);
    await saveTasks();
    hideTaskOverlay();
    renderTasksToBoard();
    showSuccessMessage('Task successfully deleted');
}

/**
 * Initiates the task edit mode for a given task ID.
 * @param {string} id - The ID of the task.
 */
async function editTask(id) {
    setCurrentTaskIdAndIndex(id);
    await showAddTaskOverlay(globalTasks[currentTaskIndex].progress, 'edit');
    setCurrentTaskIdAndIndex(id); // necessary again, because init add task overwrite currentTask Status
    renderEditTaskForm(currentTaskIndex);
}

/**
 * Renders the edit task form based on a task index.
 * @param {number} i - The index of the task in the globalTasks array.
 */
function renderEditTaskForm(i) {
    renderEditTaskFormFieldValues(i);
    setPrio(globalTasks[i].prio);
    selectCategory(globalTasks[i].category);
    renderEditTaskFormAssignedContacts(i);
    renderEditTaskFormSubtasks(i);
    hideContactList();
    hideCategoryList();
}

/**
 * Sets the values in the edit task form fields based on a task index.
 * @param {number} i - The index of the task in the globalTasks array.
 */
function renderEditTaskFormFieldValues(i) {
    document.getElementById('addTask-header-h1').innerHTML = 'Edit Task';
    document.getElementById('addTaskBtnSubmit').innerHTML = 'Save Task';
    document.getElementById('addTaskBtnClear').setAttribute('onclick', `renderEditTaskForm(${i}); return false`);
    document.getElementById('addTaskTitle').value = globalTasks[i].title;
    document.getElementById('addTaskDescription').value = globalTasks[i].description;
    document.getElementById('addTaskDueDate').value = new Date(globalTasks[i].dueDate).toLocaleDateString('af-ZA');
    document.getElementById('addTaskSubtaskInput').value = '';
}

/**
 * Renders the assigned contacts in the edit task form based on a task index.
 * @param {number} i - The index of the task in the globalTasks array.
 */
function renderEditTaskFormAssignedContacts(i) {
    selectedContacts = [];
    renderContactList();
    let assignedToArray = globalTasks[i].assignedTo;
    for (let j = 0; j < assignedToArray.length; j++) {
        addToSelectedContacts(assignedToArray[j]);
    };
    renderSelectedContacts();
}

/**
 * Renders the subtasks in the edit task form based on a task index.
 * @param {number} i - The index of the task in the globalTasks array.
 */
function renderEditTaskFormSubtasks(i) {
    for (let k = 0; k < selectedSubtasks.length; k++) {
        deleteSubtask(0);
    };
    selectedSubtasks = JSON.parse(JSON.stringify(globalTasks[i].subtasks)); // JSON method necessary to avoid mutable reference problem
    renderSubtaskList();
}

/**
 * Navigates to the board page or updates the current board view based on the current mode and URL.
 * If the current page is 'board.html', it will either add a new task or edit an existing task.
 * If the current page is not 'board.html', it will navigate to 'board.html'.
 */
function goToBoard() {
    if (window.location.href.indexOf("board.html") > -1) {
        if (mode == 'add') { //add new task mode
            returnToBoardAfterAddTask();
        } else { //edit mode
            returnToBoardAfterEditTask();
        };
    } else {
        showSuccessMessage('Task succesfully created');
        setTimeout(function () {
            window.location.href = 'board.html';
        }, 750); // 750 Millisekunden = 0,75 Sekunde
    };
}

/**
 * Updates the board view after adding a new task.
 * It hides the task overlay, closes the add task overlay, initializes the board, 
 * and then displays a success message.
 */
function returnToBoardAfterAddTask() {
    hideTaskOverlay();
    closeAddTaskOverlay();
    initBoard();
    showSuccessMessage('Task succesfully created');
}

/**
 * Updates the board view after editing an existing task.
 * It closes the add task overlay, renders the tasks to the board, displays the details of the edited task,
 * and then displays a success message.
 */
function returnToBoardAfterEditTask() {
    let storedTaskIndex = currentTaskIndex;
    closeAddTaskOverlay();
    renderTasksToBoard();
    renderDetailedCard(storedTaskIndex);
    showSuccessMessage('Task succesfully edited');
}

/**
 * Calculates the quotient of two numbers and rounds it. If one of the numbers is zero, it returns zero.
 * @param {number} a - The dividend.
 * @param {number} b - The divisor.
 * @returns {number} The rounded quotient.
 */
function divideAndRound(a, b) {
    if (a === 0 || b === 0) {
        return 0; // Verhindert Division durch Null und gibt 0 zurück, wenn einer der Werte 0 ist
    }
    return Math.round(a / b * 100);
}

/**
 * Sets the current task ID and its index based on the given ID.
 * @param {string} id - The ID of the task.
 */
function setCurrentTaskIdAndIndex(id) {
    currentTaskId = id;
    currentTaskIndex = getIndexByIdFromComplexArray(currentTaskId, globalTasks);
}