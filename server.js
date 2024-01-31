const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();
dotenv.config();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/property", require("./services/property/routers"));
app.use("/user", require("./services/user/routers"));
app.use("/admin", require("./services/admin/routers"));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Listening to port: " + PORT);
});

app.use("/", (req, res) => {
  res.send("Backend server is running.");
});
