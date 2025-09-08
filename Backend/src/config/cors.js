// require("dotenv").config();

import dotenv from 'dotenv';
dotenv.config();

const configCors = (app) => {
    app.use(function (request, response, next) {
        // console.log(request.method);
        // website you wish to allow to connect
        response.setHeader(
            'Access-Control-Allow-Origin',
            process.env.REACT_URL
        );

        //request method you wish to allow
        response.setHeader(
            'Access-Control-Allow-Methods',
            'GET, POST, OPTIONS, PUT, PATCH, DELETE'
        );

        //request headers you wish to allow
        response.setHeader(
            'Access-Control-Allow-Headers',
            'X-Requested-With,content-type, Authorization'
        );

        //set to true if you need the website to include cookies in the requests sent
        //to the API (e.g in case you use sessions)
        response.setHeader('Access-Control-Allow-Credentials', true);

        if (request.method === 'OPTIONS') {
            return response.sendStatus(200);
        }
        //pass to next layer of middleware
        next();
    });
};

export default configCors;
