import express from 'express';
// import configViewEngine from "./config/viewEngine";
// import initWebRoutes from "./routes/web";
import bodyParser from 'body-parser';
// require('dotenv').config();
import dotenv from 'dotenv';
dotenv.config();
import initApiRoutes from './routes/api.js';
import configCors from './config/cors.js';
// import { createJWT, verifyToken } from './middleware/JWTAction';
import cookieParser from 'cookie-parser';
import connection from './config/connection.js';
// import runSeeders from './seeders/index.js';

// const redisClient = require('./config/redis');

const app = express(); // app
const PORT = process.env.PORT || 8088;

// config view Engine of app
// configViewEngine(app);

// config body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// config cors policy
configCors(app);

// test jwt
// createJWT();
// let decodedData = verifyToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVGFkdWNtYW5oIiwiYWRkcmVzcyI6Im1hdSBsdW9uZyIsImlhdCI6MTc0MTc5NTA3OH0.v7oBJ0NibRvhL21nnUxU3809CLaLJydXM4tL6CMOPN0");
// console.log(decodedData);

// connectRedis();
// redisClient.set('mykey', 'myvalue');

// // Ví dụ đọc key:
// redisClient.get('mykey', (err, reply) => {
//     if (err) {
//         console.error(err);
//     } else {
//         console.log('Value:', reply);
//     }
// });

// config cookie parser
app.use(cookieParser());

// app.use((request, response, next) => {
//     // console.log(">>> check new request");
//     // console.log("host: ", request.hostname);
//     // console.log("path: ", request.path);
//     // console.log("method: ", request.method);
//     next();
// })

// config api of app
initApiRoutes(app);

// init web routes of app
// initWebRoutes(app);

// test connect DB
connection(); // connect to DB
// runSeeders();

app.use((request, response) => {
    return response.send('404 not found');
});

app.listen(PORT, () => {
    console.log('>>>> Web 2 project is running on the port: ', PORT);
});
