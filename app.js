const express = require('express')
const mustacheExpress = require('mustache-express')
const database = require('./database');
const app = express()
const port = 3500

app.use(express.static('public'))
app.use(express.json())
app.engine('mustache', mustacheExpress()) //setting view engine mustace
app.engine('mustache', mustacheExpress(__dirname + '/views/partials', '.mustache'));
app.set('view engine', 'mustache')
app.set('views', __dirname + '/views')

app.get('/', (req, res) => {
    res.render('index.mustache', {drivers: database.getDrivers()});
})
//restful api
app.get('/api/drivers/:id', (req, res) => {
    const driver = database.getDriver(parseInt(req.params.id));
    res.json(driver);
})

app.post('/api/drivers/:currentDriverId/tasks', (req, res) => {
    const newTask = req.body;
    const savedTask = database.saveTask(newTask, parseInt(req.params.currentDriverId));
    res.json(savedTask);
})

app.delete('/api/drivers/:currentDriverId/tasks/:taskId', (req, res) => {
    database.deleteTask(parseInt(req.params.currentDriverId), parseInt(req.params.taskId));
    res.sendStatus(200);
})

app.listen(port, () => console.log(`Example app listening at port ${port}`))