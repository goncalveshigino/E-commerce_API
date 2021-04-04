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


    //PUT /
    update(req, res, next) {
        const { name, email, password } = req.body;
        User.findById(req.payload.id).then((user) => {
            if (!user) return res.status(401).json({ errors: "Usuairo nao registrado" });

            if (typeof name !== undefined) user.name = name;
            if (typeof email !== undefined) user.email = email;
            if (typeof password !== undefined) user.setPassword(password);


            return user.save().then(() => {
                return res.json({ user: user.enviarAuthJSON() });
            }).catch(next);
        }).catch(next)
    }

    //DELETE /
    remove(req, res, next) {
        User.findById(req.payload.id).then(user => {
            if (!user) return res.status(401).json({ errors: "Usuairo nao registrado" });

            return user.remove().then(() => {
                return res.json({ deletado: true });
            }).catch(next);
        }).catch(next);
    }


    //POST /LOGIN

    login(req, res, next) {
        const { email, password } = req.body;

        if (!email) return res.status(422).json({ errors: { email: "nao pode ficar vazio" } });
        if (!password) return res.status(422).json({ errors: { password: "nao pode ficar vazio" } });


        User.findOne({ email }).then((user) => {
            if (!user) return res.status(401).json({ errors: "Usuario nao registrado" });
            if (!user.passwordValidator(password)) return res.status(401).json({ errors: "Senha Inválida" });

            return res.json({ user: user.enviarAuthJSON() });
        }).catch(next);
    }
}