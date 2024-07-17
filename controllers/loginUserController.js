const UserModel = require("../models/User");
const bcrypt = require("bcrypt");

module.exports = async (req, res) => {
    const { username, user_password } = req.body;
    try {
        // Get user record from db
        const user = await UserModel.findOne({ username: username });
        if(user) {
            bcrypt.compare(user_password, user.user_password, (error, same) => {
                if (error) {
                    // Handle internal error
                    return res.render('login', {
                        errorMessage: 'An internal error occurred. Please try again.'
                    });
                }
                if(same) {
                    // Create session with user id and user type
                    req.session.userId = user._id;
                    req.session.userType = user.user_type;

                    // Redirect to Dashboard
                    res.redirect('/');
                }
                else {
                    // Redirect to login page
                    return res.render('login', {
                        errorMessage: 'Invalid password.'
                    });
                }
            });
        }
        else {
            // No user found - Redirect to login page
            return res.render('login', {
                errorMessage: 'No user found. Please register to proceed.'
            });
        }
    } catch (error) {
        console.log(error);
    }
};