const express = require('express');
const router = express.Router();
const snippetController = require('../controllers/snippetController');
const auth = require('../middleware/authMiddleware');

// public list
router.get('/', snippetController.list);

// public or owner get
router.get('/:id', auth, snippetController.getOne);

// protected create/update/delete/fork
router.post('/', auth, snippetController.create);
router.put('/:id', auth, snippetController.update);
router.delete('/:id', auth, snippetController.remove);
router.post('/:id/fork', auth, snippetController.fork);

module.exports = router;
