/**
 * Created by ncl on 15. 8. 26.
 */
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

app.listen(55555, function(){
    console.log('This server is running on the port ' + this.address().port);
});

var bookStore = {
    bookShelf: {'1':{id:1, name:'aaa', price:2}, '2':{id:2, name:'bbb', price:5}},
    rentedBookList:{},
    totalAccount:0
};

app.get('/rentBook/:id', function(req, res){
    var bookID = req.params.id;
    var rentBook = bookStore.bookShelf[bookID];
    if(rentBook) {
        delete bookStore.bookShelf[bookID];
        bookStore.totalAccount += rentBook.price;
        bookStore.rentedBookList[bookID] = rentBook;
        res.json(rentBook);
    }else{
        res.json('Book does not exist!');
    }
});

app.get('/returnBook/:id', function(req, res){
    var bookID = req.params.id;
    var returnBook = bookStore.rentedBookList[bookID];
    if(returnBook){
        delete bookStore.rentedBookList[bookID];
        bookStore.bookShelf[bookID] = returnBook;
        res.json(returnBook);
    }else{
        res.json('Book does not exist!');
    }
});

app.post('/addBook', function(req, res){
    //var bookID = req.body.id;
    //var bookName = req.body.name;
    //var bookPrice = req.body.price;
    //bookStore.bookShelf[bookID]={id:bookID, name:bookName, price:bookPrice};
    bookStore.bookShelf[req.body.id]=req.body;
    res.json(bookStore);
});

app.get('/removeBook/:id', function(req, res){
    var bookID = req.params.id;
    var removeBook = bookStore.bookShelf[bookID];
    if(removeBook) {
        delete bookStore.bookShelf[bookID];
        res.json(bookStore);
    }else{
        res.json('Book does not exist!');
    }
});

app.get('/getAccount', function(req, res){
    res.json('Total account : ' + bookStore.totalAccount);
});

app.get('/getStatus', function(req, res){
    res.json(bookStore);
});

app.get('/test', function(req, res){
    res.send('ok');
});

app.post('/temp', function(req, res){
    console.log(req.body);
    res.send('received');
});