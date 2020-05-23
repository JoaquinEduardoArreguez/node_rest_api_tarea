const { Router } = require('express');
const router = Router();
const authors = require('./authors.route')
const books = require('./books.route')

router.use('/api', authors);
router.use('/api', books);

module.exports = router;
