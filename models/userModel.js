const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema({
    firstname: {type:String},
    lastname: {type:String},
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    posts: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Post',
          required: true
        }
      ]
},{timestamps: true});

UserSchema.pre(
    'save',
    async function (next) {
        const user = this
        if (!user.isModified('password')) return next()
        const hash = await bcrypt.hash(user.password, 10);

        user.password = hash;
        next();
    }
);

UserSchema.methods.Valid = async function(password){
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
  
    return compare;
}
const UserModel = mongoose.model("User",UserSchema)
module.exports = UserModel