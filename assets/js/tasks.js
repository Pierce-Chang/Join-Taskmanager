// Global variables
let globalTasks = [];
let filteredTaskIDs = [];
let filteredContacts = [];
let selectedSubtasks = [];
let progress;
let mode;

/**
 * Initializes the application.
 */
async function initAddTask(progressIndex, inputMode) {
    await loadTasks();
    await initContactList();
    initAddTaskVariables(progressIndex, inputMode);
    initCategories();
    hideAddContactOverlay();
    disableTaskSubmitButton(false);
}

/**
 * Load tasks from storage.
 */
async function loadTasks() {
    try {
        globalTasks = JSON.parse(await getItem("tasks"));
    } catch (e) {
        console.error("Loading error:", e);
    }
}

/**
 * Load contacts from storage.
 */
async function loadContactsForTasks() {
    try {
        contacts = JSON.parse(await getItem("contacts"));
    } catch (e) {
        console.error("Loading error:", e);
    }
}

/**
 * Saves the global tasks to local storage.
 * @returns {Promise<void>} A promise that resolves when the tasks are saved.
 * @async
 */
async function saveTasks() {
    await setItem('tasks', JSON.stringify(globalTasks));
}

/**
 * Returns a new unique id in case of adding a new task 
 * or returns the id of an existing task in case of edit mode.
 */
function getTaskID() {
    if (mode == 'add') {
        return generateUniqueId();
    } else {
        return currentTaskId;
    };
}

/**
 * Show the overlay for adding a new task.
 */
async function showAddTaskOverlay(progressIndex, mode) {
    document.getElementById("addTaskOverlay").style.display = "flex";
    document.getElementById("addTaskOverlay").style.zIndex = "1000";
    document.getElementById("addTask-close-button").style.display = "flex";
    await initAddTask(progressIndex, mode);
    overlayAddFormActive = true;
}

/**
 * Hide the overlay for adding a new task.
 */
function closeAddTaskOverlay() {
    document.getElementById("addTaskOverlay").style.display = "none";
    document.getElementById("addTask-close-button").style.display = "none";
    resetAddTask();
    overlayAddFormActive = false;
}
