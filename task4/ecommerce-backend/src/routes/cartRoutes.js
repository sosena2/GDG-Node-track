import express from 'express';
import {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  clearCart
} from '../controllers/cartController.js';

const router = express.Router();
router.route('/')
  .get(getCart)
  .post(addToCart)
  .put(updateCart)
  .delete(clearCart);

router.route('/:productId')
  .delete(removeFromCart);

export default router;