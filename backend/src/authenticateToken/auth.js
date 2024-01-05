import jwt from "jsonwebtoken";

// Middleware para autenticação JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  jwt.verify(token.split(" ")[1], "secret-key", (err, user) => {
    if (err) {
      return res.status(403).send("Forbidden");
    }

    req.user = user;
    next();
  });
};

export default authenticateToken;
