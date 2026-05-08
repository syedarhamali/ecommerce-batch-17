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
const { config } = require('dotenv')

config()
let port = process.env.PORT || 4000;

console.log(process.env.PORT)


app.get('/', (req, res) => { // root level
    res.send('Welcome to my backend world , aj se backend start!');
});

const products = [
    { id: 1, name: "Product 1", price: 100 },
    { id: 2, name: "Product 2", price: 200 },
    { id: 3, name: "Product 3", price: 300 },
]

app.get('/products', (req, res) => {
    res.json({ limit: 30, page: 1, products: products });
})


app.post("/add-product" , (req , res) =>{
    console.log(req.json())
})

app.listen(port, () => {
    console.log("Server is runnning on port " + port);
})