const UserModel = require("../models/User");
const bcrypt = require("bcrypt");

module.exports = async (req, res) => {
    try {
        // Get current user
        let user = await UserModel.findById(req.session.userId);
        let showLicenseNoField = false;

        // Verify if user has license number set to default value
        if(user.license_no == "default") {
            user = clearUser(user);
            showLicenseNoField = true; // Show license_no input field
        }

        // Render G2 page
        res.render('g2_test', {
            user,
            errorMessage: '',
            firstUserInput: showLicenseNoField
        });
    } catch (error) {
        console.log(error);
    }
}

// Function to set field values to empty
const clearUser = (user) => {
    const fieldsToExclude = ['username', 'user_password', 'user_type'];

    // Get all keys in User Model document
    const userSchemaPaths = UserModel.schema.paths;

    for (const path in userSchemaPaths) {
        // Skip the _id, __v fields, and fields to exclude
        if (path !== '_id' && path !== '__v' && !fieldsToExclude.includes(path)) {
            user[path] = '';
        }
    }
    // Clear nested fields - car_details
    if (user.car_details) {
        user.car_details = {};
    }

    return user;
}