const UserModel = require('../models/User');
const bcrypt = require('bcrypt');

/* Register form validation middleware */
module.exports = async (req, res, next) => {
    const { username, user_password } = req.body;
    let errorMessage = '';

    try {
        // Check if input fields are null
        if(!username || !user_password ) {
            errorMessage = "Please ensure all fields are filled out.";
            return res.render('login', {
                errorMessage
            });
        }
        next();
    } catch (error) {
        console.error(error);
    }
};