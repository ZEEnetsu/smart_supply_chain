// scripts/dropIndex.js
import mongoose from 'mongoose';
import 'dotenv/config';

await mongoose.connect(process.env.MONGODB_URI);

await mongoose.connection.collection('routenodes').dropIndex('name_1');
console.log('Dropped stale routeName_1 index');

await mongoose.disconnect();