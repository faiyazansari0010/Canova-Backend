const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const UserRoutes = require("./routes/UserRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const connectDB = require("./database/connection");

connectDB();

app.use(
  cors({
    origin: "https://canova-frontend.netlify.app",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/user", UserRoutes);

app.get("/", (req, res) => {
  res.status(200).send("Canova Backend is Running");
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
