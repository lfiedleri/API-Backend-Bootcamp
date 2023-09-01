const express = require('express');
const router = express.Router();

const {
    findUserById,
    findAllUser,
    updateUserById,
    deleteUserById
} = require('../controllers/user.controller');

// http://localhost:3000/api/user/1
router.get('/:id', findUserById);

// http://localhost:3000/api/user
router.get('/', findAllUser);


/* http://localhost:3000/api/user/1
body:
{
    "firstName": "Linda",
    "lastName": "Fiedler"
}
*/
router.put('/:id', updateUserById);

// http://localhost:3000/api/user/1
router.delete('/:id', deleteUserById);

module.exports = router;