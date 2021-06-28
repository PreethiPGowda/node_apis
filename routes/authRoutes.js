const { Router } = require('express');
const authController = require('../controllers/authController');
const { checkToken } = require('../middleware/tokenAuth');

const router = Router();

router.post('/signup', authController.signup_post);

router.post('/login', authController.login_post);

router.get('/details',checkToken, authController.get_user);

router.patch('/update', checkToken, authController.update_user);

router.patch('/update/password', checkToken, authController.update_password);

router.get('/search',checkToken, authController.search_user);


module.exports = router;