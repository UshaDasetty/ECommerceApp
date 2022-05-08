const express = require('express');
const app = express();
const product = require('./routes/productRoute');
const errorMiddleware = require('./middleware/error')

app.use(express.json());


// Middleware for errors
app.use(errorMiddleware)

// Base routes for Product
app.use('/api/v1', product);

module.exports =app;