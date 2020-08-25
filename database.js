const fs = require('fs'); //file system - used to interat with file system on computer
const databaseFilename =  './database/database.json'
const drivers = loadDatabase();

function loadDatabase() {
    try {
        return JSON.parse(fs.readFileSync(databaseFilename))
    } catch (err) {
        console.error(err)
    }
}


function saveDatabase() {
    fs.writeFileSync(databaseFilename, JSON.stringify(drivers, null, 2))
}

function getNewId(driver) {
    let i;
    let biggestId = 0;
    for (i = 0; i < driver.tasks.length; i++) {
        if (driver.tasks[i].id > biggestId) {
            biggestId = driver.tasks[i].id;
        }
    }
    let newId = biggestId + 1;
    return newId;
}

function editTask(existingTask, task) {
    existingTask.startDateTime = task.startDateTime;
    existingTask.duration = task.duration;
    existingTask.location = task.location;
    existingTask.type = task.type;
    existingTask.description = task.description;
}

exports.saveTask = (task, driverId) => {
    const driver = exports.getDriver(driverId);
    console.log(driver);
    let dbTask;
    if (task.id === null) {
        dbTask = {};
        dbTask.id = getNewId(driver);
        driver.tasks.push(dbTask);
    } else {
        dbTask = driver.tasks.find(aTask => aTask.id === task.id);
    }
    editTask(dbTask,task);
    saveDatabase();
    return dbTask;
}

exports.getDriver = (id) => {
    return drivers.find(driver => driver.id === id);
}

exports.getDrivers = () => drivers;

exports.deleteTask = (driverId, taskId) => {
    const driver = exports.getDriver(driverId);
    const taskIndex = driver.tasks.findIndex(aTask => aTask.id === taskId);
    driver.tasks.splice(taskIndex, 1);
    saveDatabase();
}

