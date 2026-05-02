const Order = require('../models/Order');

// Controller to create a new order
// Expects JSON body with: customerName, items (array), totalBoxes, totalProtein, totalCalories, delivery(optional)
exports.createOrder = async (req, res) => {
  try {
    const { customerName, items, totalBoxes, totalProtein, totalCalories, delivery } = req.body;

    // Basic server-side validation to keep example safe and simple
    // Return a clear message when cart is empty
    if (!req.body.items || req.body.items.length === 0) {
      return res.status(400).json({ error: 'Cart cannot be empty' });
    }

    if (typeof totalBoxes !== 'number' || totalBoxes < 0) {
      return res.status(400).json({ error: 'Invalid payload: totalBoxes must be a non-negative number' });
    }

    if (typeof totalProtein !== 'number' || typeof totalCalories !== 'number') {
      return res.status(400).json({ error: 'Invalid payload: totalProtein and totalCalories must be numbers' });
    }

    // Ensure each item has a name and quantity
    for (const it of items) {
      if (!it.name || typeof it.quantity !== 'number' || it.quantity <= 0) {
        return res.status(400).json({ error: 'Invalid payload: each item must have a name and positive quantity' });
      }
    }

    const order = new Order({
      customerName: customerName || 'Guest',
      items: items || [],
      totalBoxes: totalBoxes || 0,
      totalProtein: totalProtein || 0,
      totalCalories: totalCalories || 0,
      delivery: delivery || null
    });

    const saved = await order.save();
    // Return saved order
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// Controller to list all orders
exports.listOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(100);
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};
