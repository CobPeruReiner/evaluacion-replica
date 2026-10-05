const express = require("express");

const {
  getAllUsers,
  createUser,
  login,
  checkToken,
  updateUser,
  getSupervisores,
  getAsesorCarteras,
  compareUserPersonal,
} = require("../controllers/users.controller.js");

const { protectSession } = require("../middlewares/auth.middleware");

const usersRouter = express.Router();

// El login no tiene JWT aún, pero sí queda sujeto al horario en app.js.
usersRouter.post("/login", login);
usersRouter.use(protectSession);

usersRouter.get("/", getAllUsers);
usersRouter.post("/", createUser);
usersRouter.get("/supervisores", getSupervisores);
usersRouter.get("/carteras", getAsesorCarteras);
usersRouter.patch("/:username", updateUser);
usersRouter.get("/getUser", compareUserPersonal);
usersRouter.get("/check-token", checkToken);

module.exports = { usersRouter };
