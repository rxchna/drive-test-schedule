const UserModel = require('../models/User');
const bcrypt = require("bcrypt");

module.exports = async (req, res, next) => {
    try {
        // Check if user inputs details for the first time, i.e. license_no is default
        let isFirstLogin = await checkIfFirstTimeInput(req);

        // G2 data input validation
        let errorMessage = validateData(req.body, isFirstLogin);

        if(errorMessage) {
            let user = req.body;
            user.user_dob = user.user_dob ? new Date(user.user_dob) : ''; // Convert dob input to date object for display back on g2 form
            
            return res.render('g2_test', {
                user,
                errorMessage,
                firstUserInput: isFirstLogin
            });
        }
        next();
    } catch (error) {
        console.error(error);
    }
};

/* Function to validate Personal Information and Car Information input data */
const validateData = (userData, isFirstLogin) => {
    if(!userData.firstname || 
        !userData.lastname || 
        (isFirstLogin && !userData.license_no) || 
        !userData.email_add || 
        !userData.user_age || 
        !userData.user_dob || 
        !userData.car_details.car_make ||
        !userData.car_details.car_model || 
        !userData.car_details.car_year ||
        !userData.car_details.car_plate_no
    ) {
        return "Please ensure all fields are filled out before submitting the form.";
    }
    // User age should not be less than 16
    if(userData.user_age && userData.user_age < 16) {
        return "Age must be 16 years or older.";
    }
    // User dob cannot be in the future
    if(userData.user_dob && new Date(userData.user_dob) > new Date()) {
        return "Date of birth cannot be in the future.";
    }

    // Check if DOB matches input age
    const currentDate = new Date();
    const currentYear = new Date().getFullYear();
    const dob = new Date(userData.user_dob);
    const dobMonth = dob.getMonth();
    const dobDay = dob.getDate();
    let calculatedAge = currentYear - dob.getFullYear();
    // Adjust age if the DOB has not yet occurred this year
    if (currentDate.getMonth() < dobMonth || (currentDate.getMonth() === dobMonth && currentDate.getDate() < dobDay)
    ) {
        calculatedAge--;
    }
    if (calculatedAge != userData.user_age) {
        return "Age does not match the date of birth.";
    }

    // License number should be in the format 'A1234-56789-01234' -> starts with an uppercase letter followed digits
    const license_regex = /^[A-Z]\d{4}-\d{5}-\d{5}$/;
    if(isFirstLogin && !license_regex.test(userData.license_no)) {
        return "Please enter a valid Ontario license number in the format \"A1234-34567-89012\"."
    }
    // Check email format
    const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!email_regex.test(userData.email_add)) {
        return "Please enter a valid email address."
    }
    
    // Car data validation
    const errDataValidated = validateCarInformationData(userData);

    // Returns empty string if data is validated
    return errDataValidated;
};

const validateCarInformationData = (userData) => {
    if(!userData.car_details.car_make ||
        !userData.car_details.car_model || 
        !userData.car_details.car_year ||
        !userData.car_details.car_plate_no
    ) {
        return "Please ensure all Car Information fields are filled out before submitting the form.";
    }

    // Car year should be 4-digit number
    if(userData.car_details.car_year.length !== 4 || 
        isNaN(userData.car_details.car_year)) {
        return "Car year must be a valid four-digit number.";
    }

    // Car year cannot be in the future
    const currentYear = new Date().getFullYear();
    if(parseInt(userData.car_details.car_year) > currentYear) {
        return "Car year cannot be in the future.";
    }

    return "";
}

// Check if user is inputting details for the first time, i.e. if license_no is default
const checkIfFirstTimeInput = async (req) => {
    // Get current user details from db to compare license no
    const currentUser = await UserModel.findById(req.session.userId);
    if(currentUser.license_no == "default") {
        return true;
    }
    return false;
}