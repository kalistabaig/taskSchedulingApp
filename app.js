const express = require('express')
const mustacheExpress = require('mustache-express')
// const database = require('./database')
const bodyParser = require('body-parser');
const app = express()
const port = 3000

const database = [];

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:false}))
app.engine('mustache', mustacheExpress()) //setting view engine mustace
app.engine('mustache', mustacheExpress(__dirname + '/views/partials', '.mustache'));
app.set('view engine', 'mustache')
app.set('views', __dirname + '/views')

app.get('/', (req, res) => {
    res.render('index.mustache');
})

app.post('/addTask', (req, res) => {
    console.log(req.body);
    // const newTask = {
    //     id: 0,
    //     type:
    //     date:
    //     time:
    //     duration:
    //     location:
    // }
    const newTaskDate = req.body.date;
    const newTaskTime = req.body.time;
    const validTask = checkTask(newTaskDate, newTaskTime, driverId);

    if (validTask == -1) {
        database.push(newTask);
    }else{
        alert("Currently there exists a task already scheduled for this time on this date. Pre existing task:" + validTask + "You can choose to delte this task or chnage the time on the new task");
    }
})

app.get('/displayDriverTaskSheet', (req, res) => {
    let driverValue  = rew.body.radiobtn;
    

})

function checkTask(newTaskDate, newTaskTime, driverId){
    for (let i = 0; i < database.length; i++) {
        if (database[i].id == driverId) {
            for (let k = 0; k < database[i].tasks.length; k++) {
                database[i].tasks.findIndex( task => {
                    return task.date == newTaskDate && task.time == newTaskTime;
                })
            }
        }
    }  
}


app.listen(port, () => console.log('Example app listening at port 3000'))