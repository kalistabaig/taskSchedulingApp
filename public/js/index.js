const taskCells = document.getElementsByClassName('cell');
const month_element = document.getElementsByClassName("month")[0];
const next_month_element = document.getElementById("nextMonth");
const prev_month_element = document.getElementById("prevMonth");
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
let selectedCell;

//Get the current Days date
let currentDate = new Date();
let currentDay = currentDate.getDate();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

//display the current month and year
month_element.innerHTML = months[currentMonth] + ' ' + currentYear;

//When the page loads the selected date witll alwasy start as being the current days date
let selectedDate =  currentDate;
let selectedDay = currentDay;
let selectedMonth = currentMonth;
let selectedYear = currentYear;

//add event listener to each cell such that when it is clicked the add task form pops up
for (let i = 0; i < taskCells.length; i++ ) {
    taskCells[i].addEventListener('click', openForm);
}

// add event listener to arrows so when they are clicked it changes the dates 
next_month_element.addEventListener('click', changeMonth);
prev_month_element.addEventListener('click', changeMonth);

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

