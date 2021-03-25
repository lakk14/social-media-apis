const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const createError = require('http-errors')

//Import Routes
const userRoute = require('./Routes/User.route');

require('./helpers/init_mongodb');

app.use(morgan('dev')); //dev purpose

app.use(cors());  //Handling Cors error

//Body-Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Routes
app.use('/api', userRoute);

app.use(async (req, res, next) => {
    next(createError.NotFound())
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        },
    })
})

app.listen(3822, () => { console.log("ef-backend started"); }); //Startig Application

module.exports = app;
