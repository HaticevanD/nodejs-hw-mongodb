import { registerUser } from '../services/auth.js';

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      name: user.name,
      email: user.email,
    }, // NEVER write pwd here!!!
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  // Add Refresh Token as a safe (cookie)
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true, // non readable for JS, safer
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
