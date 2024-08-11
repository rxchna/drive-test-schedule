const UserModel = require('../models/User');

module.exports = async (req, res, next) => {
    if(req.session.userType != 'type-examiner') {
        return res.redirect('/'); // If user tries to access unauthorised pages (only examiner can access examiner page), redirect to dashboard
    }
    next();
};
