module.exports = {
    secret: process.env.NODE_ENV === "production" ? Process.env.SECRET : "hjcdhjcdjhcdhjdhjdjdfjhgdfjhgdfgjhdfjhgdfjhgdfjhgdfjhgdfbhjvhdinfuerkyfh4ruifhjk",
    api: process.env.NODE_ENV === "production" ? "https://api.loja-teste.ampliee.com" : "http://localhost:3000",
    loja: process.env.NODE_ENV === "production" ? "https://loja-teste.ampliee.com" : "http://localhost:3000",

}