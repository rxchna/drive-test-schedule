const UserModel = require('../models/User');
const bcrypt = require('bcrypt');

/* Register form validation middleware */
module.exports = async (req, res, next) => {
    let errorMessage = '';

    try {
        // Validate input fields
        errorMessage = await validateRegistrationInputFields(req.body);
        if (errorMessage) {
            return res.render('register', {
                errorMessage,
                userRegisteredSuccess: false
            });
        }

        // Check if passwords match using bcrypt.compare (to avoid timing attacks)
        // Hashing first password input
        bcrypt.hash(req.body.user_password, 10, (error, hash) => {
            // Comparing hashed "user_password" with user_confirm_password
            bcrypt.compare(req.body.user_confirm_password, hash, (error, same) => {
                if(!same) {
                    errorMessage = "Passwords do not match.";
                    return res.render('register', {
                        errorMessage,
                        userRegisteredSuccess: false
                    });
                }
                else {
                    // Passwords match
                    next();
                }
            });
        });
    } catch (error) {
        console.error(error);
    }
};

const validateRegistrationInputFields = async (user) => {
    // Check if input fields are null
    if(!user.username || !user.user_password || !user.user_confirm_password || !user.user_type) {
        return "Please ensure all fields are filled out before submitting the form.";
    }
    // Check if username is in appropriate format
    const regex = /^[a-zA-Z0-9_]+$/; // Regex for username to contain only alphanumeric characters and underscores
    if (!regex.test(user.username)) {
        return "Username can only contain letters, numbers, and underscores.";
    }

    // Check for username duplicates
    const existingUser = await UserModel.findOne({ username: user.username });
    if (existingUser) {
        return "The username you entered is already taken. Please choose another username."
    }
};