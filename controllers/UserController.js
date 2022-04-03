const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const crypto = require('crypto')
const passport = require('passport')


function genPassword(password) {
    const salt = crypto
        .randomBytes(32)
        .toString('hex');
    const hash = crypto
        .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
        .toString('hex')
    
    return [salt, hash]
  }

  
exports.welcome = [
    function (req, res, next) {
    if (req.isAuthenticated()) {
       res.redirect('/dashboard')
    } else {
        res.render('index', {
            title :'You are not authenticated'
        })
    }
}]

exports.login_get = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/')
    } else {
        res.render('login', {
        title: 'Login'
    }) 
    }
   
}

exports.login_post = passport.authenticate('local', {
    failureRedirect: '/credentialerror?name=login',
    successRedirect: '/'
})

exports.register_get = function (req, res, next) {
    if(req.isAuthenticated()) {
        res.redirect('/');
    } else {
          res.render('register', {
        title: 'Register'
    })
    }
  
}

exports.register_post = [
    body('username').custom(value => {
      return User.find({ username: value })
          .then(user => {
                if (user.length !== 0) {
                    throw new Error('This username has already taken !')
                }
                return true;
            })
    }).isLength({min:3}).withMessage('Username must be at least 3 chars long!'),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 4 chars long!'),
    body('password_confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords must be same !')
        }

        return true
    }),
    function (req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('register', {
                title: 'Register',
                errors : errors.array()
            })
            return;
        }
        const [salt, hash] = genPassword(req.body.password);

        const user = new User({
            username: req.body.username,
            hash,
            salt
        })

        user.save(function (err, user) {
            if (err) { return next(err) };
            res.redirect('/login');
        })
    }
]

exports.member_get = function (req, res, next) {
    if (req.isAuthenticated()) {
        if (!req.user.member) {
            res.render('member', {
                title: 'Member',
                user: req.user,
        
            });
        } else {
            res.redirect('/')
        } 
        
    } else {
        res.redirect('/');
    }  
}

exports.member_post = [
    body('member_passcode').isLength({min: 4}).withMessage('Passcode must be specified!'),
    function (req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('member', {
                title: 'Member',
                user: req.user,
                errors : errors.array()   
        }) 
            return;
        }


        if (req.body.member_passcode === process.env.MEMBER_PASSCODE) {
            const user = new User(req.user);
            user.member = true;
            user.save(function (err) {
                if (err) { return next(err) }
                res.redirect('/dashboard')
            })
        }
        else {
            res.redirect('/credentialerror?name=member');
        }
    

}
    
]

exports.admin_get = function (req, res, next) {
    if (req.isAuthenticated()) {
        if (!req.user.admin) {
            res.render('admin', {
                title: 'Admin',
                user: req.user,
                    
            });
        } else {
            res.redirect('/')
        }
             
    } else {
        res.redirect('/');
    }  
}

exports.admin_post = [
    body('admin_passcode').isLength({ min: 4 }).withMessage('Passcode must be specified!'),
    function (req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('member', {
                title: 'Admin',
                user: req.user,
                errors : errors.array()   
        }) 
            return;
        }


        if (req.body.admin_passcode === process.env.ADMIN_PASSCODE) {
            const user = new User(req.user);
            user.admin = true;
            user.save(function (err) {
                if (err) { return next(err) }
                res.redirect('/dashboard')
            })
        }
        else {
            res.redirect('/credentialerror?name=admin');
        }
    }
]