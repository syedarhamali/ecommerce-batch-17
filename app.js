//without express
// const http = require('node:http');

// const hostname = '127.0.0.1'; //localhost
// const port = 4000;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Welcome to my backend world , aj se backend start!\n');
// });


// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });

//with express

const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { config } = require('dotenv');
const authMiddleware = require('./middleware/authMiddleware');
const productData = require('./products.json');


config();

let port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to my backend world , aj se backend start!');
});

let products = productData.products;

app.get('/products', (req, res) => {
    res.json({
        limit: 30,
        page: 1,
        products
    });
});

app.post('/products', (req, res) => {

    const newProduct = {
        id: products.length + 1,
        name: req.body.name,
        price: req.body.price
    };

    products.push(newProduct);

    res.status(201).json({
        message: 'Product added Successfully!',
        newProduct
    });
});

app.put('/products/:id', (req, res) => {

    const id = Number(req.params.id);

    const product = products.find(
        (product) => product.id === id
    );

    if (!product) {
        return res.status(404).json({
            message: 'Product Not Found!'
        });
    }

    product.name = req.body.name || product.name;
    product.price = req.body.price || product.price;

    res.status(200).json({
        message: 'Product updated Successfully!',
        product
    });
});

app.delete('/products/:id', (req, res) => {

    const id = Number(req.params.id);

    const product = products.find(
        (product) => product.id === id
    );

    if (!product) {
        return res.status(404).json({
            message: 'Product Not Found!'
        });
    }

    products = products.filter(
        (product) => product.id !== id
    );

    res.status(200).json({
        message: 'Product deleted Successfully!'
    });
});

let users = [];

app.post('/register', async (req, res) => {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: 'All fields are required'
        });
    }

    const userExists = users.find(
        (user) => user.email === email
    );

    if (userExists) {
        return res.status(400).json({
            message: 'User already exists'
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        id: users.length + 1,
        username,
        email,
        password: hashedPassword
    };

    users.push(newUser);

    res.status(201).json({
        message: 'User registered successfully',
        user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email
        }
    });
});

app.post('/login', async (req, res) => {

    const { email, password } = req.body;

    const user = users.find(
        (user) => user.email === email
    );

    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        });
    }

    const isMatched = await bcrypt.compare(
        password,
        user.password
    );

    if (!isMatched) {
        return res.status(401).json({
            message: 'Invalid Credentials'
        });
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            name: user.username
        },
        process.env.JWT_SECRET || "secret123",
        {
            expiresIn: '1d'
        }
    );

    res.status(200).json({
        message: 'Login Successful',
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email
        }
    });
});


app.get('/users', (req, res) => {
    res.json({
        limit: 30,
        page: 1,
        users
    });
});


app.get('/profile', authMiddleware, (req, res) => {

    res.status(200).json({
        message: 'Protected Route Accessed',
        user: req.user
    });
});

app.listen(port, () => {
    console.log(
        'Server is running on port ' + port
    );
});