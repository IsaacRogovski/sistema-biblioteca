
const jwt = require('jsonwebtoken');

// Middleware de autenticação
function authMiddleware(req, res, next) {

    // Recupera o token enviado no cabeçalho
    const authorization = req.headers.authorization;

    // Verifica se o token foi enviado
    if (!authorization) {
        return res.status(401).json({
            erro: 'Token não informado'
        });
    }

    // Separa o Bearer do token
    const partes = authorization.split(' ');

    if (partes.length !== 2 || partes[0] !== 'Bearer') {
        return res.status(401).json({
            erro: 'Formato de token inválido'
        });
    }

    const token = partes[1];

    // Verifica se o token é válido
    try {

        const dadosUsuario = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Disponibiliza os dados do usuário para a rota
        req.usuario = dadosUsuario;

        // Permite que a requisição continue
        next();

    } catch (erro) {

        return res.status(401).json({
            erro: 'Token inválido ou expirado'
        });

    }
}

module.exports = authMiddleware;
