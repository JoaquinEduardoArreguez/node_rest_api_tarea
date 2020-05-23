const { Router } = require("express");
const router = Router();
const _ = require("lodash");

const authors = require("../authors.json");
const books = require("../books.json");

/**
 * Get all authors
 */
router.get("/authors", (req, res) => {
  res.json(authors);
});

/**
 * Post new author, id auto-increments
 */
router.post("/authors", (req, res) => {
  const { name, lastname } = req.body;
  if (name && lastname) {
    const newAuthor = { ...req.body };
    newAuthor.id = String(authors.length + 1);
    authors.push(newAuthor);
    res.status(201).json({ added: "ok" });
  } else {
    res.status(400).json({ statusCode: "Bad req" });
  }
});

/**
 * Modify by authorId
 */
router.put("/authors/:id", (req, res) => {
  const id = Number(req.params.id);
  const { name, lastname } = req.body;
  if (isFinite(id)) {
    _.each(authors, (author) => {
      if (Number(author.id) === id) {
        author.name = name;
        author.lastname = lastname;
      }
    });
    res.status(200).json({ authors });
  } else {
    res
      .status(400)
      .json({ statusCode: "Bad request, {authorId} is not a number" });
  }
});

/**
 * Delete an author by id if no books asociated
 */

router.delete("/authors/:id", (req, res) => {
  const authorId = Number(req.params.id);
  if (isFinite(authorId)) {
    const hasBooks = books.some((book) => {
      return book.authorId === req.params.id;
    });
    if (hasBooks) {
      res.status(400).json({
        statusCode: `Author {id:${authorId}} has books asociated,delete them first`,
      });
    } else {
      _.remove(authors, (author) => {
        return Number(author.id) == authorId;
      });
      res.status(200).json({ statusCode: `Author {id:${authorId}} deleted` });
    }
  } else {
    res
      .status(400)
      .json({ statusCode: "Bad request, {authorId} is not a number" });
  }
});

/**
 * Delete an author by id , and it's associated books.
 */

router.delete("/authors/:id/:deleteBooks", (req, res) => {
  const authorId = Number(req.params.id);
  const deleteBooks = req.params.deleteBooks;

  if (isFinite(authorId) && deleteBooks) {
    const hasBooks = books.some((book) => {
      return book.authorId === req.params.id;
    });
    if (hasBooks && deleteBooks !== "true") {
      res
        .status(400)
        .json({
          statusCode: `{AuthorId:${authorId}} has books asociated, delete them first or send /authors/:id/true`,
        });
    } else {
      _.remove(authors, (author) => {
        return Number(author.id) == authorId;
      });
      _.remove(books, (book) => {
        return Number(book.authorId) == authorId;
      });
      res
        .status(200)
        .json({ statusCode: `{AuthorId:${authorId}} and it's books deleted` });
    }
  } else {
    res
      .status(400)
      .json({
        statusCode:
          "Bad request, {authorId} is not a number or {deleteBooks} != 'true'",
      });
  }
});

module.exports = router;
