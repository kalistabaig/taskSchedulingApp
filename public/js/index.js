const gridElement = document.getElementsByClassName('day-grid')[0];
const month_element = document.getElementsByClassName("month")[0];
const next_month_element = document.getElementById("nextMonth");
const prev_month_element = document.getElementById("prevMonth");
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const weekDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
let selectedCell;
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


//Get the current Days date
let currentDate = new Date();
let currentDay = currentDate.getDate();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
const firstDayOfWeek = new Date(currentDate.valueOf() - (currentDate.getDay()*numMilliSecondsInDay)); 

//display the current month and year
month_element.innerHTML = months[currentMonth] + ' ' + currentYear + currentDay;

//When the page loads the selected date witll alwasy start as being the current days date
let selectedDate =  currentDate;
let selectedDay = currentDay;
let selectedMonth = currentMonth;
let selectedYear = currentYear;

// add event listener to arrows so when they are clicked it changes the dates 
next_month_element.addEventListener('click', changeMonth);
prev_month_element.addEventListener('click', changeMonth);


populateGrid();

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
    selectedCell.style = "background: lavender";

}

function closeForm() {
    selectedCell.style = "background: white";
    document.getElementById("myForm").style.display = "none";
}

function changeMonth(e) {
    let arrowClass = (e.target.className).split(" ")[1];
   
    if (arrowClass == 'next-month') {
        currentMonth++;
        if (currentMonth == 12) {
            currentMonth = 0;
            currentYear++;
        }
        month_element.innerHTML = months[currentMonth] + ' ' + currentYear;


        console.log("next month arrow clicked");
    } else if (arrowClass == "prev-month") {
        currentMonth--;
        if (currentMonth == -1) {
            currentMonth = 11;
            currentYear--;
        }
        month_element.innerHTML = months[currentMonth] + ' ' + currentYear;
        console.log("previous month arrow clicked");
    }else {
        return -1;
    }
}

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function populateGrid() {

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

// function addTask(date, time, timeInterval, location, type) {
//     const newTask = 
//     {
//         id: getNewId(),
//         date: date,
//         time: time;
//         duration: timeInterval,
//         location: location,
//         type: type
//     }
//     if (checkTask(newTask)) {
//     }

// }

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


