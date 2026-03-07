import mongoose from 'mongoose';

try {
    // Connect
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) throw new Error('MONGO URI missing, check your .env file');

    await mongoose.connect(MONGO_URI, {
        dbName: 'blog', // Replace with actual database name
    });
    console.log('\x1b[35mMongoDB connected via Mongoose\x1b[0m');
} catch (error) {
    // log error and end Node process if it fails
    console.error('MongoDB connection error:', error);
    process.exit(1);
}
