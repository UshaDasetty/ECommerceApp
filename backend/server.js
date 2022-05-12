const app = require('./app');
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');

//Handling Uncaught exceptions
process.on('uncaughtException',(err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down due to Uncaught exceptions`);

    process.exit(1);
})


//config
dotenv.config({path:"backend/config/config.env"});

//connect database
connectDatabase()

const server = app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
});


//Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down due to unhandled promise rejection`);

    server.close(() => {
        process.exit(1);
    });
});