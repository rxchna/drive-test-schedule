const UserModel = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        // Check if input fields of car information are null
        let errorMessage = validateCarInformationData(req.body);

        if(errorMessage) {
            // Display back original user details
            const user = await UserModel.findById(req.session.userId);

            return res.render('g_test', {
                user,
                errorMessage
            });
        }
        next();
    } catch (error) {
        console.error(error);
    }
};

/* Function to validate Car Information input data */
const validateCarInformationData = (userData) => {
    if(!userData.car_details.car_make ||
        !userData.car_details.car_model || 
        !userData.car_details.car_year ||
        !userData.car_details.car_plate_no
    ) {
        return "Please ensure all Car Information fields are filled out before submitting the form.";
    }

    // Car year should be 4-digit number
    if(userData.car_details.car_year && (
        userData.car_details.car_year.length !== 4 || 
        isNaN(userData.car_details.car_year))) {
        return "Car year must be a valid four-digit number.";
    }

    // Car year cannot be in the future
    const currentYear = new Date().getFullYear();
    if(parseInt(userData.car_details.car_year) > currentYear) {
        return "Car year cannot be in the future.";
    }

    // Validation success
    return "";
}