const mongoose = require('mongoose');

const User = mongoose.model('User', {
  name: String,
  email: String,
  password: String,
  role: String || Number
});

const Product = mongoose.model('Product', {
  name: String,
  image: String,
  price: String,
  viewed: { type: Number, default: 0 },
  purchased: { type: Number, default: 0 },
  reOrdered: { type: Number, default: 0 }
});

module.exports ={ User, Product }