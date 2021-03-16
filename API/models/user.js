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
    hast: String,
    salt: String,
    recovery: {
        type: {
            token: String,
            date: Date,
        },
        default: {}
    }
}, { timestamps: true });