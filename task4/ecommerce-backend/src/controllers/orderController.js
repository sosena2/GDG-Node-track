import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const createOrder = async (req, res) => {
  try {
    const { customer } = req.body;
    
    // Validate customer info
    if (!customer || !customer.name || !customer.email || !customer.address || !customer.phone) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all customer information: name, email, address, and phone'
      });
    }
    
    // Get cart
    let cart = await Cart.findOne();
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Cart is empty'
      });
    }
    
    // Validate stock and prepare order items
    const orderItems = [];
    const productUpdates = [];
    
    for (const cartItem of cart.items) {
      const product = await Product.findById(cartItem.productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          error: `Product ${cartItem.name} not found`
        });
      }
      
      if (product.stock < cartItem.quantity) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for ${product.name}. Only ${product.stock} items available`
        });
      }
      
      orderItems.push({
        productId: product._id,
        quantity: cartItem.quantity,
        price: product.price,
        name: product.name
      });
      
      // Prepare stock update
      productUpdates.push({
        updateOne: {
          filter: { _id: product._id },
          update: { $inc: { stock: -cartItem.quantity } }
        }
      });
    }
    
    // Create order
    const order = await Order.create({
      items: orderItems,
      total: cart.total,
      customer,
      status: 'pending'
    });
    
    // Update product stock
    await Product.bulkWrite(productUpdates);
    
    // Clear cart
    cart.items = [];
    await cart.save();
    
    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 });
    
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

export {
  createOrder,
  getOrders,
  getOrderById
};