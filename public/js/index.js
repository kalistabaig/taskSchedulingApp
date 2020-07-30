let firstDayOfWeek;
let selectedTask;
let drivers = [];
let currentDriver; 
let reportCsvString;

setEventListeners();
loadDrivers();

//Functions

function populateGrid() {
    const gridElement = document.getElementById('day-grid');

    while (gridElement.hasChildNodes()) {   
        gridElement.removeChild(gridElement.firstChild);
    }

    const timeDiv = document.createElement('div');
    timeDiv.innerHTML = 'Time';
    gridElement.appendChild(timeDiv);

    //time column for loop
    for (let i = 0; i < 24; i++) {
        const cell = document.createElement('div');
        cell.classList = 'time-cell';
        cell.innerHTML = i.toString().padStart(2,'0') + ':00';
        gridElement.appendChild(cell);
    }
    createDayCells(gridElement);
}

function createDayCells(gridElement) {
    const weekDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let day = 0; day < 7; day++) {
        // Create the header for the column(i.e. the day) Ex. Sun 26
        const weekdayCell = document.createElement('div');
        weekdayCell.classList.add('date-cell');
        const weekday = addDays(firstDayOfWeek, day);
        weekdayCell.innerHTML = `<div>${weekDayNames[weekday.getDay()]}</div><div>${weekday.getDate()}</div>`;
        gridElement.appendChild(weekdayCell);

        const nextDay = addDays(weekday, 1);
        let tasksForDate = currentDriver.tasks.filter(task => {
            return task.startDateTime >= weekday && task.startDateTime < nextDay;
        });

        for (let hour = 0; hour < 24; hour++) {
            const task = tasksForDate.find(task => {
                return task.startDateTime.getHours() === hour;
            });
            weekday.setHours(hour, 0, 0, 0);
            const cell = document.createElement('div');
            cell.classList = 'day-cell';
            if (task) {
                if (task.type == 'Pickup') {
                    cell.classList.add('pickup-cell');
                }
                else if (task.type == 'Dropoff') {
                    cell.classList.add('dropoff-cell');
                }
                else {
                    cell.classList.add('other-cell');
                }
                cell.innerHTML = `<div class="cell-task-type">${task.type}</div><div class="cell-task-location">${task.location}</div><div class="cell-task-description">${task.description}</div>`;
                cell.style = `grid-row: span ${task.duration}`;
                hour += task.duration - 1;
                cell.dataset.taskId = task.id;
            }
            cell.dataset.startDateTime = weekday.valueOf(); //cant pass a date object in html
            cell.addEventListener('click', openTaskForm);
            gridElement.appendChild(cell);
        }
    }
}

function openDownloadForm(e) {
    document.getElementById('download-form').classList.remove('hidden');
    document.getElementById('report-header').innerHTML = `${currentDriver.name}'s Report`;
    populateReport();
}


function closeDownloadForm(e) {
    document.getElementById('download-form').classList.add('hidden');
}

function populateReport() {
    reportCsvString =  createCsvString();
    const gridElement = document.getElementById('driver-report-grid');
    while (gridElement.hasChildNodes()) {   
        gridElement.removeChild(gridElement.firstChild);
    }
    const rows = reportCsvString.split('\n');
    for (row of rows) {
        let cols = row.split(',');
        for (col of cols) {
            let cell =  document.createElement('div');
            cell.classList.add('report-cell');
            cell.innerHTML = col;
            gridElement.appendChild(cell);
        }
    }
}

function openTaskForm(e) {
    let selectedCell = e.target;
    const startDateTime = new Date(parseInt(selectedCell.dataset.startDateTime))

    if (selectedCell.dataset.taskId) {
        selectedTask = currentDriver.tasks.find(task => task.id === parseInt(selectedCell.dataset.taskId))
        document.getElementById('submit-btn').innerHTML = 'Edit';
        document.getElementById('delete-btn').classList.remove('hidden');
        document.getElementById('popup-task-form-header').innerHTML = 'Edit Task';
    } else {
        const newTask = 
        {
            id: null,
            startDateTime: startDateTime,
            duration: 1,
            location: '',
            type: 'Pickup',
            description: ''
        }
        selectedTask = newTask
        document.getElementById('submit-btn').innerHTML = 'Add';
        document.getElementById('delete-btn').classList.add('hidden');
        document.getElementById('popup-task-form-header').innerHTML = 'Add Task';
    }
    
    populateTaskForm();
    if (document.getElementsByClassName('selected-cell').length > 0) {
        document.getElementsByClassName('selected-cell')[0].classList.remove('selected-cell');
    }
    selectedCell.classList.add('selected-cell');
    document.getElementById('popup-task-form').classList.remove('hidden');
}

function populateTaskForm() {
    document.getElementById('time-interval').value = selectedTask.duration;
    document.getElementById('location').value = selectedTask.location;
    document.getElementById(selectedTask.type.toLowerCase()).checked = true;
    document.getElementById('task-description').value = selectedTask.description;
    document.getElementById('date-text').innerHTML = selectedTask.startDateTime.toLocaleDateString();
    document.getElementById('task-time').innerHTML = selectedTask.startDateTime.toLocaleTimeString();
}

