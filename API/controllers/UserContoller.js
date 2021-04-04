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

        if (!name || !email || !password) return res.status(422).json({ errors: "Preencha todos os campos de cadastro" });

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

    //RECOVERY

    //GET /recuperar-senha
    showRecovery(req, res, next) {
        return res, render('recovery', { error: null, success: null });
    }

    //POST /recuperar-senha
    createRecovery(req, res, next) {
        const { email } = req.body;

        if (!email) return res.render('recovery', { error: "Preencha com o seu email", success: null });

        User.findOne({ email }).then((user) => {
            if (!user) return res.render('recovery', { error: "Nao existe usuario com esse email", success: null });
            const recoveryData = user.createTokenRecovery();
            return user, save().then(() => {
                return res.render('recovery', { error: null, success: true });
            }).catch(next);
        }).catch(next);
    }

    //GET /senha-recuperada
    showCompleteRecovery(req, res, next) {
        if (!req.query.token) return res.render('recovery', { error: "Token nao identificado", success: null });
        User.findOne({ 'recovery.token': req.query.token }).then(user => {
            if (!user) return res.render('recovery', { error: "nao existe usuario com este token", success: null });

            if (new Date(user.recovery.date) < new Date()) return res.render('recovery', { error: "Token expirado. Tente Novamente", success: null });
            return res.render("recovery/store", { error: null, success: null, token: req.query.token });
        }).catch(next)
    }

    //POST / senha-recuperada
    completeRecovery(req, res, next) {
        const { token, password } = req.body;
        if (!token || !password) return res.render("recovery/store", { error: "Preencha novamente com sua nova senha", success: null, token: token });
        User.findOne({ "recovery.token": token }).then(user => {
            if (!user) return res.render('recovery', { error: "Usuario nao identificado", success: null });

            user.finalizeRecovery();
            user.setPassword(password);
            return user.save().then(() => {
                return res.render("recovery/store", {
                    error: null,
                    success: "Senha alterada com sucesso. Tente Novamente fazer login",
                    token: null

                });
            }).catch(next);
        });
    }
}