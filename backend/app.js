const path = require("path");
const mongoose = require("mongoose");
const express = require("express");

const { getSecret } = require("./docker-secrets");

// Middlewares
const cors = require("cors");
const helmet = require("helmet");
const { apiLimiter } = require("./middleware/rate-limit");

// Routes
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

const app = express();

const dbUser = encodeURIComponent(getSecret(process.env.DB_USER));
const dbPass = encodeURIComponent(getSecret(process.env.DB_PASS));
const dbName = encodeURIComponent(getSecret(process.env.DB_NAME));

console.log("db_name", process.env.DB_NAME);
const mongoURI =
  `mongodb://${dbUser}:${dbPass}@database:27017/${dbName}` ||
  process.env.MONGO_CONNSTRING_ATLAS;

console.log(mongoURI);
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error"));

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use("/api/", apiLimiter);

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/demo", express.static(path.join(__dirname, "demo")));
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err });
});

module.exports = app;
