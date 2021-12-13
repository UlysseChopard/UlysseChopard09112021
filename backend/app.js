const path = require("path");
const mongoose = require("mongoose");
const express = require("express");

// Middlewares
const cors = require("cors");
const helmet = require("helmet");
const { apiLimiter } = require("./middleware/rate-limit");

// Routes
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

const app = express();

mongoose
  .connect(
    process.env.MONGODB_CONNSTRING || process.env.MONGO_CONNSTRING_ATLAS,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use("/api/", apiLimiter);

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err });
});

module.exports = app;
