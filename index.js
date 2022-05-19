require('dotenv').config()

const express = require('express')
const session = require('express-session');
const app = express()
var mysql = require('mysql');

app.set('views', './views');
app.set('view engine', 'pug');

app.use(session({
  secret: process.env.MY_SECRET,
  resave: true,
  saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASS,
  database: "mydb",
  multipleStatements: true
});

con.connect(function (err) {
  if (err) throw err;
  console.log("MySQL Connected!");
});

app.get('/', async (req, res) => {
  res.render('index');
});

app.post('/auth', async (req, res) => {

  /* Method 1 to prevent SQL injection */
  // var sql = "SELECT * FROM Users WHERE username = " + mysql.escape(req.body.username) + " AND password = " + mysql.escape(req.body.password);

  var sql = `SELECT * FROM Users WHERE username = '${req.body.username}' AND password = '${req.body.password}'`;
  con.query(sql, await function (err, result, fields) {
    if (err) {
      console.log(err);
      return res.status(500).render('error_500');
    }
    if (result.length > 0) {
      req.session.loggedin = true;
      req.session.username = req.body.username;
      res.redirect('/dashboard');
    } else {
      res.render('index', { message: "Password Incorrect" });
    }
    console.log(sql);
    console.log("-------------------------");
  });

  /* Method 2 to prevent SQL injection */
  // con.query("SELECT * FROM Users WHERE username = ? AND password = ?", 
  //   [req.body.username, req.body.password],
  //   await function (err, result, fields) {
  //   if (err) throw err;
  //   if (result.length > 0) {
  //     req.session.loggedin = true;
  //     req.session.username = req.body.username;
  //     res.redirect('/dashboard');
  //   } else {
  //     res.render('index', {message: "Password Incorrect"});
  //   }			
  // });
});

app.get('/dashboard', async (req, res) => {
  if (req.session.loggedin) {
    con.query("SELECT * FROM Students", await function (err, result, fields) {
      if (err) throw err;
      res.render('dashboard', { students: result, username: req.session.username });
    });
  } else {
    res.redirect('/');
  }
});

app.post('/dashboard', async (req, res) => {
  // var sql = "SELECT * FROM customers WHERE name = " + mysql.escape(req.body.name);
  var sql = `SELECT * FROM Students WHERE studentID = '${req.body.name}'`;

  console.log(sql);
  con.query(sql, await function (err, result, fields) {
    if (err) {
      console.log(err);
      return res.status(500).render('error_500');
    }
    console.log("-------------------------");
    res.render('dashboard', { students: result });
  });

})

app.get('/error', async (req, res) => {
  res.render('error');
});

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})