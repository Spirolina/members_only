var express = require('express');
var router = express.Router();
const UserController = require('../controllers/UserController');
const MessageController = require('../controllers/MessageController');
const AuthController = require('../controllers/AuthController');

/* GET home page. */
router.get('/', UserController.welcome);
router.get('/login', UserController.login_get);
router.post('/login', UserController.login_post);

router.get('/register', UserController.register_get);
router.post('/register', UserController.register_post);

router.get('/dashboard', MessageController.dashboard);
router.post('/dashboard', MessageController.dashboard_post);

router.get('/member', UserController.member_get);
router.post('/member', UserController.member_post)

router.get('/admin', UserController.admin_get);
router.post('/admin', UserController.admin_post);


router.get('/credentialerror', AuthController.wrongCredential);
router.post('/credentialerror', AuthController.wrongCredential_post);


module.exports = router;
