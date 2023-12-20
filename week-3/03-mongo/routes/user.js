const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");

// User Routes
router.post("/signup", async (req, res) => {
  // Implement user signup logic
  const username = req.body.username;
  const password = req.body.password;

  //check if the user is already present
  const result = await User.findOne({ username });
  if (result) {
    res.status(409).json({
      message: "User already exists in the database",
    });
    return;
  }

  //create user object
  const user = new User({
    username,
    password,
    purchasedCourses: [],
  });

  //save the user data
  await user.save();
  res.status(201).json({
    message: "User created successfully",
  });
});

router.get("/courses", async (req, res) => {
  // Implement listing all courses logic
  const result = await Course.find();
  //format the output
  const output = result.map((course) => {
    return {
      id: course._id,
      title: course.title,
      description: course.description,
      price: course.price,
      imageLink: course.imageLink,
    };
  });
  res.json({ courses: output });
});

router.post("/courses/:courseId", userMiddleware, async (req, res) => {
  // Implement course purchase logic
  const courseId = req.params.courseId;
  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404).json({
      message: "Course not found",
    });
    return;
  }
  const user = await User.findOne({ username: req.headers.username });
  //check if the courseId is already present or not
  if (user.purchasedCourses.indexOf(course._id) !== -1) {
    res.status(409).json({
      message: "You have already purchased this course",
    });
    return;
  }
  //add the courseId and save the data
  user.purchasedCourses.push(course._id);
  await User.updateOne(
    { username: req.headers.username },
    { $set: { purchasedCourses: user.purchasedCourses } }
  );
  res.json({
    message: "Course purchased successfully",
  });
});

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
  // Implement fetching purchased courses logic
  const user = await User.findOne({ username: req.headers.username });
  const purchasedCourses = [];
  for (let i = 0; i < user.purchasedCourses.length; ++i) {
    const course = await Course.findById(user.purchasedCourses[i]);
    purchasedCourses.push({
      id: course._id,
      title: course.title,
      description: course.description,
      price: course.price,
      imageLink: course.imageLink,
    });
  }
  res.json({ purchasedCourses });
});

module.exports = router;
