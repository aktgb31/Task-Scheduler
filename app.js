const express = require('express');
const { PORT } = require('./config');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const errorMiddleware = require('./middlewares/error');
const session = require('express-session');
const Db = require('./database');
const passport = require('./passport');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.3',
        info: {
            title: 'Task Scheduler API',
            description: 'API with autogenerated swagger doc',
            contact: {
                name: 'Amit Kumar'
            },
        },
        servers: [{ url: `http://localhost:${PORT}`, description: "Development server" }]
    },
    apis: ['./routes/*.js']
}

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerJsDoc(swaggerOptions)));

app.use('/', express.static('public'));

// Sessions
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
        db: Db,
        checkExpirationInterval: 15 * 60 * 1000,
        expiration: 24 * 60 * 60 * 1000
    })
}))

Db.sync();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/user', require('./routes/user'));
app.use('/api/task', require('./routes/task'));

app.use(errorMiddleware);
app.listen(PORT, (err) => {
    if (err)
        console.log(`Server failed to start. Error: ${err}`);
    else
        console.log(`Server started on http://localhost:${PORT}`);
})