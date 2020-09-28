const { Thought, User } = require('../models');

const thoughtController = {
    //gets all thoughts from user
    getAllThoughts(req, res) {
        Thought.find({})
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .sort({ createdAt: -1 })
            .then(dbThoughts => res.json(dbThoughts))
            .catch(err => {
                console.log(err);
            })
    },


    //get thought by id from user
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .then(dbThoughts => {
                if (!dbThoughts) {
                    res.status(404).json({ message: 'No Thought by that ID!' });
                    return;
                }
                res.json(dbThoughts);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    //create thought
    createThought(req, res) {
        console.log(req.body);
        Thought.create(req.body)
            //.then(({ _id }) =>{
            .then(addThoughtToUser => {
                return User.findByIdAndUpdate(
                    { _id: req.body.userId },
                    { $push: { thoughts: addThoughtToUser._id } },
                    { new: true }
                )
            })
            .then(dbThoughts => {
                if (!dbThoughts) {
                    res.status(404).json({ message: 'No User found with this ID!' });
                    return;
                }
                res.json(dbThoughts);
            })
            .catch(err => res.json(err));
    },


    //add reaction
    addReaction({ params, body }, res) {
        Thought.findByIdAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true, runValidators: true }
        )
            .then(dbThoughts => {
                if (!dbThoughts) {
                    res.status(404).json({ message: 'No Thought with that ID!' });
                    return;
                }
                res.json(dbThoughts);
            })
            .catch(err => res.json(err));
    },


    //update thought
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.id },
            body,
            { new: true, runValidators: true }
        )
            .then(dbThoughts => {
                if (!dbThoughts) {
                    res.status(404).json({ message: 'No Thought with that ID!' });
                    return;
                }
                res.json(dbThoughts);
            })
            .catch(err => {
                console.log(err);
                res.status(404).json(err);
            });
    },

    //delete thought
    deleteThought({ params, body }, res) {
        Thought.deleteOne({ _id: params.id })
            .then(dbThoughtDeleted => {
                console.log(dbThoughtDeleted)
                if (dbThoughtDeleted.deletedCount === 0) {
                    res.status(404).json({ message: 'No Thought with that ID!' });
                    return;
                }
                return User.findByIdAndUpdate(
                    { _id: body.userId },
                    { $pull: { thoughts: params.id } },
                    { new: true, runValidators: true }
                )
            })
            .then(dbThoughts => {
                if (!dbThoughts) {
                    res.status(404).json({ message: 'Wrong/No User with that ID!' });
                    return;
                }
                res.json(dbThoughts);
            })
            .catch(err => {
                console.log(err);
                res.status(404).json(err);
            });
    },


    //delete reaction
    deleteReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
            .select('-__v')
            .then(dbThoughts => {
                console.log(dbThoughts);
                if (!dbThoughts) {
                    res.status(404).json({ message: 'No Reaction with that ID!' });
                    return;
                }
                res.json(dbThoughts);
            })
            .catch(err => {
                console.log(err);
                res.status(404).json(err);
            });
    }
};

module.exports = thoughtController;