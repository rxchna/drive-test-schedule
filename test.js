const mongoose = require('mongoose');
const UserModel = require('./models/User');

// Initialize mongoose and connect to db
mongoose.connect('mongodb+srv://rachnapoonit11:8rOIpM8HGwJuNcLR@clusterrp.ddwaxnu.mongodb.net/?retryWrites=true&w=majority&appName=ClusterRP', {useNewUrlParser: true});

/* 1. Create tuple as per below model */
async function createUser() {
    try {
        const user = await UserModel.create({
            firstname: 'Rachna',
            lastname: 'Poonit',
            license_no: '123-344-9945',
            email_add: 'rachna@gmail.com',
            age: 25,
            dob: new Date("1997-11-26"),
            car_details: {
                make: 'Toyota',
                model: 'Rav4',
                year: '2024',
                plate_no: 'qwerty09'
            }
        });
        console.log('Created user ', user);
    }
    catch (error) {
        console.log(error);
    }
}
// createUser();

/* 2. Read all tuples */
async function readAllUsers() {
    try {
        const users = await UserModel.find({});
        console.log('All users: ', users);
    } catch (error) {
        console.log(error);
    }
}
// readAllUsers();

/* 3. Read user by ID */
async function readUserById(id) {
    try {
        const user = await UserModel.findById(id);
        console.log('User with ID ', id, ': ', user);
    } catch (error) {
        console.log(error);
    }
}
// readUserById('');

/* 4. Update tuple */
async function updateUser(id) {
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(id, 
            { 
                email_add: 'rachnapoonit11@gmail.com',
                age: 26
            });
        console.log('Updated user:', updatedUser);
    }
    catch (error) {
        console.log(error);
    }
}
// updateUser('');

/* 5. Delete tuple */
async function deleteUser(id) {
    try {
        const deletedUser = await UserModel.findByIdAndDelete(id);
        console.log('Deleted user: ', deletedUser);
    } catch (error) {
        console.log(error);
    } 
}
// deleteUser('');

/* RUN:: node test.js */