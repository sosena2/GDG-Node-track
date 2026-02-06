import mongoose from'mongoose';

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true

    },
    quantity:{
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
        default: 1
    },
    price: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    }
});

const cartSchema = new mongoose.Schema({
    items: [cartItemSchema],
    total: {
        type:
        Number,
        default: 0
    },
    createdAt: {
        type: Date, 
        default: Date.now
    },
    updatedAt :{
        type: Date,
        default: Date.now
    }
});

cartSchema.pre('save', function () {
    this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.updatedAt = Date.now();
});

export default mongoose.model('Cart', cartSchema);