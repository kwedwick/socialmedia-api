const { User } = require('../models');
const { db } = require('../models/User');

const userController = {
    // gets all users
    getAllUsers(req, res) {
        User.find({})
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .populate(
                {
                    path: 'friends',
                    select: '-__v',
                })
            .select('-__v')
            .sort({ username: 1 })
            .then(dbUsers => res.json(dbUsers))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // get user by id
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .populate(
                {
                    path: 'friends',
                    select: '-__v',
                })
            .select('-__v')
            .then(dbUsers => {
                if (!dbUsers) {
                    res.status(404).json({ message: 'No User by that ID!' });
                    return;
                }
                res.json(dbUsers);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // create user
    createUser({ body }, res) {
        User.create(body)
            .then(dbUsers => res.json(dbUsers))
            .catch(err => res.status(400).json(err));
    },

    //may need req.params.XXX
    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $push: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
            .select('-__v')
            .then(dbUsers => {
                if (!dbUsers) {
                    res.json(404).json({ message: 'No User by that id!' });
                    return;
                }
                res.json(dbUsers);
            })
            .catch(err => res.json(err));
    },

    // update user by id
    updateUser({ params, body }, res) {
        User.findByIdAndUpdate(
            { _id: params.id },
            body,
            { new: true, runValidators: true }
        )
            .select('-__v')
            .then(dbUsers => {
                if (!dbUsers) {
                    res.json(404).json({ message: 'No User by that ID!' });
                    return;
                }
                res.json(dbUsers)
            })
            .catch(err => res.status(400).json(err));
    },


    // delete user
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then(dbUsers => {
                if (!dbUsers) {
                    res.status(404).json({ message: 'No User by that ID!' });
                    return;
                }
                res.json(dbUsers);
            })
            .catch(err => res.status(400).json(err));
    },
    // req.params.XXX
    deleteFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true }
        )
            .select('-__v')
            .then(dbUsers => res.json(dbUsers))
            .catch(err => res.json(err));
    }
};

module.exports = userController;