function closeTaskForm() {
    if (document.getElementsByClassName('selected-cell')[0]){
        document.getElementsByClassName('selected-cell')[0].classList.remove('selected-cell');
    }
    document.getElementById('popup-task-form').classList.add('hidden');
}

function dismissTaskForm(e) {
    if (e.target.id === 'popup-task-form') {
        closeTaskForm();
    }
}

function dismissTaskForm(e) {
    if (e.target.id === 'download-form') {
        closeDownloadForm();
    }
}

function changeWeek(e) {
    if (e.target.classList.contains('next-week')) {
        firstDayOfWeek = addDays(firstDayOfWeek, 7);
    } else if (e.target.classList.contains('prev-week')) {
        firstDayOfWeek = addDays(firstDayOfWeek, -7);
    } else {
        return;
    }
    firstDayOfWeek.setHours(0,0,0,0);
    updatePage();
}

function saveTask(e) {
    e.preventDefault();
    let taskCopy = {...selectedTask}; //spread operator to clone an object
    taskCopy.duration =  parseInt(document.getElementById('time-interval').value);
    taskCopy.location =  document.getElementById('location').value;
    taskCopy.type =  document.querySelector('input[name="taskOption"]:checked').value;
    taskCopy.description = document.getElementById('task-description').value;
    
    if (!checkTask(taskCopy)) {
        return;

    }

 

    selectedTask.duration = taskCopy.duration;
    selectedTask.location =  taskCopy.location;
    selectedTask.type =  taskCopy.type;
    selectedTask.description = taskCopy.description;

    if (selectedTask.id == null) {
        selectedTask.id = getNewId();
        currentDriver.tasks.push(selectedTask);
    } 

    closeTaskForm()
    updatePage();
}

function deleteButtonClick() {
    deleteTask(selectedTask.id);
    updatePage();
}

function deleteTask(taskId) {
    const taskIndex = currentDriver.tasks.findIndex(task => task.id === taskId);
    currentDriver.tasks.splice(taskIndex, 1);
}

function updateMonthDate() {
    const month_element = document.getElementById('month');
    const lastDayOfWeek = addDays(firstDayOfWeek, 6);
    if (lastDayOfWeek.getMonth() != firstDayOfWeek.getMonth()) {
        month_element.innerHTML = `${getMonthShortName(firstDayOfWeek)} ${firstDayOfWeek.getFullYear()} - ${getMonthShortName(lastDayOfWeek)} ${lastDayOfWeek.getFullYear()}`;
    }else{
        month_element.innerHTML = `${getMonthShortName(firstDayOfWeek)} ${firstDayOfWeek.getFullYear()}`;
    }
}

function updatePage() {
    populateGrid();
    updateMonthDate();
}

function displayCurrentDate() {
    let currentDate = new Date();
    const numMilliSecondsInDay = 24*60*60*1000;
    firstDayOfWeek = new Date(currentDate.valueOf() - (currentDate.getDay()*numMilliSecondsInDay)); 
    firstDayOfWeek.setHours(0,0,0,0);
    updatePage();
}

function setDriver(e) {
    currentDriver = drivers[parseInt(e.target.value)];
    updatePage();
}

function getNewId() {
    let i;
    let biggestId = 0;
    for (i = 0; i < currentDriver.tasks.length; i++) {
        if (currentDriver.tasks[i].id > biggestId) {
            biggestId = currentDriver.tasks[i].id;
        }
    }
    let newId = biggestId + 1;
    return newId;
}
function checkTask(task) {
    // Checks if the task will not extend across multiple days
    const newTaskEndDateTime = addHours(task.startDateTime, task.duration);
    const maxValidTaskEndDateTime = addDays(task.startDateTime, 1);
    maxValidTaskEndDateTime.setHours(0,0,0,0);
    if ( newTaskEndDateTime > maxValidTaskEndDateTime) {
        const overTime = newTaskEndDateTime.getHours();
         alert(`Your task extends across multiple days by ${overTime} hours. Reschedule for an earlier time or reduce the duration of the task`);
         return false;
    }

    // Checks for conflicting tasks and allows the user to delete them 
    const conflictingTasks = checkConflictingTasks(task);
    if (conflictingTasks.length > 0) {
        const taskStrings = conflictingTasks.map(task => `${task.type} ${task.startDateTime.toLocaleString()}`);
        const taskString = taskStrings.join('\n');
        const deleteTasks = confirm(`You have the following conflicting tasks:\n${taskString}\nWould you like to delete the tasks?`);
        if (deleteTasks) {
            conflictingTasks.forEach(task => deleteTask(task.id));
        } else {
            return false; 
        }
    }
    return true;
}

