const { User } = require("./schemas/user");

const updateSubscription = async (userId, subscription) => {
  return User.findByIdAndUpdate(userId, { subscription }, { new: true });
};

module.exports = {
  updateSubscription,
};
