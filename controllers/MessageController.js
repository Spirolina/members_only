const Message = require('../models/Message')
const User = require('../models/User')

exports.dashboard = function (req, res, next) {
    if (req.isAuthenticated()) {
        Message.find()
            .populate('author')
            .exec(function (err, results) {
                res.render('dashboard', {
                    title: 'You are authenticated',
                    user: req.user,
                    messages : results
                 })
            })
        
        
    } else {
        res.redirect('/');
    }
   
}

exports.dashboard_post = function (req, res, next) {
    if (req.body.message) {
        const msg = new Message({
        author: req.user._id,
        content: req.body.message,
        date: Date.now(),
    })

    msg.save(function (err, result) {
        if (err) { return next(err) }
        res.redirect('/dashboard');
    })
        return;
    }

    if (req.body.delete_message) {
        if (req.isAuthenticated()) { 
            Message.findByIdAndRemove(req.body.delete_message, {}, function (err, result) {
                if (err) { return next() }
                res.redirect('/dashboard')
            })
        }
        else {
            res.redirect('/credentialerror?name=dashboard')
        }
    }
   


    if (req.body.logout) {
        req.logOut();
        res.redirect('/')
    }
    
}