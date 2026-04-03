import bcrypt from 'bcrypt';
import crypto from 'crypto';
import createHttpError from 'http-errors';
import { UsersCollection } from '../db/user.js';
import { SessionsCollection } from '../db/session.js';

export const registerUser = async (payload) => {
  // 1. No same email registered!)
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user) {
    throw createHttpError(409, 'Email in use'); // Conflict
  }

  // 2. Unrecognizable pwd
  // 10 standard for crypting
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  // 3. Add new user to db with the user input(payload)
  return await UsersCollection.create({
    ...payload,
    password: hashedPassword,
  });
};

// TOKEN SPANS)
const ACCESS_TOKEN_LIFETIME = 15 * 60 * 1000; // 15 min
const REFRESH_TOKEN_LIFETIME = 30 * 24 * 60 * 60 * 1000; // 30 days

export const loginUser = async (payload) => {
  // 1. Is there a user?
  const user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(401, 'User not found');
  }

  // 2. Is pwd correct? (via bcrypt)
  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  // 3. Clean the old session
  await SessionsCollection.deleteOne({ userId: user._id });

  // 4. Creating new tokens
  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  // 5. Save the session to db
  return await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_LIFETIME),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_LIFETIME),
  });
};
