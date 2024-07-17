const UserModel = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        // Find user by session.userId
        const user = await UserModel.findById(req.session.userId);
        if (!user) {
            return res.redirect('/');
        }
        next();
    } catch (error) {
        console.error(error);
    }
};
