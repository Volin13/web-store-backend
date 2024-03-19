const { google } = require('googleapis');
const { v4: uuidv4 } = require('uuid');
const ApiError = require('../../error/ApiError');
const { User } = require('../../models/models');
const jwt = require('jsonwebtoken');
const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URL,
  BASE_BACKEND_URL,
} = process.env;

const oAuth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  `${BASE_BACKEND_URL}/${GOOGLE_REDIRECT_URL}`,
);

const { ACCESS_SECRET_KEY, BASE_FRONTEND_URL } = process.env;

const googleCallback = async (req, res) => {
  let email, name;
  try {
    const code = req.query.code;
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    const userInfo = await google
      .oauth2('v2')
      .userinfo.get({ auth: oAuth2Client });
    email = userInfo.data.email;
    name = userInfo.data.name;
  } catch (error) {
    console.log(error.message);
    return next(ApiError.unauthorized('Підтвердіть свій Email'));
  }

  const googlePassword = uuidv4();
  const user = await User.findOne({ email });
  if (!user) {
    await User.create({
      email,
      name,
      onlyGoogle: true,
      password: uuidv4(),
      googlePassword,
    });
  } else {
    user.googlePassword = googlePassword;
    await user.save();
  }
  const payload = {
    email,
    name,
    googlePassword,
  };
  const googleAuthToken = jwt.sign(payload, ACCESS_SECRET_KEY, {
    expiresIn: '1m',
  });
  res.redirect(`${BASE_FRONTEND_URL}/google-auth/${googleAuthToken}`);
};
module.exports = googleCallback;
