const express = require('express');
const path = require('path');
const app = express();

// Serving home.html on /home route
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});
const fs = require('fs');

// Serving JSON data on /profile route
app.get('/profile', (req, res) => {
    fs.readFile('user.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Error reading user file" });
        }
        res.json(JSON.parse(data));
    });
});
app.use(express.json());  // Middleware to parse JSON body

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    fs.readFile('user.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Error reading user file" });
        }

        const user = JSON.parse(data);

        if (user.username !== username) {
            return res.json({
                status: false,
                message: "User Name is invalid"
            });
        }

        if (user.password !== password) {
            return res.json({
                status: false,
                message: "Password is invalid"
            });
        }

        res.json({
            status: true,
            message: "User Is valid"
        });
    });
});
app.get('/logout', (req, res) => {
    const username = req.query.username || 'User';
    res.send(`<b>${username} successfully logged out.<b>`);
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Server Error');
});
const router = express.Router();

router.get('/profile', (req, res) => {
    res.send('User profile');
});

app.use('/users', router);

app.get('/file', (req, res, next) => {
    fs.readFile('somefile.txt', (err, data) => {
        if (err) {
            return next(err); // Passing the error to the error-handling middleware
        }
        res.send(data);
    });
});

// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong! Please try again.');
});

const port = process.env.PORT || 9000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

/*  Any route definition example usually starts with express.Router() to provide for more modularity for mounting route handlers. It allows to divide routes into more reasonable parts, if the application is big. Rather than defining all routes in one file you can define routes that are related to a feature or a resource in a separate file and then use express.Router() to mount them. This makes code more easy to maintain and more easier to scale.*/

/* In Express.js, error handling is typically implemented using middleware. This middleware can capture errors and return appropriate messages to the client.*/