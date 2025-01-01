const mongoose = require("mongoose");
const { user, payment } = require("../models"); // Import the models

// Connect to the database
mongoose
  .connect("mongodb://127.0.0.1:27017/clerkie_challenge", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB: ", err);
    process.exit(1);
  });

// Sample user data
const users = [
  { active: true, signup_date: new Date("2023-01-01") },
  { active: true, signup_date: new Date("2023-02-15") },
  { active: false, signup_date: new Date("2023-03-20") },
];

// Sample payment data
const payments = [
  { name: "Payment 1", amount: 100, date: new Date("2023-01-05"), user: null },
  { name: "Payment 2", amount: 200, date: new Date("2023-02-10"), user: null },
  { name: "Payment 3", amount: 150, date: new Date("2023-03-15"), user: null },
];

// Function to initialize the data
const initializeData = async () => {
  try {
    // Create users
    const createdUsers = await user.create(users);

    // Assign the created user to the payment
    payments[0].user = createdUsers[0]._id;
    payments[1].user = createdUsers[1]._id;
    payments[2].user = createdUsers[2]._id;

    // Create payments
    await payment.create(payments);

    console.log("Data initialized successfully!");
    process.exit();
  } catch (err) {
    console.error("Error initializing data: ", err);
    process.exit(1);
  }
};

// Run the initialization
initializeData();
