// import database connection
const con = require('./utils/db')

// show all articles - index page
const getAllArticles=(req, res) => {
    let query = "SELECT * FROM article";
    let articles = []
    con.query(query, (err, result) => {
        if (err) throw err;
        articles = result
        res.render('index', {
            articles: articles
        })
    })
};

//show article by this slug
const getArticleBySlug=(req, res) => {
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
};

// export controller functions
module.exports = {
    getAllArticles,
    getArticleBySlug
};