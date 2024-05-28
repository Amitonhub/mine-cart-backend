const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const {v2} = require('cloudinary')
const authController = require('./controllers/authController');
const productController = require('./controllers/productController');
const { checkAuth } = require('./middleware');
const {DBConnect} = require('./database');
const cors = require('cors')
const PORT = process.env.PORT

app.use(cors())
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
DBConnect()

          
v2.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Auth Routes
app.post('/api/register', authController.register);
app.post('/api/login', authController.login);
app.get('/api/getUserDetails', checkAuth, authController.getUserDetails);

// Products Routes
app.post('/api/add-product', checkAuth, productController.addProduct);
app.get('/api/all-products', checkAuth, productController.allProducts);
app.post('/api/update-product', checkAuth, productController.updateProduct);

app.listen(PORT || 5000, () => {
  console.log('Server is running on port 5000');
});