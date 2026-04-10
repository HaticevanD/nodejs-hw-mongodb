import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  // 1. Extract the "Authorization" header from the request
  const authHeader = req.get('Authorization');

  // Check if the header exists
  if (!authHeader) {
    return next(createHttpError(401, 'Please provide Authorization header'));
  }

  // 2. Split the header to get the token (Format: "Bearer <token>")
  const [bearer, token] = authHeader.split(' ');

  // Validate the format (Must start with "Bearer" and have a token string)
  if (bearer !== 'Bearer' || !token) {
    return next(createHttpError(401, 'Auth header should be of Bearer type'));
  }

  // 3. Look for the session in the database using the provided Access Token
  const session = await SessionsCollection.findOne({ accessToken: token });

  // If no session is found, the token is invalid or the user is logged out
  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }

  // 4. Check if the Access Token has expired
  const isAccessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);
  if (isAccessTokenExpired) {
    return next(createHttpError(401, 'Access token expired'));
  }

  // 5. Retrieve the user associated with this session from the Users collection
  const user = await UsersCollection.findById(session.userId);

  // If the user record was deleted but the session still exists
  if (!user) {
    return next(createHttpError(401, 'User not found'));
  }

  // 6. ATTACH THE USER TO THE REQUEST OBJECT
  // This is the most important part! By adding 'user' to 'req',
  // all subsequent functions (Controllers) will know exactly who is making the request.
  req.user = user;

  // Everything is fine, proceed to the next middleware or controller
  next();
};
