var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var config = require('./config/database');

mongoose.connect(config.database,{ useNewUrlParser: true });
mongoose.connection.on('connected', () => {
    console.log('Connected to database');
});


var port = process.env.PORT || 8080;


var app = express();

var users = require('./routes/users');
var jokes = require('./routes/jokes');
// CORS MW
app.use(cors());

// index
/*app.get('/', (req, res) => {
    res.send('Invalid Endpoint');
});*/


//View Engine
app.set('views', __dirname + '/public');
app.set('view engine', 'html');

// Set Static Folder
app.use(express.static(path.join(__dirname,'public')));

//Body Parser MW
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/users', users);
app.use('/jokes',jokes);
//app.use('/',index);
//app.use('/api',jokes);

app.get('**',(req,res)=>{
    res.sendfile(__dirname+'/public/index.html');
  });
  
//Passport MW
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

//Listen port
app.listen(port, '0.0.0.0', function(){
    console.log('Server started on port ' + port);
});
