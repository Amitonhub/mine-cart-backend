const { Product } = require("../schemas");
const cloudinary = require('cloudinary').v2;

const addProduct = async (req, res) => {
  const { price, name, image } = req.body;

  try {
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(image, {
      folder: 'products', 
    });

    // Create a new product with the Cloudinary image URL
    const newProduct = new Product({
      name,
      price,
      image: result.secure_url,
    });

    const savedProduct = await newProduct.save();
    res
      .status(200)
      .json({ message: "Product added successfully", product: savedProduct });
  } catch (error) {
    res.status(500).json({ message: "Error adding product", error });
  }
};

const allProducts = async (req, res) => {
  try {
    // Fetch all products
    const products = await Product.find({});
    
    // Increment viewed count for each product
    const updatedProducts = await Promise.all(products.map(async (product) => {
      product.viewed += 1;
      await product.save();
      return product;
    }));

    // Send updated products in response
    res.status(200).json(updatedProducts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.body.productId;
    const updatedProductData = req.body.updatedProduct;

    // Find the product by its ID
    const product = await Product.findById(productId);

    // Check if the product exists
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the product fields
    product.name = updatedProductData.name;
    product.price = updatedProductData.price;
    product.image = updatedProductData.image;

    // Save the updated product
    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
};


module.exports = { addProduct, allProducts, updateProduct };
