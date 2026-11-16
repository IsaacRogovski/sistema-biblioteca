const Usuario = require('../models/usuario');

// Usuários previamente cadastrados
const usuarios = [
    new Usuario(1, 'Administrador', 'admin', '...', 'Administrador'),
    new Usuario(2, 'Aluno', 'aluno', '...', 'Aluno')
];

module.exports = usuarios;

