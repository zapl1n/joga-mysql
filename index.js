// application packages
const express = require('express')
const app = express()

const path = require('path')
// add template engine
const hbs = require('express-handlebars');
// setup template engine directory and files extensions
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts/',
}))

// setup static public directory
app.use(express.static('public'));

const mysql = require('mysql')

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))

// create database connection
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "qwerty",
    database: "joga_mysql"
})

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to joga_mysql db");
})

// show all articles - index page
app.get('/', (req, res) => {
    let query = "SELECT * FROM article";
    let articles = []
    con.query(query, (err, result) => {
        if (err) throw err;
        articles = result
        res.render('index', {
            articles: articles
        })
    })
});

//show article by this slug
app.get('/article/:slug', (req, res) => {
    // let query = `SELECT * FROM article where slug = "${req.params.slug}"`
    let query = `select article.id, article.name, article.slug, article.image, article.body, article.published, author.name as author, author.id as author_id from article JOIN author ON article.author_id = author.id where slug = "${req.params.slug}";`
    let article
    con.query(query, (err, result) => {
        if (err) throw err
        article = result
        res.render('article', {
            article: article
        })
    })
});

// show articles by author
app.get('/author/:author_id', (req, res) => {
    let query = `select article.id, article.name, article.slug, article.image, article.body, article.published, author.name as author, author.id as author_id from article JOIN author ON article.author_id = author.id where author_id = "${req.params.author_id}";`
    // let query = `SELECT * FROM article where slug = "${req.params.slug}"`
    let articles = []
    let author
    con.query(query, (err, result) => {
        if (err) throw err
        articles = result
        author = result[0]
        res.render('author', {
            articles: articles,
            author: author
        })
    })
})

// app start point
app.listen(3000, () => {
    console.log('App is started at http://localhost:3000');
});