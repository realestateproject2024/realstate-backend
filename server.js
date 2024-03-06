const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

//import routes here
const combineRouters = require("./services/combinedRouters");

app.use("/api", (req, res) => {
  res.send({ message: "Backend server running..." });
});

app.use("/", combineRouters);

// app.use("/enquiry", require("./services/enquiry/routers"));

app.use("/files/property", express.static("files/property"));
app.use("/files/bank", express.static("files/bank"));

// app.use("/", (req, res) => {
//   res.send("Backend server is running.");
// });

const PORT = process.env.PORT || 3001;

app.listen(PORT, () =>
  console.log(`Server connected to port ${PORT} successfully.`)
);

mongoose
  .connect(process.env.MONGO_CONNECTION_URL)
  .then((res) => console.log("Database connection successful."))
  .catch((error) => console.log("Error while connecting to database: ", error));
