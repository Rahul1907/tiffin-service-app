import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MenuItem from '../models/MenuItem.js';

dotenv.config();

const sampleMenuItems = [
  {
    name: 'Special Gujarati Thali',
    description: 'Authentic Gujarati meal: 4 Soft Rotis, Shaak of the day (Dry & Gravy), Gujarati Dal, Steamed Basmati Rice, Masala Chaas, and homemade Sweet of the day.',
    price: 150,
    category: 'lunch',
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&q=80&w=600',
    isAvailableToday: true,
  },
  {
    name: 'Premium Punjabi Combo',
    description: 'Rich North-Indian combo: Butter Paneer Masala, Dal Makhani, Veg Pulao, 3 Butter Phulka, roasted papad, and green salad.',
    price: 180,
    category: 'both',
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=600',
    isAvailableToday: true,
  },
  {
    name: 'Kathiyawadi Khichdi Kadhi Special',
    description: 'Traditional comforting Kathiyawadi meal: Garlicky Lasaniya Bateta, Masala Khichdi, Gujarati Kadhi, 2 Bajra Rotla with white butter, and fresh garlic chutney.',
    price: 160,
    category: 'dinner',
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=600',
    isAvailableToday: true,
  },
  {
    name: 'Ahmedabadi Non-Veg Egg Curry Combo',
    description: 'Flavourful home-style egg dinner: 2 boiled eggs in spicy thick gravy, Jeera Rice, 3 whole-wheat chapatis, and sliced onions with lemon.',
    price: 160,
    category: 'dinner',
    isVeg: false,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
    isAvailableToday: true,
  },
  {
    name: 'Executive Mini Meal',
    description: 'Simple everyday lunch: 3 Phulka Roti, dry-spiced seasonal Sabzi, Dal Tadka, and Steamed Rice. Perfect for office-goers.',
    price: 100,
    category: 'lunch',
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
    isAvailableToday: true,
  },
  {
    name: 'Healthy Diet Tiffin',
    description: 'Low-calorie nutritious option: Multigrain Rotis (2 pcs), boiled sprouts salad, steamed brown rice, light Yellow Dal, and sugar-free curd.',
    price: 130,
    category: 'both',
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600',
    isAvailableToday: true,
  },
  {
    name: 'Home-style Chicken Thali',
    description: 'Rich home-cooked chicken feast: Traditional Chicken Curry (semi-gravy), aromatic Basmati Rice, 3 Chapati, and cooling cucumber raita.',
    price: 220,
    category: 'dinner',
    isVeg: false,
    imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=600',
    isAvailableToday: true,
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/tiffinexpress';
    console.log(`Connecting to database: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing Menu Items...');
    await MenuItem.deleteMany();

    console.log('Seeding Menu Items...');
    await MenuItem.insertMany(sampleMenuItems);

    console.log('Database successfully seeded with menu items!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
