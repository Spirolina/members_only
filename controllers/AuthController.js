

exports.wrongCredential = function (req, res, next) {
   console.log(req.query)
    res.render('wrongCredential', {
        title: `your credential is wrong`,
        value: req.query.name,
    })
}

exports.wrongCredential_post = function (req, res, next) {
    console.log(req.query);
    res.redirect(`/${req.body.try_again}`)
}