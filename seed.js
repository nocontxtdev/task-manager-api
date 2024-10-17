const mongoose = require("mongoose");
const User = require("./models/User");
const Task = require("./models/Task");
const { faker } = require("@faker-js/faker"); // Faker will generate random user data
const { ConnectionPoolClosedEvent } = require("mongodb");
const { exit } = require("process");
require("dotenv").config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Function to create 10 dummy users
const createDummyUsers = async () => {
  let createdUsers = [];
  for (let i = 0; i < 10; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({
      firstName: firstName.toLowerCase(),
      lastName: lastName.toLowerCase(),
    });
    const name = `${firstName} ${lastName}`;
    password = "password@123";

    const user = new User({
      name,
      email,
      password,
    });

    const createdUser = await user.save();
    createdUsers.push(createdUser);
    console.log(createdUser);
  }

  console.log("10 Dummy users created");
  return createdUsers; // Return created users so we can use them to assign tasks
};

// Function to create 3-5 tasks for each user
const createDummyTasks = async (users) => {
  for (let user of users) {
    const numTasks = Math.floor(Math.random() * 3) + 3; // 3 to 5 tasks per user
    const tasks = [];
    const status = ["Not Started", "In Progress", "Completed"];
    const random = Math.floor(Math.random() * status.length);
    for (let i = 0; i < numTasks; i++) {
      tasks.push({
        title: faker.hacker.phrase(), // Random title from faker
        description: faker.lorem.paragraph({ min: 2, max: 5 }), // Random description
        user: user._id, // Assign user to the task
        dueDate: faker.date.future(), // Random future due date
        status: status[random],
      });
    }

    console.log(tasks);
    await Task.insertMany(tasks);
    console.log(`Created ${numTasks} tasks for user ${user.name}`);
  }
};

// Run seeding functions
const seedDatabase = async () => {
  try {
    // Clear existing data (optional, if you want to reset the database)
    await User.deleteMany({});
    await Task.deleteMany({});

    // Create users and tasks
    const users = await createDummyUsers(); // Create 10 users
    await createDummyTasks(users); // Assign 3-5 tasks per user

    mongoose.connection.close();
    console.log("Seeding completed!");
  } catch (err) {
    console.error("Error seeding database: ", err);
  }
};

seedDatabase();
