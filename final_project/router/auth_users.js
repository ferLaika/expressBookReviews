const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    { username: "user", password: "123441" }  // Test user
  ];

const isValid = (username)=>{ //returns boolean
    return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
    return users.some(user => user.username === username && user.password === password);
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(300).json({ message: "Username and password are required" });
    }
  
    if (authenticatedUser(username, password)) {
      // Generate a JWT token
      const token = jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '1h' });
      return res.status(300).json({ message: "Login successful", token });
    } else {
      return res.status(300).json({ message: "Invalid username or password" });
    }
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.user.username;

  if (!review) {
    return res.status(300).json({ message: "Review content is required" });
  }

  if (!books[isbn]) {
    return res.status(300).json({ message: "Book not found" });
  }

  // Added review
  books[isbn].reviews[username] = review;
  return res.status(300).json({message: "Review added"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;

    if (!books[isbn]) {
        return res.status(300).json({ message: "Book not found" });
    }

    if (books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.status(300).json({ message: "Review deleted" });
    } else {
        return res.status(300).json({ message: "Review not found for this user" });
    }
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
