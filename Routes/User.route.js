const router = require('express').Router();
const UserController = require('../Controller/User.Controller');

router.get('/get-user/:username', UserController.getUserDetails);

router.post('/create-user', UserController.createUser);

router.post('/follow/:fromUsername/:toUsername', UserController.followUser);

router.post('/create-post/:username', UserController.addPost);



module.exports = router;