const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Product = require('./models/Product');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await User.deleteMany({});
        await Product.deleteMany({});

        const admin = await User.create({
            name: 'Admin',
            email: 'admin@fruitmstore.com',
            password: 'admin3000',
            role: 'admin',
            phone: '0321-4567890'
        });

        await User.create({
            name: 'Fatima Ali',
            email: 'fatima@gmail.com',
            password: 'customer123',
            role: 'customer',
            phone: '0300-1234567'
        });

        await User.create({
            name: 'Usman Malik',
            email: 'usman@gmail.com',
            password: 'customer789',
            role: 'customer',
            phone: '0333-9876543'
        });

        await User.create({
            name: 'Ayesha Hussain',
            email: 'ayesha@gmail.com',
            password: 'customer456',
            role: 'customer',
            phone: '0345-5556677'
        });

        const products = [
            {
                name: 'Fresh Apples',
                price: 250,
                description: 'Crispy red apples from northern orchards',
                image: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=400',
                category: 'Fruits',
                stock: 100,
                unit: 'kg',
                createdBy: admin._id
            },
            {
                name: 'Ripe Bananas',
                price: 120,
                description: 'Sweet yellow bananas, perfect for smoothies',
                image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400',
                category: 'Fruits',
                stock: 150,
                unit: 'dozen',
                createdBy: admin._id
            },
            {
                name: 'Juicy Oranges',
                price: 180,
                description: 'Fresh citrus oranges full of vitamin C',
                image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400',
                category: 'Fruits',
                stock: 80,
                unit: 'kg',
                createdBy: admin._id
            },
            {
                name: 'Sweet Mangoes',
                price: 350,
                description: 'Chaunsa mangoes from Multan',
                image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400',
                category: 'Fruits',
                stock: 60,
                unit: 'kg',
                createdBy: admin._id
            },
            {
                name: 'Fresh Grapes',
                price: 280,
                description: 'Seedless green grapes, farm fresh',
                image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400',
                category: 'Fruits',
                stock: 40,
                unit: 'kg',
                createdBy: admin._id
            },
            {
                name: 'Watermelon',
                price: 150,
                description: 'Large juicy watermelon, perfect for summer',
                image: 'https://images.unsplash.com/photo-1563114773-84221bd62daa?w=400',
                category: 'Fruits',
                stock: 30,
                unit: 'piece',
                createdBy: admin._id
            }
        ];

        await Product.insertMany(products);

        console.log('Seed data inserted successfully!');
        console.log('Admin: admin@fruitmstore.com / admin123');
        console.log('Customers: fatima@example.com, usman@example.com, ayesha@example.com / customer123');

        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
};

seedData();
