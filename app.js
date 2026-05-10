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
const cors = require('cors')
const { config } = require('dotenv')

config()
let port = process.env.PORT || 4000;

// Adds headers: Access-Control-Allow-Origin: *
app.use(cors())

app.use(express.json())


app.get('/', (req, res) => { // root level
    res.send('Welcome to my backend world , aj se backend start!');
});

let products = [
    { id: 1, name: "Product 1", price: 100 },
    { id: 2, name: "Product 2", price: 200 },
    { id: 3, name: "Product 3", price: 300 },
]

app.get('/products', (req, res) => {
    res.json({ limit: 30, page: 1, products: products });
})


app.post("/products", (req, res) => { 

    console.log(req.body.name)
    console.log(req.body.price)

    const newProduct = {
        id: products.length + 1,
        name: req.body.name,
        price: req.body.price
    }

    products.push(newProduct)

    res.status(201).json({ message: 'Product added Successfully!' , newProduct })
})

app.put("/products/:id", (req, res) => { // :id (id will be dynamic)
    console.log(req.params.id)
    const id = Number(req.params.id)
    console.log(req.body.name)
    console.log(req.body.price)

    const product = products.find((product) => product.id === id)

    if(!product){
        res.send(404).json({message: 'Product Not Found!'})
    }

    product.name = req.body.name || product.name
    product.price = req.body.price || product.price


    res.status(200).json({ message: 'Product updated Successfully!' , product})
})


app.delete("/products/:id", (req, res) => { // :id (id will be dynamic)
    console.log(req.params.id)
    const id = Number(req.params.id)

    const product = products.find((product) => product.id === id)

    if(!product){
        res.send(404).json({message: 'Product Not Found!'})
    }

    products = products.filter((product) => product.id !== id)


    res.status(200).json({ message: 'Product deleted Successfully!'})
})


app.listen(port, () => {
    console.log("Server is runnning on port " + port);
})