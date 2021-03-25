const { response } = require('../helpers/response');
const User = require('../Models/User');
const createError = require('http-errors');
const bcrypt = require('bcryptjs');


module.exports = {
    getUserDetails: async (req, res, next) => {
        try {
            const username = req.params.username;
            const user = await User.findOne({ username: username });
            if (!user) return res.status(400).send(response(400, 'Username Not Found', null));
            const finalUser = {
                username: user.username,
                followers: user.followers,
                following: user.following,
                posts: user.post
            };
            return res.status(200).send(response(200, 'OK', finalUser));
        } catch (err) {
            console.log(err.message);
            next(createError.InternalServerError());
        }
    },
    createUser: async (req, res, next) => {
        try {

            const { username } = req.body;
            if (!username) return res.status(400).send(response(400, 'All fields are required', null));

            //Username Exist Check
            const usernameExist = await User.findOne({ username: username });
            if (usernameExist) return res.status(400).send(response(400, 'Username Already Exists', null));

            //Create User
            const user = new User({
                username: username
            });

            const savedUser = await user.save();

            if (savedUser != undefined && savedUser != null) {
                return res.status(201).send(response(201, 'OK', username + " account created."));
            }
        } catch (err) {
            console.log(err.message);
            return res.status(400).send(response(400, 'Something went wrong :(', null));
        }
    },
    followUser: async (req, res, next) => {
        try {

            const fromUsername = req.params.fromUsername;
            const toUsername = req.params.toUsername;

            //fromUsername Exist Check
            const fromUsernameExist = await User.findOne({ username: fromUsername });
            if (!fromUsernameExist) return res.status(400).send(response(400, 'Requestor username doesn\'t Exists', null));

            //toUsername Exist Check
            const toUsernameExist = await User.findOne({ username: toUsername });
            if (!toUsernameExist) return res.status(400).send(response(400, 'Target username doesn\'t Exists', null));

            //adding following in requestor
            let requestorFollowing = [];
            let buffer = fromUsernameExist.following;
            if (buffer.length != 0) {
                if (buffer.includes(toUsername)) return res.status(202).send(response(202, 'You already follow the target', "success"));
            }

            requestorFollowing.push(toUsername);
            let i = 0;
            for (i in buffer) {
                requestorFollowing.push(buffer[i]);
            }
            let requestorEntry = await User.updateOne({ username: fromUsername }, { following: requestorFollowing }, null);

            //adding follower in target
            let targetFollower = [];
            let buffer2 = toUsernameExist.followers
            if (buffer2.length != 0) {
                if (buffer2.includes(fromUsername)) return res.status(202).send(response(202, 'You already follow the target', "success"));
            }
            targetFollower.push(fromUsername);
            let j = 0;
            for (j in buffer2) {
                targetFollower.push(buffer2[j]);
            }
            let targetEntry = await User.updateOne({ username: toUsername }, { followers: targetFollower }, null);

            return res.status(202).send(response(202, fromUsername + ' is following to ' + toUsername, "success"));


        } catch (err) {
            console.log(err.message);
            return res.status(400).send(response(400, 'Something went wrong :(', null));
        }
    },
    addPost: async (req, res, next) => {
        try {

            const username = req.params.username;

            //username Exist Check
            const user = await User.findOne({ username: username });
            if (!user) return res.status(400).send(response(400, 'username doesn\'t Exists', null));

            //verifying body
            const { caption, imageUrl } = req.body;
            if (!caption || !imageUrl) return res.status(400).send(response(400, 'All fields are required', null));

            let post = [];
            let buffer = user.post;

            let i = 0;
            for (i in buffer) {
                post.push(buffer[i]);
            }

            postToAdd = {
                "postId": post.length + 1,
                "caption": caption,
                "imageUrl": imageUrl,
                "upvotes": 0
            }
            post.push(postToAdd);

            User.updateOne(
                { username: username },
                { post: post },
                null,
                (err, _) => {
                    if (err) {
                        console.log('Error while updating user object')
                        console.log(err);
                        res.status(400).send(response(400, err.message, null));
                    }

                    return res.status(201).send(response(201, "Post added successfully", postToAdd));

                });

        } catch (err) {
            console.log(err.message);
            return res.status(400).send(response(400, 'Something went wrong :(', null));
        }
    },
}