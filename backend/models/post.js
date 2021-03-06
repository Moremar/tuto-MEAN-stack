const mongoose = require('mongoose');

// definition of the Post schema in MongoDB
// we do not define the ID field because Moongoose automatically creates an _id field.
const postSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    imagePath: { type: String, required: true },
});

// create the Mongoose model used as a handle on the "posts" collection
module.exports = mongoose.model('Post', postSchema);