const express =  require('express');
const router  = require('./routes/index');
const flash   = require('req-flash');
const session = require('express-session');
const app = express();
const port = 8000;


app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(session({
    secret: 'Shivam Mishra',
    resave: false,
    saveUninitialized: true
}));

app.use(flash());
app.set('view engine','ejs');
app.set('views','./views');
app.use('/', router);


app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});