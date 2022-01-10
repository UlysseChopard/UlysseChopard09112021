module.exports = (req, res, next) => {
  let email = req?.body?.email;
  if (email) {
    req.body.email = email.replace(email.charAt(0), "*");
  }
  console.log("maskedEmail", req?.body?.email);
  next();
};
