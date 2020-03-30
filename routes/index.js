const userController = require('../controllers/user_controllers');
const express = require('express');
const Router = express.Router();
var Recaptcha = require('express-recaptcha').RecaptchaV2;

//import Recaptcha from 'express-recaptcha'
const API_KEY = '6LeGTeQUAAAAADkEPhrGDWC6isBisbF783xZVi18';
const SECRET_KEY = '6LeGTeQUAAAAAB9uroVWWcrBjzQ9jSnBuH_8y-9z';


var recaptcha = new Recaptcha(API_KEY, SECRET_KEY, {callback: 'cb'});

// Set up routes.
Router.get('/', recaptcha.middleware.render, userController.showRegistrationPage);
Router.post('/register', recaptcha.middleware.verify, userController.registerUser);



module.exports  = Router;
