var AuthenticationController = require('./controllers/authentication'),  
    TodoController = require('./controllers/todos'),  
    express = require('express'),
    passportService = require('../config/passport'),
    passport = require('passport');

var requireAuth = passport.authenticate('jwt', {session: false}),
    requireLogin = passport.authenticate('local', {session: false});

module.exports = function(app){

    var apiRoutes = express.Router(),
        authRoutes = express.Router(),
        todoRoutes = express.Router();

    // Auth Routes
    apiRoutes.use('/auth', authRoutes);

    authRoutes.post('/register', AuthenticationController.register);
    authRoutes.post('/login', requireLogin, AuthenticationController.login);

    authRoutes.get('/protected', requireAuth, function(req, res){
        res.send({ content: 'Success'});
    });

    // Todo Routes
    apiRoutes.use('/todos', todoRoutes);
    todoRoutes.get('/', requireAuth, AuthenticationController.roleAuthorization(['ROLE_GUEST','ROLE_ADMIN','ROLE_USER']), TodoController.getTodos);
    todoRoutes.post('/', requireAuth, AuthenticationController.roleAuthorization(['ROLE_ADMIN','ROLE_USER']), TodoController.createTodo);
    todoRoutes.delete('/:todo_id', requireAuth, AuthenticationController.roleAuthorization(['ROLE_USER']), TodoController.deleteTodo);

    // Set up routes
    app.use('/api', apiRoutes);

}
