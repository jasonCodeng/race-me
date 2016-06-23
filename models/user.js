var mongoose = require("mongoose"),
	passportMongoose = require("passport-local-mongoose"),
  bcrypt = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({
	fullname: String,
	username: {type: String, unique: true},
	password: String,
	created: {type: Date, default: new Date().toString()}
});

userSchema.pre('save', function(next) {
  const user = this;

  bcrypt.genSalt(32, function(error, salt) {
    if (error) {
      return next(error);
    }

    bcrypt.hash(user.password, salt, null, function(error, hash) {
      if (error) {
        return next(error);
      }

      user.password = hash;
      next();
    })
  })
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(error, isMatch) {
    if (error) {
      return callback(error);
    }

    callback(null, isMatch);
  });
};

// userSchema.plugin(passportMongoose);

module.exports = mongoose.model("User", userSchema);
