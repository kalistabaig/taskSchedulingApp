const express = require('express')
const mustacheExpress = require('mustache-express')
const app = express()
const port = 3500

app.use(express.static('public'))
app.engine('mustache', mustacheExpress()) //setting view engine mustace
app.engine('mustache', mustacheExpress(__dirname + '/views/partials', '.mustache'));
app.set('view engine', 'mustache')
app.set('views', __dirname + '/views')

app.get('/', (req, res) => {
    res.render('index.mustache');
})

app.listen(port, () => console.log(`Example app listening at port ${port}`))