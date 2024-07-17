const UserModel = require('../models/User');

module.exports = async (req, res, next) => {
    if(req.session.userId) {
        return res.redirect('/'); // If user tries to access login or register page, redirect to dashboard
    }
    next();
};
