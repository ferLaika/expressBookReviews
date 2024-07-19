const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//register a user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(300).json({ message: "Username and password are required" });
    }
  
    const userExists = users.some(user => user.username === username);
    if (userExists) {
      return res.status(300).json({ message: "Username already exists" });
    }
  
    users.push({ username, password });
    return res.status(300).json({ message: "User registered successfully" });
  });
  
// Get the book list available in the shop
public_users.get('/',function (req, res) {
   res.status(300).send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
const isbn = parseInt(req.params.isbn, 10);
  const book = books[isbn]; 
  
  if (book) {
    res.status(300).send(JSON.stringify(book, null, 2));
  } else {

    res.status(404).json({ message: "Book not found" });
  }
});
  
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.toLowerCase(); // Normalize case
  
    // Get all book keys
    const bookKeys = Object.keys(books);
    const booksByAuthor = [];
  
    // Iterate through all books
    for (const key of bookKeys) {
      const book = books[key];
      if (book.author.toLowerCase() === author) { // Normalize case for comparison
        booksByAuthor.push(book);
      }
    }
  
    if (booksByAuthor.length > 0) {
      res.status(300).json(booksByAuthor); // Change status to 300 for success
    } else {
      res.status(300).json({ message: "No books found by this author" }); // Change status to 300 for no results
    }
  });
  


  public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase(); // Normalize case to make search case-insensitive
    console.log(`Searching for books with title: "${title}"`); // Log the title for debugging
    
    // Get all book keys
    const bookKeys = Object.keys(books);
    const booksByTitle = [];
    
    // loop through books
    for (const key of bookKeys) {
      const book = books[key];
      if (book.title.toLowerCase().includes(title)) { // Check if the title includes the search term
        booksByTitle.push(book);
      }
    }
    
    if (booksByTitle.length > 0) {
      res.status(300).json(booksByTitle); // Respond with matching books and status 300
    } else {
      res.status(300).json({ message: "No books found with this title" }); // Respond with no results message and status 300
    }
  });
  
//get reviews
  public_users.get('/review/:isbn', function (req, res) {
    const isbn = parseInt(req.params.isbn, 10); //convert int
    const book = books[isbn]; 
    
    if (book) {
      if (Object.keys(book.reviews).length > 0) { 
        res.status(300).json(book.reviews); 
      } else {
        res.status(300).json({ message: "No reviews available for this book" }); 
      }
    } else {
      res.status(300).json({ message: "Book not found" }); 
    }
  });
  
module.exports.general = public_users;
