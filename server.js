const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(express.static('.'));
app.use(bodyParser.json());

const books = [];

var sqlite3 = require('sqlite3').verbose();

// open database in memory
const dbPath = path.resolve(__dirname, './server.sqlite3')
let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-rmemoy SQlite database.');
});
app.get(function(req, res){
    db.run('INSERT INTO books(author, title, genre, price) VALUES(req.params.author, req.params.title, req.params.genre, req.params.price)', ['C'], function(err) {
        if (err) {
          return console.log(err.message);
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
});
db.each("SELECT * FROM books", function(err, row){
    if (!err){
        console.log(JSON.stringify(row));//ektipni
        books.push(row);//vali ta sto books
    }
});


app.get('/getBooks',function(req, res){
    res.send(books);
});

app.post('/addBook', function(req, res){
    console.log(JSON.stringify(req.body));
    books.push(req.body);
    res.send();
});

app.get('/getBook/:title', function(req,res){
    let result = {message:'not found'};
    for(let i=0;i<books.length;i++){
        if (books[i].id == req.params.id){
            result = books[i];
            break;
        }
    }
    res.send(result);
});

/*
// close the database connection
db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });
*/

app.listen(3000);