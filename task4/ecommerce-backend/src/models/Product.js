import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'product name is required'],
        trim: true,
        maxlength: [100, 'product name can not exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'product description is required'],
        maxlength: [500, 'Description can not exceed 500 characters']
    },
    price: {
        type: Number,
        required: [true, 'product price is required'],
        min: [0, 'price must be a positive number']
    },
    stock: {
        type: Number,
        required: [true, 'Stock quantity is required'],
        min: [0, 'stock can not be negative'],
        default : 0
    },
    category: {
        type: String,
        required: [true, 'Product category is required'],
        trim: true
    },
    imageUrl: {
        type: String,
        required: true,
        default: 'https://via.placeholder.com/300'
    },
    createdAt:{
        type: Date, 
        default: Date.now
    }
}) ;
const productModel = mongoose.model('product', productSchema);
export default productModel;