const mongoose = require("mongoose");

const thingSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    userId: { type: String, required: true },
    price: { type: Number, required: true },
});

module.exports = mongoose.model("Thing", thingSchema);

const userSchema = require("./user").schema;
const userId = userSchema.userId;

const sauceSchema = mongoose.Schema({
    userId: { type: userId, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true, min: 1, max: 10 },
    likes: { type: Number, required: false, min: 0 },
    dislikes: { type: Number, required: false, min: 0 },
    usersLiked: [{ type: userId, required: false }],
    usersDisliked: [ { type: userId, required: false }]
});

module.exports = mongoose.model("sauce", sauceSchema);