const { Router } = require("express");
const router = Router();
const _ = require("lodash");

const books = require("../books.json");

/**
 * Get all books, endpoint : /books
 */
router.get("/books", (req, res) => {
  res.status(200).json(books);
});

/**
 * Get books by authorId , endpoint : /books/:authorId
 */
router.get("/books/:authorId", (req, res) => {
  const myAuthorId = Number(req.params.authorId);
  let booksByAuthorId = {};
  if (isFinite(myAuthorId)) {
    booksByAuthorId = _.filter(books, (book) => {
      return Number(book.authorId) == myAuthorId;
    });
    res.status(200).json(booksByAuthorId);
  } else {
    res
      .status(400)
      .json({ statusCode: "Bad request, {authorId} is not a number" });
  }
});

/**
 * Post new book , endoint : /books
 * id auto-increments
 */
router.post("/books", (req, res) => {
  const { name, authorId } = req.body;
  if (name && authorId) {
    const newBook = { ...req.body };
    newBook.id = String(books.length + 1);
    books.push(newBook);
    res.status(201).json({ added: "ok" });
  } else {
    res.status(400).json({ statusCode: "Bad request" });
  }
});

/**
 * Delete a book by id
 */
router.delete("/books/:id", (req, res) => {
  const bookId = Number(req.params.id);
  if (isFinite(bookId)) {
    _.remove(books, (book) => {
      return Number(book.id) == bookId;
    });
    res.status(200).json({ statusCode: `book {id:${bookId}} deleted` });
  } else {
    res
      .status(400)
      .json({ statusCode: "Bad request, {bookId} is not a number" });
  }
});

/**
 * Modify by bookId
 */
router.put("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const { name, authorId } = req.body;
  if (isFinite(id)) {
    _.each(books, (book) => {
      if (Number(book.id) === id) {
        book.name = name;
        book.authorId = authorId;
      }
    });
    res.status(200).json({ books });
  } else {
    res
      .status(400)
      .json({ statusCode: "Bad request, {bookId} is not a number" });
  }
});

module.exports = router;

/*
{
  "id": "1",
  "name": "The Fellowship of the ring",
  "authorId": "1"
}
*/
