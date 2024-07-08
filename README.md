## Project Overview :
A kiosk application for picking time slots for G and G2 drive tests. The application simulates the actions performed at a drive test center. 

## App Features :
1) Driver Interface (a person who wants to take G2/G license)
2) Examiner Interface (a person who takes the driver’s exam)
3) Admin Interface (a person who adds schedules and other stuff in the portal)

## Backend :
* The backend is built with node.js , [express.js Framework](https://expressjs.com/) ,and MongoDb Database
* Generic Crud Api (Create / Read / Update / Delete)
* EJS Templating Engine

## Set up backend
1) create MongoDB Atlas account database url 
2) change this file name .variables.env.tmp to .variables.env
3) open .variables.env and paste your MongoDB url here : DATABASE=your-mongodb-url
4) npm install

## Start server
1) npm start
