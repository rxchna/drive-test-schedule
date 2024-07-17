const UserModel = require("../models/User");
const bcrypt = require("bcrypt");

module.exports = async (req, res) => {
    const { username, user_password, user_type } = req.body;
    try {
        const newUser = await UserModel.create({
            username,
            user_password,
            user_type
        });

        // Render "Registration Successful" section
        return res.render('register', {
            errorMessage: '',
            userRegisteredSuccess: true
        });
    } catch (error) {
        console.log(error);
    }
};