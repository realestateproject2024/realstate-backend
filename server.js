const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();
dotenv.config();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/user", require("./services/user/routers"));
app.use("/property", require("./services/property/routers"));
app.use("/admin", require("./services/admin/routers"));

app.use("/", (req, res) => {
  res.send("Backend server is running.");
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () =>
  console.log(`Database connected to ${PORT} successfully.`)
);

mongoose
  .connect(process.env.MONGO_CONNECTION_URL)
  .then((res) => console.log("Connect to MongoDB"))
  .catch((error) => console.log("Error while connecting to database: ", error));
