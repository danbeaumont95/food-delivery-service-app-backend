const { get } = require('lodash');
// import Session from '../model/Session';
const { UserSession } = require('../model/UserSession');
const { signJwt, decode } = require('../utils/jwt.utils');
// import { findUser } from './user.service';
// import User from '../model/Session';
const { User } = require('../model/User');
// CHANGE ALL THIS FILE TO USER CORRECT IMPORTS AND MODEL NAMES ETC

const createSession = async (userId, userAgent) => {
  const session = await Session.create({ user: userId, userAgent });
  return session.toJSON();
};

const createAccessToken = ({ user, session }) => {
  // Build and return the new access token
  const accessToken = signJwt(
    // eslint-disable-next-line no-underscore-dangle
    { ...user, session: session._id },
    { expiresIn: process.env.accessTokenTtl }, // 15 minutes
  );

  return accessToken;
};

const reIssueAccessToken = async ({ refreshToken }) => {
  // Decode the refresh token
  const { decoded } = decode(refreshToken);

  if (!decoded || !get(decoded, '_id')) return false;

  // Get the session
  const { session: sessiondId } = decoded;

  const session = await UserSession.findById({ _id: sessiondId }); // new wat

  // Make sure the session is still valid
  if (!session || !session?.valid) return false;

  const user = await findUser({ _id: session.user });
  if (!user) return false;

  const accessToken = createAccessToken({ user, session });
  return accessToken;
};

// eslint-disable-next-line max-len
const updateSession = async (query, update) => {
  return UserSession.updateOne(query, update);
};

const findSessions = async (query) => {
  return UserSession.find(query).lean();
};

module.exports = {
  createSession,
  createAccessToken,
  reIssueAccessToken,
  updateSession,
  findSessions
};