const fs = require('fs'); //file system - used to interat with file system on computer
const databaseFilename =  './database/database.json'
const db = loadDatabase();

function loadDatabase() {
    try {
        return JSON.parse(fs.readFileSync(databaseFilename))
    } catch (err) {
        console.error(err)
    }
}

function saveDatabase() {
    fs.writeFileSync(databaseFilename, JSON.stringify(db, null, 2))
}

exports.addtask = function(newTask) {
    newTask.id = getNewId();
    articles.push(newTask);
    saveDatabase();
}

function getNewId() {
    let i;
    let biggestId = 0;

    for (i = 0; i < articles.length; i++) {
        if (articles[i].id > biggestId) {
            biggestId = articles[i].id;
        }
    }
    let newId = biggestId + 1;

    return newId;
}