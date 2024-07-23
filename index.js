const express = require('express');
const path = require('path');
const ejs = require('ejs');
require('dotenv').config({ path: '.variables.env' }); // Load environment variables
const mongoose = require('mongoose');
const UserModel = require('./models/User');
const bcrypt = require('bcrypt');
const { error } = require('console');
const { hash } = require('crypto');
const expressSession = require('express-session');
const AppointmentModel = require("./models/Appointment");

// .env variables - store sensitive information on environment file
const PORT_NO = process.env.PORT;
const MONGO_DB_URL = process.env.DATABASE;
const SECRET_SESSION_KEY = process.env.SECRET;

// Global variables
global.isLoggedIn = null;
global.isTypeDriver = null;
global.isTypeAdmin = null;
global.userType = null

const app = new express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressSession({
    secret: SECRET_SESSION_KEY
}));

// Middleware executed on all requests
app.use("*", (req, res, next) => {
    isLoggedIn = req.session.userId;
    isTypeDriver = req.session.userType === "type-driver";
    isTypeAdmin = req.session.userType === "type-admin";
    next();
})

mongoose.connect(MONGO_DB_URL, {useNewUrlParser: true});

app.listen(PORT_NO, () => {
    console.log(`#rp: App listening on port ${PORT_NO}`);
});

// Controllers
const dashboardController = require("./controllers/dashboardPageController");
const gPageController = require("./controllers/gPageController");
const g2PageController = require("./controllers/g2PageController");
const loginPageController = require("./controllers/loginPageController");
const registerPageController = require("./controllers/registerPageController");
const appointmentPageController = require("./controllers/appointmentPageController");

const registerUserController = require("./controllers/registerUserController");
const loginUserController = require("./controllers/loginUserController");
const logoutUserController = require("./controllers/logoutUserController");
const storeG2Controller = require("./controllers/storeG2Controller");
const storeGController = require("./controllers/storeGController");
const loadTimeSlotsController = require("./controllers/loadTimeSlotsController");
const storeAppointmentsController = require("./controllers/storeAppointmentsController");
const loadG2TimeSlotsController = require("./controllers/loadG2TimeSlotsController");
const updateUserG2AppointmentController = require("./controllers/updateUserG2AppointmentController");

// Middleware
const validateRegistration = require("./middleware/validateRegistrationMiddleware");
const validateLoginMiddleware = require("./middleware/validateLoginMiddleware");
const validateG2FormMiddleware = require("./middleware/validateG2Middleware");
const validateGFormMiddleware = require("./middleware/validateGMiddleware");
const validateG2AppointmentMiddleware = require("./middleware/validateG2AppointmentMiddleware");
const validateStoreAppointmentsMiddleware = require("./middleware/validateStoreAppointmentsMiddleware");

/* Middleware to protect pages from being accessed by users not logged in -> redirect to dashboard */
const authMiddleware = require("./middleware/authMiddleware");

/* Middleware to protect pages from being accessed by users not of type driver -> redirect to dashboard */
const authDriverMiddleWare = require("./middleware/authDriverMiddleware");

/* Middleware to protect pages from being accessed by users not of type admin -> redirect to dashboard */
const authAdminMiddleWare = require("./middleware/authAdminMiddleware");

/* Middleware to prevent login or register if user is already logged in -> redirect to dashboard */
const redirectIfAuthMiddleware = require("./middleware/redirectIfAuthMiddleware");

// Routes
app.get('/', dashboardController);
app.get('/dashboard', dashboardController);
app.get('/g_test', authMiddleware, authDriverMiddleWare, gPageController);
app.get('/g2_test', authMiddleware, authDriverMiddleWare, g2PageController);
app.get('/appointment', authMiddleware, authAdminMiddleWare, appointmentPageController);
app.get('/login', redirectIfAuthMiddleware, loginPageController);
app.get('/register', redirectIfAuthMiddleware, registerPageController);

/* Method to store user G2 details */
app.post('/users/store', validateG2FormMiddleware, storeG2Controller);

/* Method to update user data after an update is done on G Page form */
app.post('/users/update', validateGFormMiddleware, storeGController);

/* Register new user */
app.post('/auth/register', validateRegistration, registerUserController);

/* Method for user login */
app.post('/auth/login', validateLoginMiddleware, loginUserController);

/* Method for user logout */
app.get('/auth/logout', authMiddleware, logoutUserController);

/* Method to load available time slots for selected date */
app.post('/appointmentDate/loadTimeSlots', loadTimeSlotsController);

/* Method to create appointments */
app.post('/appointments/store', validateStoreAppointmentsMiddleware, storeAppointmentsController);

/* Method to load available time slots for selected date from g2 page */
app.post('/userAppointmentDate/loadTimeSlots', loadG2TimeSlotsController);

/* Method to save user appointment for g2 */
app.post('/appointments/updateG2Appointment', validateG2AppointmentMiddleware, updateUserG2AppointmentController);

/* Render "404 not found" page for unrecognized route */
app.use((req, res) => res.render('not_found'));
