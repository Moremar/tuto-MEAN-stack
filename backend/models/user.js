const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// TODO remove the password and use only the hash (password added for easy testing only)

// definition of the User schema in MongoDB
// we do not define the ID field because Moongoose automatically creates an _id field.
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true }, // "unique" does not check unicity but allows optimization
    password: { type: String, required: true },
    hash: { type: String, required: true },
});

// Mongoose plugin to add a validation that all fields marked as "unique" (our email in our User class)
// cannot be inserted if another document of the collection has the same value
userSchema.plugin(uniqueValidator);

// create the Mongoose model used as a handle on the "users" collection
module.exports = mongoose.model('User', userSchema);