const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
    try {
        const { customerName, customerEmail, customerPhone, deliveryOption, deliveryAddress, paymentMethod, cardDetails } = req.body;
        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }
        if (deliveryOption === 'delivery' && !deliveryAddress) {
            return res.status(400).json({ message: 'Delivery address is required' });
        }
        const order = new Order({
            userId: req.user._id,
            items: cart.items,
            totalAmount: cart.totalAmount,
            customerName,
            customerEmail,
            customerPhone,
            deliveryOption,
            deliveryAddress: deliveryOption === 'delivery' ? deliveryAddress : null,
            paymentMethod,
            cardDetails: paymentMethod === 'Card' ? {
                cardNumber: cardDetails?.cardNumber?.slice(-4).padStart(16, '*'),
                cardHolder: cardDetails?.cardHolder,
                expiryDate: cardDetails?.expiryDate
            } : null,
            paymentStatus: 'completed',
            status: 'confirmed'
        });
        await order.save();
        cart.items = [];
        cart.totalAmount = 0;
        await cart.save();
        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Failed to place order', error: error.message });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, userId: req.user._id });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch order', error: error.message });
    }
});

module.exports = router;
