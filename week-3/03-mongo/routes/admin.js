const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db");
const router = Router();

// Admin Routes
router.post("/signup", async (req, res) => {
  // Implement admin signup logic
  const username = req.body.username;
  const password = req.body.password;
  //check if the user is already present
  const result = await Admin.findOne({ username });
  if (result) {
    res.status(409).json({
      message: "Admin already exists in the database",
    });
    return;
  }

  //create user object
  const adminUser = new Admin({
    username,
    password,
  });

  //save the user data
  await adminUser.save();
  res.status(201).json({
    message: "Admin created successfully",
  });
});

router.post("/courses", adminMiddleware, async (req, res) => {
  // Implement course creation logic
  const course = new Course({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    imageLink: req.body.imageLink,
  });
  const result = await course.save();
  res.status(201).json({
    message: "Course created successfully",
    courseId: result._id,
  });
});

router.get("/courses", adminMiddleware, async (req, res) => {
  // Implement fetching all courses logic
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

module.exports = router;
