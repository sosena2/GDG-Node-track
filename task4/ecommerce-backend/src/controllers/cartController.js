import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const getCart = async (req, res) => {
  try {

    let cart = await Cart.findOne();
    
    if (!cart) {
      cart = await Cart.create({ items: [] });
    }
    
    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('getCart error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    // Validate input
    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        error: 'Please provide productId and quantity'
      });
    }
    
    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Quantity must be greater than 0'
      });
    }
    
    // Find product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        error: `Insufficient stock. Only ${product.stock} items available`
      });
    }
    
    // Get or create cart
    let cart = await Cart.findOne();
    if (!cart) {
      cart = await Cart.create({ items: [] });
    }
    
    // Check if item already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );
    
    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      // Check stock again with updated quantity
      if (product.stock < newQuantity) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for requested quantity. Only ${product.stock} items available total`
        });
      }
      
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      cart.items.push({
        productId: product._id,
        quantity,
        price: product.price,
        name: product.name
      });
    }
    
    await cart.save();
    
    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('addToCart error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

const updateCart = async (req, res) => {
  try {
    const { items } = req.body;
    
    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        error: 'Items must be an array'
      });
    }
    
    // Validate all items
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          error: `Product ${item.productId} not found`
        });
      }
      
      if (item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Quantity must be greater than 0'
        });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for ${product.name}. Only ${product.stock} items available`
        });
      }
    }
    
    let cart = await Cart.findOne();
    if (!cart) {
      cart = await Cart.create({ items: [] });
    }
    
    // Transform items to include required fields
    const cartItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);
        return {
          productId: product._id,
          quantity: item.quantity,
          price: product.price,
          name: product.name
        };
      })
    );
    
    cart.items = cartItems;
    await cart.save();
    
    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('updateCart error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    
    let cart = await Cart.findOne();
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }
    
    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Item not found in cart'
      });
    }
    
    cart.items.splice(itemIndex, 1);
    await cart.save();
    
    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('removeFromCart error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne();
    
    if (!cart) {
      cart = await Cart.create({ items: [] });
    }
    
    cart.items = [];
    await cart.save();
    
    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('clearCart error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

export {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  clearCart
};