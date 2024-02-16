const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use("/user", require("./services/user/userRouters"));
app.use("/userObligations", require("./services/user/obligationRoutes"));
app.use("/property", require("./services/property/routers"));
app.use("/admin", require("./services/admin/routers"));
app.use("/bank", require("./services/bank/routers"));

app.use("/files/property", express.static("files/property"));

app.use("/", (req, res) => {
  res.send("Backend server is running.");
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () =>
  console.log(`Server connected to port ${PORT} successfully.`)
);

mongoose
  .connect(process.env.MONGO_CONNECTION_URL)
  .then((res) => console.log("Database connection successful."))
  .catch((error) => console.log("Error while connecting to database: ", error));
