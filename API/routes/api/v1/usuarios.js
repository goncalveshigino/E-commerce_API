const router = require("express").Router();
const auth = require("../../auth");
const UsuarioController = require("../../../controllers/UsuariosControllers");


const usuarioController = new UsuarioController();


router.get("/", auth.required, usuarioController.index);
router.get("/:id", auth.required, usuarioController.show);


router.post("/login", usuarioController.login);
router.post("/registar", usuarioController.store);
router.put("/", auth.required, usuarioController.update);
router.delete("/", auth.required, usuarioController.remove);


router.get("/recuperacao-senha", usuarioController.showRecovery);
router.post("/recuperacao-senha", usuarioController.createRecovery);
router.get("/senha-recuperada", usuarioController.showCompleteRecovery);
router.post("/senha-recuperada", usuarioController.completeRecovery);


module.exports = router;