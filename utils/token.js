const jwt = require("jsonwebtoken");

//

const generateToekn = (user) => {
  return jwt.sign(
    {
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "2D",
    }
  );
};

const isAuth = (req, res, next) => {
  const auth = req.headers.auth;
  // console.log(auth);
  if (auth) {
    jwt.verify(auth, "process.env.JWT_SECRET", (err, decode) => {
      if (err) {
        res.status(401).send({ message: "unauthorized" });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: "unauthorized" });
  }
};

module.exports = { generateToekn, isAuth };
