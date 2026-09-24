const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");

let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// ==========================================
// TASK 7 - Register a new user
// ==========================================

public_users.post("/register", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: "User already exists"
    });
  }

  users.push({
    username: username,
    password: password
  });

  return res.status(200).json({
    message: "User successfully registered"
  });

});


// ==========================================
// TASK 2 - Get all books using Axios
// ==========================================

public_users.get('/', async function (req, res) {

  try {

    const response = await axios.get('http://localhost:5001/internal/books');

    return res.status(200).json(response.data);

  } catch (error) {

    return res.status(500).json({
      message: "Unable to retrieve books"
    });

  }

});


// Internal route used by Axios
public_users.get('/internal/books', function (req, res) {

  return res.status(200).json(books);

});


// ==========================================
// TASK 3 - Get book by ISBN using Axios
// ==========================================

public_users.get('/isbn/:isbn', async function (req, res) {

  const isbn = req.params.isbn;

  try {

    const response = await axios.get(
      `http://localhost:5001/internal/books/${isbn}`
    );

    return res.status(200).json(response.data);

  } catch (error) {

    return res.status(404).json({
      message: "Book not found"
    });

  }

});


// Internal ISBN route
public_users.get('/internal/books/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }

  return res.status(404).json({
    message: "Book not found"
  });

});


// ==========================================
// TASK 4 - Get books by Author using Axios
// ==========================================

public_users.get('/author/:author', async function (req, res) {

  const author = req.params.author;

  try {

    const response = await axios.get(
      `http://localhost:5001/internal/books/author/${encodeURIComponent(author)}`
    );

    return res.status(200).json(response.data);

  } catch (error) {

    return res.status(404).json({
      message: "Book not found"
    });

  }

});


// Internal author route
public_users.get('/internal/books/author/:author', function (req, res) {

  const author = req.params.author;

  const result = {};

  for (let key in books) {

    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      result[key] = books[key];
    }

  }

  if (Object.keys(result).length > 0) {
    return res.status(200).json(result);
  }

  return res.status(404).json({
    message: "Book not found"
  });

});


// ==========================================
// TASK 5 - Get books by Title using Axios
// ==========================================

public_users.get('/title/:title', async function (req, res) {

  const title = req.params.title;

  try {

    const response = await axios.get(
      `http://localhost:5001/internal/books/title/${encodeURIComponent(title)}`
    );

    return res.status(200).json(response.data);

  } catch (error) {

    return res.status(404).json({
      message: "Book not found"
    });

  }

});


// Internal title route
public_users.get('/internal/books/title/:title', function (req, res) {

  const title = req.params.title;

  const result = {};

  for (let key in books) {

    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      result[key] = books[key];
    }

  }

  if (Object.keys(result).length > 0) {
    return res.status(200).json(result);
  }

  return res.status(404).json({
    message: "Book not found"
  });

});


// ==========================================
// TASK 6 - Get book review
// ==========================================

public_users.get('/review/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  if (books[isbn]) {

    return res.status(200).json(books[isbn].reviews);

  }

  return res.status(404).json({
    message: "Book not found"
  });

});


module.exports.general = public_users;
