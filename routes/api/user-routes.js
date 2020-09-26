const router = require('express').Router();

const {
    getAllUsers,
    getUserById,
    createUser,
    addFriend,
    updateUser,
    deleteUser,
    deleteFriend
} = require('../../controllers/user-controller');


// simple get and create
router
.route('/')
.get(getAllUsers)
.post(createUser);

//id routes
router
.route('/:id')
.get(getUserById)
.put(updateUser)
.delete(deleteUser)

// delete friend
router
.route('/:userId/friends/:friendId')
.post(addFriend)
.delete(deleteFriend)



module.exports = router;