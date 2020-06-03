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
db.each("SELECT * FROM books", function(err, row){
    if (!err){
        console.log(JSON.stringify(row));//ektipni
        books.push(row);//vali ta sto books
    }
});

app.post('/addBook', function(req, res){
    console.log(JSON.stringify(req.body));
    books.push(req.body);
    author=(req.body.author);
    title=(req.body.title);
    genre=(req.body.genre);
    price=(req.body.price);
    db.run('INSERT INTO books(id, author, title, genre, price) VALUES(null, ?, ?, ?, ?)', author,title,genre,price, function(err) {
        if (err) {
          return console.log(err.message);
        }
        console.log(`title: req.params.title`);
        console.log(`A book has been inserted in the database with rowid ${this.lastID}`);
    });
    res.send();
});
app.get('/getBooks',function(req, res){
    
    db.each("SELECT * FROM books", function(err, row){
        if (!err){
            console.log(JSON.stringify(row));//ektipni
            books.push(row);//vali ta sto books
        }
    });
    res.send(books);
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