const express = require('express');
const router = express.Router();

const {
    createBootcamp,
    addUserToBootcamp,
    findById,
    findAllBootcamp
} = require('../controllers/bootcamp.controller');

const { verifyToken } = require('../middleware/');

// http://localhost:3000/api/bootcamp
router.get('/', findAllBootcamp);

// Aplicamos seguridad de aquí en adelante
router.use('/', verifyToken);

/**
http://localhost:3000/api/bootcamp
body:
{
    "title": "Bootcamp Fullstack Java",
    "cue": 16,
    "description": "Descripcion del bootcamp"
}
*/
router.post('/', createBootcamp);

/* http://localhost:3000/api/bootcamp/adduser
body:
{
    "idBootcamp": "1",
    "idUser": "3",
    
}
*/
router.post('/adduser', addUserToBootcamp);

// http://localhost:3000/api/bootcamp/1
router.get('/:id', findById);

module.exports = router;