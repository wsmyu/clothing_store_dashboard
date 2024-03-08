const jwt = require('jsonwebtoken');

const isAuth = (req,res,next)=>{
    const authorization = req.headers.authorization;
    if (authorization) {
      const token = authorization;
      jwt.verify(token, "yourJWTSecret", (err, decode) => {
        if (err) {
          res.status(401).send({ message: 'Invalid Token' });
        } else {
          req.user = decode;
          console.log("req.user:",req.user)
          next();
        }
      });
    } else {
      res.status(401).send({ message: 'No Token' });
    }
}

module.exports = isAuth;