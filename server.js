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
    origin: [
      "http://localhost:3000", // frontend on local dev
      "https://canova-frontend.netlify.app", // frontend on Netlify
    ],
    credentials: true, // allow cookies
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/user", UserRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
