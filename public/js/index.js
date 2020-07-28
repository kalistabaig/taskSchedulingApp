const gridElement = document.getElementsByClassName('day-grid')[0];
const month_element = document.getElementsByClassName("month")[0];
const todayButton = document.getElementsByClassName('todayBtn')[0];
const next_week_element = document.getElementById("nextWeek");
const prev_week_element = document.getElementById("prevWeek");
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const weekDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
let selectedCell;
let firstDayOfWeek;
const numMilliSecondsInDay = 24*60*60*1000;
const database = [
    {   name: "Kali",
        id: 0,
        tasks: []
    },
    {
        name: "Karisma",
        id: 1,
        tasks: []
    },
    {
        name: "Matthew",
        id: 2,
        tasks: []
    }
     
];

// add event listener to arrows so when they are clicked it changes the dates 
next_week_element.addEventListener('click', changeWeek);
prev_week_element.addEventListener('click', changeWeek);
todayButton.addEventListener('click', toCurrentDate);


toCurrentDate();

//Functions

function openDownloadForm(e) {
    document.getElementById("download-form").style.display = "block";
}

function closeDownloadForm(e) {
    document.getElementById("download-form").style.display = "none";
}

function openForm(e) {
    document.getElementById("myForm").style.display = "block";
    selectedCell = e.target;
    const startDateTime = new Date(parseInt(selectedCell.dataset.startDateTime))
    document.getElementsByClassName('date-text')[0].innerHTML = startDateTime.toLocaleDateString();
    document.getElementsByClassName('task-time')[0].innerHTML = startDateTime.toLocaleTimeString();
    if (document.getElementsByClassName('selected-cell').length > 0) {
        document.getElementsByClassName('selected-cell')[0].classList.remove('selected-cell');
    }
    selectedCell.classList.add('selected-cell');
}

function closeForm() {
    selectedCell.style = "background: white";
    document.getElementById("myForm").style.display = "none";
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


    updatePage();
}

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
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
        for (let hour = 0; hour < 24; hour++) {
            const cell = document.createElement('div');
            cell.classList = "day-cell"; 
            weekday.setHours(hour,0,0,0);
            cell.dataset.startDateTime = weekday.valueOf(); //cant pass a date object in html
            cell.addEventListener('click', openForm);
            gridElement.appendChild(cell);
        }

    }
}

function addTask(date, time, timeInterval, location, type) {
    const newTask = 
    {
        id: getNewId(),
        date: date,
        time: time,
        duration: timeInterval,
        location: location,
        type: type
    }
    console.log(newTask);

    return(false);

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
    updatePage();
}

// function getNewId() {
//     let i;
//     let biggestId = 0;

//     for (i = 0; i < articles.length; i++) {
//         if (articles[i].id > biggestId) {
//             biggestId = articles[i].id;
//         }
//     }
//     let newId = biggestId + 1;

//     return newId;
// }

// function checkTask(newTaskDate, newTaskTime, driverId){
//     for (let i = 0; i < database.length; i++) {
//         if (database[i].id == driverId) {
//             for (let k = 0; k < database[i].tasks.length; k++) {
//                 database[i].tasks.findIndex( task => {
//                     return task.date == newTaskDate && task.time == newTaskTime;
//                 })
//             }
//         }
//     }  
// }


