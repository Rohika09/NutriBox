# NUTREEBOX - Personalized Health Meal Platform

A comprehensive web application for personalized nutrition planning and meal building, designed to help users create their perfect meal box based on their unique dietary needs and preferences.

## 🌟 Features

### Core Features
- **Personalized Nutrition Calculation**: Uses the Mifflin-St Jeor Equation to calculate BMR and TDEE
- **Region Selection**: Choose from Indian, Mediterranean, Asian, or Western cuisines
- **Dietary Preferences**: Vegetarian and Non-vegetarian options
- **Health Goals**: Weight loss, muscle gain, or maintenance targets
- **Smart Meal Suggestions**: Curated meals based on your preferences and nutrition needs

### Advanced Meal Building
- **Pre-made Meals**: Select from a comprehensive database of regional meals
- **Custom Meal Builder**: Build meals from individual ingredients with real-time nutrition tracking
- **Search Functionality**: Search through meals and ingredients for easy discovery
- **Category Filtering**: Filter by protein, carbs, vegetables, fruits, and more

### Real-time Nutrition Tracking
- **Progress Visualization**: Visual progress bars showing nutrition targets
- **Protein Limit Alerts**: Smart notifications when you reach your daily protein goal
- **Nutrition Analytics**: Track your daily nutrition intake and view historical data
- **Meal Planning**: Save and manage your favorite meal combinations

### Dietary Management
- **Dietary Restrictions**: Add and manage food allergies and restrictions
- **Smart Filtering**: Automatically hide meals/ingredients that don't meet your restrictions
- **Nutrition History**: Track your daily nutrition intake over time

### User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful gradients, animations, and intuitive interface
- **Smart Notifications**: Real-time feedback and alerts
- **Data Persistence**: Your preferences and data are saved locally

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software installation required

### Installation
1. Clone or download the project files
2. Open `index.html` in your web browser
3. Start building your personalized meal box!

### Development Setup
```bash
# Install live-server for development
npm install

# Start development server
npm start
```

## 📱 How to Use

### Step 1: Personal Details
1. Enter your age, height, weight, and activity level
2. Click "Calculate My Needs" to get your personalized nutrition targets

### Step 2: Preferences
1. Select your preferred cuisine region
2. Choose vegetarian or non-vegetarian
3. Set your health goal (weight loss, muscle gain, maintenance)

### Step 3: Meal Building
1. **Pre-made Meals**: Browse and select from curated meal options
2. **Custom Builder**: Create your own meals by selecting individual ingredients
3. Use the search box to quickly find specific meals or ingredients
4. Monitor your nutrition progress in real-time

### Step 4: Advanced Features
- **Add Restrictions**: Click "Add Restriction" to filter out specific ingredients
- **Save Plans**: Create and save meal plans for future use
- **Track Nutrition**: Monitor your daily nutrition intake
- **View Analytics**: See your nutrition trends over time

## 🛠️ Technical Details

### Technologies Used
- **HTML5**: Semantic structure and accessibility
- **CSS3**: Modern styling with Tailwind CSS framework
- **JavaScript (ES6+)**: Dynamic functionality and data management
- **Local Storage**: Data persistence without server requirements

### Key Algorithms
- **Mifflin-St Jeor Equation**: Accurate BMR calculation
- **Macronutrient Distribution**: Optimal protein, carbs, and fat ratios
- **Real-time Filtering**: Efficient search and category filtering

### Data Structure
- **Meal Database**: Comprehensive collection of regional meals with nutrition data
- **Ingredient Database**: Detailed ingredient information with serving sizes
- **User Data**: Personalized nutrition targets and preferences

## 🎯 Real-World Problem Solving

### Health & Nutrition
- **Personalized Nutrition**: Tailored recommendations based on individual needs
- **Dietary Compliance**: Easy management of food allergies and restrictions
- **Progress Tracking**: Monitor nutrition goals and achievements

### User Experience
- **Accessibility**: Search functionality for quick meal discovery
- **Visual Feedback**: Progress bars and notifications for user guidance
- **Data Insights**: Analytics to understand nutrition patterns

### Practical Features
- **Meal Planning**: Save and reuse successful meal combinations
- **Smart Alerts**: Protein limit notifications to prevent overconsumption
- **Regional Cuisine**: Cultural dietary preferences and traditional meals

## 📊 Features Overview

| Feature | Description | Benefit |
|---------|-------------|---------|
| Nutrition Calculator | Personalized BMR/TDEE calculation | Accurate nutrition targets |
| Custom Meal Builder | Build meals from individual ingredients | Complete meal customization |
| Search Functionality | Find meals and ingredients quickly | Improved user experience |
| Protein Limit Alerts | Smart notifications at protein goals | Prevent overconsumption |
| Dietary Restrictions | Filter out problematic ingredients | Allergy and preference management |
| Meal Planning | Save and manage meal combinations | Convenient meal preparation |
| Nutrition Analytics | Track daily intake and trends | Long-term health monitoring |
| Regional Cuisines | Cultural dietary preferences | Diverse meal options |

## 🔧 Customization

### Adding New Meals
Edit the `mealDatabase` object in `script.js` to add new meals:
```javascript
{
  name: "Meal Name",
  ingredients: "ingredient1, ingredient2, ingredient3",
  protein: 25,
  calories: 350,
  carbs: 45,
  fat: 12,
  category: "protein",
  region: "indian",
  diet: "vegetarian"
}
```

### Adding New Ingredients
Edit the `ingredientDatabase` object in `script.js` to add new ingredients:
```javascript
{
  name: "Ingredient Name",
  protein: 10,
  calories: 100,
  carbs: 15,
  fat: 5,
  serving: "100g",
  category: "proteins"
}
```

## 🎨 Design Philosophy

### User-Centered Design
- **Intuitive Interface**: Easy-to-use layout with clear navigation
- **Visual Hierarchy**: Important information is prominently displayed
- **Responsive Design**: Consistent experience across all devices

### Accessibility
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Semantic HTML structure
- **Color Contrast**: High contrast ratios for readability

## 🚀 Future Enhancements

### Planned Features
- **Recipe Integration**: Step-by-step cooking instructions
- **Social Features**: Share meal plans with friends and family
- **Barcode Scanning**: Quick ingredient addition via product scanning
- **Nutrition Coaching**: AI-powered meal recommendations
- **Export Functionality**: Export meal plans and nutrition data

### Technical Improvements
- **Offline Support**: Progressive Web App capabilities
- **Data Sync**: Cloud storage for cross-device access
- **API Integration**: Connect with nutrition databases
- **Performance Optimization**: Faster loading and smoother animations

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support or questions, please open an issue in the project repository.

---

**NUTREEBOX** - Making personalized nutrition accessible and enjoyable for everyone! 🌱 