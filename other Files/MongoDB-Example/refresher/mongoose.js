const mongoose = require('mongoose');

const Product = require('./models/product');

mongoose.connect(
    'mongodb+srv://asherce21:A252478ssd@products.goymnya.mongodb.net/products?retryWrites=true&w=majority&appName=products'
).then(()=>{
    console.log('Connected to database!');
}).catch(() => {
    console.log('Connection failed');
});

const createProduct = async (req, res, next) => {
    //use the product model
    const createdProduct = new Product({
        name: req.body.name,
        price: req.body.price
    });

    //call save using await result = newly saved object
    // this does all the heavy lifting 
    const result = await createdProduct.save();

    //objectId's and how to access them
    console.log(createdProduct._id);
    console.log(createdProduct.id);
    
    res.json(result);
};

const getProducts = async (req, res, next) => {
    //this returns an array or products 
    //use exec to turn it into a promise and use await
    const products = await Product.find().exec();
    
    res.json(products);
};

exports.createProduct = createProduct;
exports.getProducts = getProducts;