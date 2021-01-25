const express = require('express');
const app = express();
const fs = require('fs');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require('./api/routes/users');
const postRoutes = require('./api/routes/posts');
const loginRoutes = require('./api/routes/login');
const tagRoutes = require('./api/routes/tags');
const messageRoutes = require('./api/routes/messages');
const organizationRoutes = require('./api/routes/organizations');
const { json } = require('body-parser');

mongoose.connect('mongodb+srv://dbWerfam:' + process.env.MONGO_ATLAS_PW + '@node-social-media.fjlev.mongodb.net/SocialMediaDb?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
});

app.use('/uploads/', express.static('uploads'));
app.use('/public/', express.static('public'));

//Logger middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req,res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});

// Routes which should handle requests
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/tags', tagRoutes);
app.use('/messages', messageRoutes);
app.use('/organizations', organizationRoutes);
app.use('/', loginRoutes);

app.get('/', (req, res, next) => {
    fs.readFile(__dirname + '/index.html', 'utf-8', (err, html) => {
        if (err) {
            return res.status(404).json({
                error: err
            })
        }

        res.status(200).send(html);
    })
})

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})



module.exports = app;