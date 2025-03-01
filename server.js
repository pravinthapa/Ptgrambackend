const express = require("express");
const path = require("path");
const http = require("http"); // Import http module
const ErrorHandeler = require("./middleware/ErrorHandeler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const cors = require("cors");

connectDb();
const app = express();

// Set port from environment variable or default to 3000
const port = process.env.Port || 3000;

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/contact", require("./routes/Routes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api", require("./routes/postRoutes"));
app.use("/api/message", require("./routes/chatRoutes"));
app.use(ErrorHandeler);

// Create HTTP server instead of using app.listen
http.createServer(app).listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
