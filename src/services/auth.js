import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import { SMTP, TEMPLATES_DIR } from '../constants/index.js';
import { env } from '../utils/env.js';
import { sendEmail } from '../utils/sendMail.js';

// --- HELPER FUNCTION ---
const createSessionData = () => {
  return {
    accessToken: randomBytes(30).toString('base64'),
    refreshToken: randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};

// --- SERVICES ---

export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use');

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({
    ...payload,
    password: hashedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (!user) throw createHttpError(401, 'User not found');

  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) throw createHttpError(401, 'Unauthorized');

  await SessionsCollection.deleteOne({ userId: user._id });

  const sessionData = createSessionData();

  return await SessionsCollection.create({
    userId: user._id,
    ...sessionData,
  });
};

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) throw createHttpError(401, 'Session not found');

  if (new Date() > new Date(session.refreshTokenValidUntil)) {
    throw createHttpError(401, 'Session token expired');
  }

  await SessionsCollection.deleteOne({ _id: sessionId });

  const newSessionData = createSessionData();

  return await SessionsCollection.create({
    userId: session.userId,
    ...newSessionData,
  });
};

export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

// --- RESET PASSWORD --- //

//PREPARATION FOR RESET//
export const requestResetToken = async (email) => {
  // 1. USER CHECK, THROW 404
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  // 2. TOKEN EXPIRES IN 5 MIN
  const resetToken = jwt.sign({ sub: user._id, email }, env('JWT_SECRET'), {
    expiresIn: '5m',
  });

  // 3. PREPARE EMAIL TEMPLATE
  const templatePath = path.join(TEMPLATES_DIR, 'reset-password-email.html');
  const templateSource = (await fs.readFile(templatePath)).toString();
  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  // 4. SEND CHECK, THROW 505
  try {
    await sendEmail({
      from: env(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (error) {
    console.error('Email send error:', error);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

//RESET PASSWORD//
export const resetPassword = async (payload) => {
  let entries;

  // 1. IS TOKEN STILL VALID? IF NOT, THROW 401
  try {
    entries = jwt.verify(payload.token, env('JWT_SECRET'));
  } catch (err) {
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  // 2. FIND USE VIA EMAIL & ID IN THE TOKEN
  const user = await UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  // THROW 404
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  // 3. HASH NEW PASSWORD
  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  // 4. UPDATE PASSWORD
  await UsersCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );

  // 5. DELETE ALL EXISTING SESSIONS
  await SessionsCollection.deleteMany({ userId: user._id });
};
