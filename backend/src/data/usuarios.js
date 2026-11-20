const Usuario = require('../models/usuarios'); // importa a calsse usuario
const bcrypt = require('bcrypt'); // puxa o modulo bcrypt pra hash de senhas

// Usuários previamente cadastrados (senhas guardadas como hash)
const usuarios = [
    new Usuario(
        1,
        'Henrique',
        'ADMHENRIQUE',
        bcrypt.hashSync('12345', 10),
        'Administrador'
    ),
    new Usuario(
        2,
        'Isaac',
        'ADMISAAC',
        bcrypt.hashSync('12345', 10),
        'Administrador'
    ),
    new Usuario(
        3,
        'Giovanna',
        'ADMGIOVANNA',
        bcrypt.hashSync('12345', 10),
        'Administrador'
    )
];
module.exports = usuarios;
