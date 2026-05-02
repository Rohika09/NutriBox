const mongoose = require('mongoose');

// Order schema: stores what user ordered and summary nutrition
const OrderSchema = new mongoose.Schema({
  customerName: { type: String, default: 'Guest' },
  items: { type: Array, default: [] }, // array of cart items (name, quantity, nutrition)
  totalBoxes: { type: Number, default: 0 },
  totalProtein: { type: Number, default: 0 },
  totalCalories: { type: Number, default: 0 },
  delivery: {
    date: { type: String },
    time: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
