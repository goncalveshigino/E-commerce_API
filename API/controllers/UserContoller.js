const mongoose = require("mongoose");
const User = mongoose.model("User");
const enviarEmailRecovery = require("../helpers/email-recovery");



class UserController {


    //GET /
    index(req, res, next) {
        User.findById(req.payload.id).then(user => {
            if (!user) return res.status(401).json({ errors: "Usuairo nao registrado" });
            return res.json({ user: user.enviarAuthJSON() });
        }).catch(next)
    }

    //GET /:id
    show(req, res, next) {
        User.findById(req.params.id).populate({ path: "loja" })
            .then(user => {
                if (!user) return res.status(401).json({ errors: "Usuairo nao registrado" });
                return res.json({
                    user: {
                        name: user.name,
                        email: user.email,
                        permission: user.permission,
                        loja: user.loja
                    }
                });
            }).catch(next)
    }


    //POST /registrar
    store(req, res, next) {
        const { name, email, password } = req.body;

        const user = new User({ name, email });
        user.setPassword(password);

        user.save()
            .then(() => res.json({ user: user.enviarAuthJSON() }))
            .catch(next);
    }
}