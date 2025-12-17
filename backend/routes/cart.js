const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            cart = new Cart({ userId: req.user._id, items: [], totalAmount: 0 });
            await cart.save();
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch cart', error: error.message });
    }
});

router.post('/add', auth, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        let cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            cart = new Cart({ userId: req.user._id, items: [], totalAmount: 0 });
        }
        const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += quantity;
            cart.items[existingItemIndex].subtotal = cart.items[existingItemIndex].quantity * cart.items[existingItemIndex].unitPrice;
        } else {
            cart.items.push({
                productId: product._id,
                productName: product.name,
                quantity,
                unitPrice: product.price,
                subtotal: product.price * quantity
            });
        }
        cart.totalAmount = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
        cart.lastModified = new Date();
        await cart.save();
        res.json({ message: 'Item added to cart', cart });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add item', error: error.message });
    }
});

router.put('/update/:itemId', auth, async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        const itemIndex = cart.items.findIndex(item => item._id.toString() === req.params.itemId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }
        if (quantity <= 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
            cart.items[itemIndex].subtotal = quantity * cart.items[itemIndex].unitPrice;
        }
        cart.totalAmount = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
        cart.lastModified = new Date();
        await cart.save();
        res.json({ message: 'Cart updated', cart });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update cart', error: error.message });
    }
});

router.delete('/remove/:itemId', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
        cart.totalAmount = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
        cart.lastModified = new Date();
        await cart.save();
        res.json({ message: 'Item removed from cart', cart });
    } catch (error) {
        res.status(500).json({ message: 'Failed to remove item', error: error.message });
    }
});

router.delete('/clear', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id });
        if (cart) {
            cart.items = [];
            cart.totalAmount = 0;
            cart.lastModified = new Date();
            await cart.save();
        }
        res.json({ message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to clear cart', error: error.message });
    }
});

module.exports = router;
