const Usuario = require('../models/usuarios'); // importa a calsse usuario
const bcrypt = require('bcrypt'); // puxa o modulo bcrypt pra hash de senhas

// Usuários previamente cadastrados
const usuarios = [
    new Usuario(
        1,
        'Administrador', 
        'admin', 
        bcrypt.hashSync('admin123', 10),
        'Administrador'
    ),
    new Usuario(
        2, 
        'Aluno', 
        'aluno', 
        bcrypt.hashSync('aluno123', 10), 
        'Aluno')
];
module.exports = usuarios;

