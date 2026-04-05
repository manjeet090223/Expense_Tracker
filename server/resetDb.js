const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Transaction = require('./models/Transaction');

dotenv.config();

const resetDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        await User.deleteMany({});
        console.log('Users deleted');

        await Transaction.deleteMany({});
        console.log('Transactions deleted');

        console.log('Database cleared successfully');
        process.exit();
    } catch (error) {
        console.error('Error clearing database:', error);
        process.exit(1);
    }
};

resetDb();
