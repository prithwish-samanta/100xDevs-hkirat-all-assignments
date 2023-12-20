const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");

const PORT = 3000;

// Middleware for parsing request bodies
app.use(bodyParser.json());
app.use("/admin", adminRouter);
app.use("/user", userRouter);

//global error handler
app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(500).json({
    message: "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
