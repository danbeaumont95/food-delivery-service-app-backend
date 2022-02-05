const { get } = require('lodash');

const { decode } = require('../utils/jwt.utils');
const { reIssueAccessToken } = require('../service/userSession.service');

exports.deserializeUser = async (req, res, next) => {
  const accessToken = get(req, 'headers.authorization', '').replace(
    /^Bearer\s/,
    '',
  );
  const refreshToken = get(req, 'headers.x-refresh');
  if (!accessToken) return next();
  const { decoded, expired } = decode(accessToken);
  if (decoded) {
    // @ts-ignore
    req.user = decoded;
    return next();
  }
  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });

    if (newAccessToken) {
      // Add the new access token to the response header
      res.setHeader('x-access-token', newAccessToken);
      // eslint-disable-next-line no-shadow
      const { decoded } = decode(accessToken);

      // @ts-ignore
      req.user = decoded;
    }
    return next();
  }
  return next();
};
