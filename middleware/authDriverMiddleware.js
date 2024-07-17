const UserModel = require('../models/User');

module.exports = async (req, res, next) => {
    if(req.session.userType != 'type-driver') {
        return res.redirect('/'); // If user tries to access unauthorised pages (only driver can access g or g2), redirect to dashboard
    }
    next();
};
