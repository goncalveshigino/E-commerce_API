const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const jwt = reuire('jsonwebtoken');
const secret = require('../config').secret;


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Não pode ficar vazio"]
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "Não pode ficar vazio"],
        index: true,
        match: [/\S+@\S+\.\S+/, 'é inválido.']
    },
    loja: {
        type: Schema.Types.ObjectId,
        ref: "Loja",
        required: [true, "Não pode ficar vazio"],
    },
    permission: {
        type: Array,
        default: ["cliente"]
    },
    hash: String,
    salt: String,
    recovery: {
        type: {
            token: String,
            date: Date,
        },
        default: {}
    }
}, { timestamps: true });

// Para todos o campos unique
UserSchema.plugin(uniqueValidator, { message: " Ja esta a ser utilizado" });

// Uma nona senha
UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString("hex");
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, "sha512").toString("hex");
};

UserSchema.methods.passwordValidator = function(password) {
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, "sha512").toString("hex");
    return hash === this.hash;
};

UserSchema.methods.createToken = function() {
    const today = new Date();
    const exp = new Date(today)
    exp.setDate(today.getDate() + 1);

    return jwt.sign({
        id: this._id,
        email: this.email,
        name: this.name,
        exp: parseFloat(exp.getTime() / 1000, 10)
    }, secret)
};


UserSchema.methods.sendAuthJSON = function() {
    return {
        name: this.name,
        email: this.email,
        loja: this.loja,
        permission: this.permission,
        token: this.createToken()
    };
};

// Recuperacao de senha
UserSchema.methods.recoverPassword = function() {
    this.recovery = {};
    this.recovery.token = crypto.randomBytes(16).toString("hex");
    this.recovery.date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    return this.recovery;
};


UserSchema.methods.finalizeRecovery = function() {
    this.recovery = { token: null, date: null };
    return this.recovery;
};

module.exports = mongoose.model("Usuario", UserSchema);