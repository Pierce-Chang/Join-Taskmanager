/**
 * Initializes the summary/dashboard area by loading tasks and rendering the summary.
 * @async
 */
async function initSummary() {
    await loadTasks();
    renderSummary();
}

/**
 * Renders the summary by updating the KPI elements with the corresponding values.
 */
function renderSummary() {
    document.getElementById('summary-kpi-todo').innerHTML = getAmountTasksPerProgress(0);
    document.getElementById('summary-kpi-done').innerHTML = getAmountTasksPerProgress(3);
    document.getElementById('summary-kpi-urgent').innerHTML = getAmountTasksPerPrio('high');
    document.getElementById('summary-kpi-deadline').innerHTML = getEarliestDueDateWithPriority();
    document.getElementById('summary-kpi-tasksInBoard').innerHTML = globalTasks.length;
    document.getElementById('summary-kpi-progress').innerHTML = getAmountTasksPerProgress(1);
    document.getElementById('summary-kpi-feedback').innerHTML = getAmountTasksPerProgress(2);
}

/**
 * Returns the number of tasks with the specified progress index.
 * @param {number} progressIndex - The progress index to filter tasks by.
 * @returns {number} The number of tasks matching the specified progress index.
 */
function getAmountTasksPerProgress(progressIndex) {
    return globalTasks.filter(task => task.progress === progressIndex).length;
}

/**
 * Returns the number of tasks with the specified priority.
 * @param {string} prio - The priority to filter tasks by (e.g., 'high').
 * @returns {number} The number of tasks matching the specified priority.
 */
function getAmountTasksPerPrio(prio) {
    return globalTasks.filter(task => task.prio === prio).length;
}

/**
 * Gets the earliest due date among tasks with a progress of 0, 1, or 2.
 * @returns {string} The earliest due date in formatted string or 'No task found' if no tasks match the criteria.
 */
function getEarliestDueDateWithPriority() {
    let filteredTasks = globalTasks.filter(task => [0, 1, 2].includes(task.progress));

    if (filteredTasks.length === 0) {
        return 'No task found';
    }

    filteredTasks.sort((task1, task2) => {
        if (task1.prio === 'high' && task2.prio !== 'high') {
            return -1;
        } else if (task1.prio !== 'high' && task2.prio === 'high') {
            return 1;
        }

        let date1 = new Date(task1.dueDate);
        let date2 = new Date(task2.dueDate);

        return date1 - date2;
    });

    let earliestTask = filteredTasks[0];
    let formattedDate = changeDateFormat(earliestTask.dueDate);
    return formattedDate;
}

/**
 * Converts a date string into the format "Month Day, Year".
 * @param {string} date - The date string to format.
 * @returns {string} The formatted date string.
 */
function changeDateFormat(date) {
    // Datum ins gewünschte Format umwandeln
    let dateObj = new Date(date);
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    let formattedDate = `${monthNames[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
    return formattedDate;
}

/**
 * Initializes greeting  on summary.
 */
function initializeGreeting() {
    updateGreetingBasedOnTime();
    fadeOutGreetingMobile();
}

/**
 * Fades out the greeting container on mobile devices if the screen width is less than 1360px.
 */
function fadeOutGreetingMobile() {
    getGreetingMobileStatus();
    let greetingContainer = document.getElementById('greetingContainerMobile');
    if (window.innerWidth < 1360) {
        if (greetingMobileAlreadyShown == 'false') {
            makeGreetingContainerContentVisible();
            makeGreetingContainerVisible(greetingContainer);
            setTimeout(function () {
                makeGreetingContainerInvisible(greetingContainer);
            }, 750); // 500ms = 0.5 Sekunden
            setGreetingMobileStatusToTrue();
        };
    };
    document.getElementById('summary-content').style.display = 'flex';
}

/**
 * Sets the display properties of the greeting container to make it visible.
 * @param {HTMLElement} greetingContainer - The container element to be made visible.
 */
function makeGreetingContainerVisible(greetingContainer) {
    greetingContainer.style.display = 'block';
    greetingContainer.style.visibility = 'visible';
    greetingContainer.style.opacity = 1;
}

/**
 * Makes the content of the 'helloPageMobile' element visible.
 */
function makeGreetingContainerContentVisible() {
    let helloPageMobile = document.getElementById('helloPageMobile');
    helloPageMobile.style.visibility = 'visible';
    helloPageMobile.style.opacity = 1;
}

/**
 * Sets the visibility properties of the greeting container to make it invisible.
 * @param {HTMLElement} greetingContainer - The container element to be made invisible.
 */
function makeGreetingContainerInvisible(greetingContainer) {
    greetingContainer.style.visibility = 'hidden';
    greetingContainer.style.opacity = 0;
    setTimeout(function () {
        greetingContainer.style.display = 'none';
    }, 500); // 500ms = 0.5 Sekunden
}

/**
 * Updates the greeting text based on the current time of the day.
 * Sets the greeting for both desktop and mobile greeting elements.
 */
function updateGreetingBasedOnTime() {
    let now = new Date();
    let hour = now.getHours();
    let greeting;

    if (hour < 12) {
        greeting = "Good morning";
    } else if (hour < 18) {
        greeting = "Good afternoon";
    } else {
        greeting = "Good evening";
    }

    document.getElementById('greetingDaytime').innerHTML = greeting;
    document.getElementById('greetingDaytimeMobile').innerHTML = greeting;
}