const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');

const app = express();

const DUMMY_PRODUCTS = []; // not a database, just some in-memory storage for now

app.use(bodyParser.json());

// CORS Headers => Required for cross-origin/ cross-server communication
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});
//return all products
app.get('/products', (req, res, next) => {
  res.status(200).json({ products: DUMMY_PRODUCTS });
});
//make new product
app.post('/product', (req, res, next) => {
  //get title and price
  const { title, price } = req.body;

  if (!title || title.trim().length === 0 || !price || price <= 0) {
    return res.status(422).json({
      message: 'Invalid input, please enter a valid title and price.'
    });
  }
  //create a new product object with the title and price we got
  const createdProduct = {
    id: uuid(),
    title,
    price
  };
  //add product to storage
  DUMMY_PRODUCTS.push(createdProduct);

  res
    .status(201)
    .json({ message: 'Created new product.', product: createdProduct });
});

app.listen(5000); // start Node + Express server on port 5000