function checkConflictingTasks(task) {
    const taskStartDateTime = task.startDateTime;
    const taskEndDateTime = addHours(task.startDateTime, task.duration);
    const conflictingTasks = [];
    currentDriver.tasks.forEach(existingTask => {
        if (task.id !== existingTask.id) {
            const existingTaskStartDateTime = existingTask.startDateTime
            const existingTaskEndDateTime = addHours(existingTask.startDateTime, existingTask.duration);
            if (
                (taskStartDateTime >= existingTaskStartDateTime && taskStartDateTime < existingTaskEndDateTime) ||
                (taskEndDateTime > existingTaskStartDateTime && taskEndDateTime < existingTaskEndDateTime) ||
                (taskStartDateTime <= existingTaskStartDateTime && taskEndDateTime >= existingTaskEndDateTime)) {
                conflictingTasks.push(existingTask);
            }
        }
    })
    return conflictingTasks;
}

function createCsvFile() {
    download('DriverTaskReport.csv', reportCsvString);
}

function createCsvString() {
    const days = parseInt(document.getElementById('day-range').value);
    let csvText = 'Time-Frame, Pickup, Drop-off, Other';
    let currentDate = new Date(firstDayOfWeek);
    let endDate = addDays(currentDate, 52 * 7);

    while (currentDate < endDate) {
        let pickup = 0;
        let dropoff = 0;
        let other = 0;
        let intervalEndDate = addDays(currentDate, days);
        for (let i = 0; i < currentDriver.tasks.length; i++) {
            let task = currentDriver.tasks[i];
            if (task.startDateTime >= currentDate && task.startDateTime < intervalEndDate) {
                if (task.type == 'Pickup') {
                    pickup++;
                }
                else if (task.type == 'Dropoff') {
                    dropoff++;
                }
                else {
                    other++;
                }
            }
        }
        csvText = csvText + `\n${getMonthShortName(currentDate)} ${currentDate.getDate()} - ${getMonthShortName(intervalEndDate)} ${intervalEndDate.getDate()},${pickup},${dropoff},${other}`;
        currentDate = addDays(currentDate, days);
    }
    return csvText;
}

// Functions

function loadDrivers() {
   drivers =  [
       { 
           name: 'Kalista',
           id: 0,
           tasks: [
               {
                    id: 0,
                    startDateTime: new Date('2020-07-28T06:00:00'),
                    duration: 2,
                    location: 'toronto',
                    type: 'Pickup',
                    description: 'Pick up for sheridian nurseries'
                },
                {
                    id: 1,
                    startDateTime: new Date('2020-07-30T15:00:00'),
                    duration: 3,
                    location: 'markham',
                    type: 'Dropoff',
                    description: 'Store is located on the east side, be on the look out!'
                },
            ]
        },
        {
            name: 'Karisma',
            id: 1,
            tasks: [
                {
                    id: 0,
                    startDateTime: new Date('2020-07-26T06:00:00'),
                    duration: 1,
                    location: 'toronto',
                    type: 'Pickup',
                    description: 'mean staff beware'
                },
                {
                    id: 1,
                    startDateTime: new Date('2020-08-01T15:00:00'),
                    duration: 2,
                    location: 'markham',
                    type: 'Other',
                    description: 'fragile delivery contents, take it easy on the roads'
                }

            ]
         },
         {
            name: 'Matthew',
            id: 2,
            tasks: [
                {
                    id: 0,
                    startDateTime: new Date('2020-07-28T06:00:00'),
                    duration: 2,
                    location: 'toronto',
                    type: 'Other',
                    description: 'security before you enter'
                },
                {
                    id: 1,
                    startDateTime: new Date('2020-07-31T12:00:00'),
                    duration: 4,
                    location: 'markham',
                    type: 'Dropoff',
                    description: 'beware of guard dogs!'
                }
            ]
        } 
    ];
    currentDriver = drivers[0];
    displayCurrentDate();
}

// Event Handler Functions
function setEventListeners() {
    document.getElementById('next-week').addEventListener('click', changeWeek);
    document.getElementById('prev-week').addEventListener('click', changeWeek);
    document.getElementById('download-btn').addEventListener('click', openDownloadForm);
    document.getElementById('today-btn').addEventListener('click', displayCurrentDate);
    document.getElementById('drivers').addEventListener('change', setDriver);
    document.getElementById('task-container').addEventListener('submit', saveTask);
    document.getElementById('cancel-btn').addEventListener('click', closeTaskForm);
    document.getElementById('download-close-btn').addEventListener('click', closeDownloadForm)
    document.getElementById('delete-btn').addEventListener('click', deleteButtonClick);
    document.getElementById('create-file-btn').addEventListener('click', createCsvFile);
    document.getElementById('popup-task-form').addEventListener('click', dismissTaskForm);
    document.getElementById('day-range').addEventListener('change', populateReport)
    document.getElementById('download-form').addEventListener('click', dismissTaskForm);
}

// Helper Functions

function getMonthShortName(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[date.getMonth()];
}

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function addHours(date, hours) {
    const result = new Date(date);
    result.setHours(result.getHours() + hours)
    return result;
}

function download(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}





