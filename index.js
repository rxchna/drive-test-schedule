const express = require('express');
const path = require('path');
require('dotenv').config({ path: '.variables.env' }); // Load environment variables

const PORT_NO = process.env.PORT;
const app = new express();
const ejs = require('ejs');

app.use(express.static('public'));
app.set('view engine','ejs');

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
    res.render('g_test');
});

app.get('/g2_test', (req, res) => {
    res.render('g2_test');
});

app.get('/login', (req, res) => {
    res.render('login');
});