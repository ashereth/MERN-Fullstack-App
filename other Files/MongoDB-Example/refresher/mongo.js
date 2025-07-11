const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb+srv://asherce21:A252478ssd@products.goymnya.mongodb.net/?retryWrites=true&w=majority&appName=products'

const createProduct = async (req, res, next) => {
    const newProduct = {
        name: req.body.name,
        price: req.body.price,
    }

    const client = new MongoClient(url);
    
    try {
        await client.connect();
        const db = client.db('products');
        const result = await db.collection('products').insertOne(newProduct);
    } catch (error) {
        return res.json({message: 'Could not store data.'})
    };

    client.close();

    res.json(newProduct);
};

const getProducts = async (req, res, next) => {
    const client = new MongoClient(url);
    
    let products;
    try {
        await client.connect();
        const db = client.db('products');
        products = await db.collection('products').find().toArray();
    } catch (error) {
        return res.json({message: 'Could not get data.'})
    };

    client.close();

    res.json(products);
};

exports.createProduct = createProduct;
exports.getProducts = getProducts;