const User = require('../models/user');
const db = require('../configs/mongoose');
const Threshold = 3;


module.exports.showRegistrationPage = async function(req, res){
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var now = new Date();
    var startDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let count = await User.countDocuments({ ip: ip, createdAt: { $gte: startDay } });
        console.log(count, "Count", "IP", ip);
        if (count >= Threshold) {
            return res.render('sign_up', {
                title: 'Sign Up',
                showCaptcha: true,
                recaptcha: res.recaptcha,
                passwordErr: req.flash('passwordError'),
                success: req.flash('success'),
                dbError: req.flash('dbError'),
                captchaError: req.flash('captchaError')
            });
        } else {
            return res.render('sign_up', {
                title: 'Sign Up',
                showCaptcha: false,
                recaptcha: res.recaptcha,
                passwordErr: req.flash('passwordError'),
                success: req.flash('success'),
                dbError: req.flash('dbError'),
                captchaError: req.flash('captchaError')
            });
        }
    
}

module.exports.registerUser = async function(req, res){
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (!req.recaptcha.error) {
            let data = req.body;
            data.ip = ip;
            let document = new User(data);
            document.save((err, resp) => {
                if (err) {
                    req.flash("dbError", "Error in Database, Probably Email already exists");
                    return res.redirect('/');
                } else {
                    req.flash("success", "Saved data successfully into DB");
                    return res.redirect('/');
                }
            });
    } else {
        var now = new Date();
        var startDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let count = User.countDocuments({ ip: ip, createdAt: { $gte: startDay } });
            if (count < Threshold) {
                if (req.body) {
                    let data = req.body;
                    data.ip = ip;
                    let document = new User(data);
                    document.save((err, resp) => {
                        if (err) {
                            req.flash("dbError", "Error in Database, Probably Email already exists");
                            return res.redirect('/');
                        } else {
                            req.flash("success", "Saved data successfully into DB");
                            return res.redirect('/');
                        }
                    });
                }
            } else {
                req.flash("captchaError", req.recaptcha.error + " Invalid captcha");
                return res.redirect('/');
            }
    }
}

