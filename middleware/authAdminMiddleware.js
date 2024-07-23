const UserModel = require('../models/User');

module.exports = async (req, res, next) => {
    if(req.session.userType != 'type-admin') {
        return res.redirect('/'); // If user tries to access unauthorised pages (only admin can access appointment), redirect to dashboard
    }
    next();
};
