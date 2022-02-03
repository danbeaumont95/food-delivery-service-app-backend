const { get } = require('lodash');

exports.requiresUser = async (req, res, next) => {
  const user = get(req, 'user');
  console.log(user, 'user in requires user');
  if (!user) {
    return res.status(401).json({ msg: 'Unable to send request' });
  }
  return next();
};

