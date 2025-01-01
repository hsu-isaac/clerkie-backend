const models = require("../incorrect.js");

async function initializeDB() {
  try {
    // Create a sample user
    const user = new models.user({
      signup_date: new Date(),
    });
    await user.save();
    console.log("User created:", user);

    // Create a sample payment associated with the user
    const payment = new models.payment({
      name: "Sample Payment",
      amount: 100.5,
      date: new Date(),
      user: user._id,
    });
    await payment.save();
    console.log("Payment created:", payment);

    // Close the connection
    models.mongoose.connection.close();
    console.log("Database initialization complete.");
  } catch (error) {
    console.error("Error initializing database:", error);
    models.mongoose.connection.close();
  }
}

initializeDB();
