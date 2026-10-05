const jwt = require("jsonwebtoken");

const { catchAsync } = require("../utils/catchAsync.util");
const { db } = require("../utils/database.util");
const { QueryTypes } = require("sequelize");

const protectSession = catchAsync(async (req, res, next) => {
  let token;

  // Extract the token from headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token)
    return res.status(401).json({ ok: false, code: "INVALID_SESSION", message: "Sesión no válida." });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (_error) {
    return res.status(401).json({ ok: false, code: "INVALID_SESSION", message: "Sesión expirada o no válida." });
  }

  // { id, ... }

  // Check in db that user still exists
  // const user = await User.findOne({
  // 	where: { id: decoded.id, status: 'active' },
  // });

  const results = await db.query(
    `SELECT tb1.*, tb2.nombre
     FROM personal tb1
     LEFT JOIN cargo tb2
     ON tb1.CARGO = tb2.id
    WHERE IDPERSONAL = :id AND IDESTADO = 1`,
    {
      replacements: { id: decoded.id },
      type: QueryTypes.SELECT,
    }
  );

  const user = results[0];

  if (!user) {
    return res.status(401).json({ ok: false, code: "INVALID_SESSION", message: "La sesión ya no pertenece a un usuario activo." });
  }

  // Grant access
  req.sessionUser = user;
  next();
});

module.exports = { protectSession };
