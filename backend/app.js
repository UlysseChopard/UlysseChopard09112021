const path = require("path");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

const app = express();

mongoose
  .connect(
    process.env.MONGODB_CONNSTRING || "mongodb+srv://new-user_31:ke49kSUpyk0GpP6P@clustergf.uglrk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
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
app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err });
});

module.exports = app;
