const express = require('express');
const app = express();
const errorMiddleware = require('./middleware/error');
const cookieParser = require('cookie-parser')

app.use(express.json());
app.use(cookieParser());


// Routes Imports
const product = require('./routes/productRoute');
const user = require('./routes/userRoute');

// Middleware for errors
app.use(errorMiddleware);

// Base routes for Product
app.use('/api/v1', product);
app.use('/api/v1', user);

module.exports =app;