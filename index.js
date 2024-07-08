const express = require('express');
const path = require('path');
const ejs = require('ejs');
const mongoose = require('mongoose');
const UserModel = require('./models/User');
require('dotenv').config({ path: '.variables.env' }); // Load environment variables

const app = new express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// .env variables
const PORT_NO = process.env.PORT;
const MONGO_DB_URL = process.env.DATABASE;

mongoose.connect(MONGO_DB_URL, {useNewUrlParser: true});

/* Middleware for form validation */
// G2 Form Validation
const validateG2FormMiddleWare = (req, res, next) => {
    let errorMessage = validateData(req.body);
    console.log("req.body: ", req.body);
    // Check if input fields of personal information and car information are null
    if(errorMessage) {
        return res.render('g2_test', {
            user: req.body,
            errorMessage
        });
    }
    next();
}

/* G Form Validation */
const validateGFormMiddleWare = async (req, res, next) => {
    let errorMessage = validateCarInformationData(req.body);

    // Check if input fields of personal information and car information are null
    if(errorMessage) {

        // Display back original user details
        const user = await UserModel.findById(req.params.id);

        return res.render('g_test', {
            showGForm : true, /* makes G form visible */
            showNoUserContainer: false,
            user,
            errorMessage
        });
    }
    next();
}

/* Validation for fetch User By license number: ensures a null value is not input */
const validateLicenseNoInput = (req, res, next) => {
    
    const license_no = req.query.license_no;

    // Return with error message if license number input is null
    if(!license_no) {
        const errorMessage = "Please enter a valid license number.";

        // Render g page with error message
        return res.render('g_test', { 
            showGForm: false, 
            showNoUserContainer: false,
            errorMessage
        });
    }
    next();
}

app.listen(PORT_NO, () => {
    console.log(`#rp: App listening on port ${PORT_NO}`);
});

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/dashboard', (req, res) => {
    res.render('index');
});

app.get('/g_test', (req, res) => {
    res.render('g_test', { 
        showGForm: false, 
        showNoUserContainer: false,
        errorMessage: false
    }); /* GForm and showNoUserContainer is set to invisible on loading of the page */
});

app.get('/g2_test', (req, res) => {
    const user = new UserModel(); /* Adding blank user on load for validation function to save prefilled values if validation fails */
    res.render('g2_test', {
        user,
        errorMessage: ''
    });
});

app.get('/login', (req, res) => {
    res.render('login');
});

/* Method to create user */
app.post('/users/store', validateG2FormMiddleWare, async (req, res) => {
    try {
        const user = await UserModel.create({
            ...req.body
        });
        res.redirect('/');
    }
    catch(error) {
        console.log(error);
    }
});

/* Method to read user according to input license number */
app.get('/users/:license_no', validateLicenseNoInput, async (req, res) => {
    try {
        const license_no = req.query.license_no;
        const users = await UserModel.find({ license_no: license_no });

        if (users.length == 0) {
            // No user found, display no-user-container
            res.render('g_test', {
                showNoUserContainer : true,
                showGForm: false
            });
        }
        else {
            /* Display user details on g-form */
            let user = users[0];
            res.render('g_test', {
                showGForm : true, /* makes G form visible */
                showNoUserContainer: false,
                user,
                errorMessage: ''
            });
        }
    } catch (error) {
        console.log(error);
    }
});

/* Method to update user data after an update is done on G Page form */
app.post('/users/update/:id', validateGFormMiddleWare, async (req, res) => {
    try {
        // Update user details
        const updatedUser = await UserModel.findByIdAndUpdate(req.params.id,
            {
                car_details: req.body.car_details
            }, { new: true } /* By default Mongoose returns the original document before the update. { new: true }, Mongoose returns document after the update. */
        );

        // Display g_test form with updated values
        res.render('g_test', {
            showGForm : true, /* makes G form visible */
            showNoUserContainer: false,
            user: updatedUser,
            errorMessage: ''
        });
    } catch (error) {
        console.log(error);
    }
});

/* Function to validate Personal Information and Car Information input data */
function validateData(userData) {
    if(!userData.firstname || 
        !userData.lastname || 
        !userData.license_no || 
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
    // Car year should be 4-digit number
    const errDataValidated = validateCarInformationData(userData);

    // Returns empty string if data is validated
    return errDataValidated;
}

function validateCarInformationData(userData) {
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
    return "";
}