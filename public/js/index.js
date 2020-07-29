const gridElement = document.getElementsByClassName('day-grid')[0];
const month_element = document.getElementsByClassName("month")[0];
const driverSelect = document.getElementsByClassName('drivers')[0];
const todayButton = document.getElementsByClassName('todayBtn')[0];
const next_week_element = document.getElementById("nextWeek");
const prev_week_element = document.getElementById("prevWeek");
const taskForm = document.getElementsByClassName('task-container')[0];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const weekDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
let firstDayOfWeek;
let selectedTask;
const numMilliSecondsInDay = 24*60*60*1000;
const drivers = [
    {   name: "Kali",
        id: 0,
        tasks: [
            {
                id: 0,
                startDateTime: new Date('2020-07-28T06:00:00'),
                duration: 2,
                location: 'toronto',
                type: 'Pickup',
                description: "Pick up for sheridian nurseries"
            },
            {
                id: 1,
                startDateTime: new Date('2020-07-30T15:00:00'),
                duration: 3,
                location: 'markham',
                type: 'Dropoff',
                description: 'Store is located on the east side, be on the look out!'
            }
        ]
    },
    {
        name: "Karisma",
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
        name: "Matthew",
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
let currentDriver = drivers[0];

// add event listener to arrows so when they are clicked it changes the dates 
next_week_element.addEventListener('click', changeWeek);
prev_week_element.addEventListener('click', changeWeek);
todayButton.addEventListener('click', toCurrentDate);
driverSelect.addEventListener('change', setDriver);
taskForm.addEventListener('submit', saveTask);
document.getElementById('cancelBtn').addEventListener('click', closeForm);
document.getElementById('deleteBtn').addEventListener('click', deleteButtonClick);
document.getElementById('createFileBtn').addEventListener('click', createCsvFile);



toCurrentDate();

//Functions

function openDownloadForm(e) {
    document.getElementById("download-form").style.display = "block";
}

function closeDownloadForm(e) {
    document.getElementById("download-form").style.display = "none";
}

function openForm(e) {
    let selectedCell = e.target;
    const startDateTime = new Date(parseInt(selectedCell.dataset.startDateTime))

    if (selectedCell.dataset.taskId) {
        selectedTask = currentDriver.tasks.find(task => task.id === parseInt(selectedCell.dataset.taskId))
        document.getElementById("submitBtn").innerHTML = 'Edit';
        document.getElementById('deleteBtn').classList.remove('hidden');

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
        document.getElementById("submitBtn").innerHTML = 'Add';
        document.getElementById('deleteBtn').classList.add('hidden');
    }
    document.getElementById('timeInterval').value = selectedTask.duration;
    document.getElementById('location').value = selectedTask.location;
    document.getElementById(selectedTask.type.toLowerCase()).checked = true;
    document.getElementById('taskDescription').value = selectedTask.description;
    document.getElementsByClassName('date-text')[0].innerHTML = startDateTime.toLocaleDateString();
    document.getElementsByClassName('task-time')[0].innerHTML = startDateTime.toLocaleTimeString();
    if (document.getElementsByClassName('selected-cell').length > 0) {
        document.getElementsByClassName('selected-cell')[0].classList.remove('selected-cell');
    }
    selectedCell.classList.add('selected-cell');
    document.getElementById("myForm").classList.remove('hidden');
}

function closeForm() {
    if (document.getElementsByClassName('selected-cell')[0]){
        document.getElementsByClassName('selected-cell')[0].classList.remove('selected-cell');
    }
    document.getElementById("myForm").classList.add('hidden');
}

function changeWeek(e) {
    let arrowClass = (e.target.className).split(" ")[1];
   
    if (arrowClass == 'next-week') {
        firstDayOfWeek = addDays(firstDayOfWeek, 7);
    } else if (arrowClass == "prev-week") {
        firstDayOfWeek = addDays(firstDayOfWeek, -7);
    }else {
        return -1;
    }

    firstDayOfWeek.setHours(0,0,0,0);
    updatePage();
}

function addDays(date, days) {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function addHours(date, hours) {
    let result = new Date(date);
    result.setHours(result.getHours() + hours)
    return result;
}

function populateGrid() {

    while (gridElement.hasChildNodes()) {   
        gridElement.removeChild(gridElement.firstChild);
      }

    const timeDiv = document.createElement('div');
    timeDiv.innerHTML = "Time"
    gridElement.appendChild(timeDiv);

    //time column for loop
    for (let i = 0; i < 24; i++) {
        const cell = document.createElement('div');
        cell.classList = "time-cell";
        cell.innerHTML = i + ":00";
        gridElement.appendChild(cell);
    }

    for (let day = 0; day < 7; day++) {
        const weekdayCell = document.createElement('div');
        const weekday = addDays(firstDayOfWeek, day);
        weekdayCell.innerHTML = `<div>${weekDayNames[weekday.getDay()]}</div><div>${weekday.getDate()}</div>`; 
        gridElement.appendChild(weekdayCell);

        const nextDay = addDays(weekday, 1);
        let tasksForDate = currentDriver.tasks.filter(task => {
            return task.startDateTime >= weekday && task.startDateTime < nextDay;
        })

        for (let hour = 0; hour < 24; hour++) {
            const task = tasksForDate.find( task => {
                return task.startDateTime.getHours() === hour;
            })
            weekday.setHours(hour,0,0,0);
            const cell = document.createElement('div');
            cell.classList = "day-cell"; 
            
            if (task) {
                console.log(task.type);
                if (task.type == 'Pickup') {
                    cell.classList.add('pickup-cell');
                } else if (task.type == 'Dropoff') {
                    cell.classList.add('dropoff-cell');
                } else {
                    cell.classList.add('other-cell');
                }
                cell.innerHTML= `<div class="cell-task-type">${task.type}</div> <div class="cell-task-description">${task.description}</div>`;
                cell.style = `grid-row: span ${task.duration}`;
                hour+=task.duration -1;
                cell.dataset.taskId = task.id;
            }    
            cell.dataset.startDateTime = weekday.valueOf(); //cant pass a date object in html
            cell.addEventListener('click', openForm);
            gridElement.appendChild(cell);
        }
    }
}

function saveTask(e) {
    e.preventDefault();
    let taskCopy = {...selectedTask}; //spread operator to clone an object
    taskCopy.duration =  parseInt(document.getElementById('timeInterval').value);
    taskCopy.location =  document.getElementById('location').value;
    taskCopy.type =  document.querySelector('input[name="taskOption"]:checked').value;
    taskCopy.description = document.getElementById('taskDescription').value;
    
    if (!checkTask(taskCopy)) {
        return;
    }

    const conflictingTasks = checkConflictingTasks(taskCopy);
    
    if (conflictingTasks.length > 0) {
        let deleteTasks;
        const taskStrings = conflictingTasks.map(task => { return `${task.type} ${task.startDateTime.toLocaleString()}`})
        console.log(taskStrings);
        deleteTasks = confirm("you have the following conflicting tasks: " + taskStrings + ' would you like to delete?');
        if(deleteTasks){
            conflictingTasks.forEach(task => deleteTask(task.id));
        }else{
            return
        }
    }

    selectedTask.duration = taskCopy.duration;
    selectedTask.location =  taskCopy.location;
    selectedTask.type =  taskCopy.type;
    selectedTask.description = taskCopy.description;

    if (selectedTask.id == null) {
        selectedTask.id = getNewId();
        currentDriver.tasks.push(selectedTask);
    } 

    closeForm()
    updatePage();
    return false;

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

    const lastDayOfWeek = addDays(firstDayOfWeek, 6);
    if (lastDayOfWeek.getMonth() != firstDayOfWeek.getMonth()) {
        month_element.innerHTML = months[firstDayOfWeek.getMonth()] + ' ' + firstDayOfWeek.getFullYear() + " - " + months[lastDayOfWeek.getMonth()] + ' ' + lastDayOfWeek.getFullYear();
    }else{
        month_element.innerHTML = months[firstDayOfWeek.getMonth()] + ' ' + firstDayOfWeek.getFullYear()
    }
}

function updatePage() {
    populateGrid();
    updateMonthDate();
}

function toCurrentDate() {
    let currentDate = new Date();
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
    const newTaskEndDateTime = addHours(task.startDateTime, task.duration);
    const maxValidTaskEndDateTime = addDays(task.startDateTime, 1);
    maxValidTaskEndDateTime.setHours(0,0,0,0);

    if ( newTaskEndDateTime > maxValidTaskEndDateTime) {
         alert('Your Task exceeds the 24 hour period, please pick a different duration time');
         return false;
    }
    return true;
    

}

function checkConflictingTasks(task){
    const newTaskEndDateTime = addHours(task.startDateTime, task.duration);
    const conflictingTasks = [];
    currentDriver.tasks.forEach(existingTask => {
        if (task.id !== existingTask.id) {
            console.log(task.id, existingTask.id);
            const taskEndDateTime = addHours(existingTask.startDateTime, existingTask.duration);
            if (
                (task.startDateTime >= existingTask.startDateTime && task.startDateTime < taskEndDateTime) ||
                (newTaskEndDateTime > existingTask.startDateTime && newTaskEndDateTime < taskEndDateTime) ||
                (task.startDateTime <= existingTask.startDateTime && newTaskEndDateTime >= taskEndDateTime)) {
                conflictingTasks.push(existingTask);
            }
        }
    })
    return conflictingTasks;
}


function createCsvFile () {
    const days = parseInt(document.getElementById('day-range').value);
    let csvText = 'Time-Frame, Pickup, Drop-off, Other';
    let pickup = 0;
    let dropoff = 0;
    let other = 0;
    let currentDate = new Date(firstDayOfWeek);
    let endDate = addDays(currentDate, 52*7);

    while (currentDate < endDate) {
        pickup = 0;
        dropoff = 0;
        other = 0;

        let intervalEndDate = addDays(currentDate, days);
        for (let i = 0; i < currentDriver.tasks.length; i++ ){
           let task = currentDriver.tasks[i];
           if (task.startDateTime >= currentDate && task.startDateTime < intervalEndDate){
               if (task.type == 'Pickup') {
                   pickup++;
               } else if (task.type == 'Dropoff') {
                   dropoff++;
               } else {
                   other++;
               }
            }
        }
        csvText = csvText + `\n${months[currentDate.getMonth()]} ${currentDate.getDate()} - ${months[intervalEndDate.getMonth()]} ${intervalEndDate.getDate()},${pickup},${dropoff},${other}`;
        currentDate = addDays(currentDate, days);
    }

    console.log(csvText);
    download('DriverTaskReport.csv', csvText);
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




