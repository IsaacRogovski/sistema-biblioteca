//#region importando modulos

const express = require('express');
const cors = require('cors');
const app = express();
const bcrypt = require('bcrypt'); // modulo pra criacao de hash de senhas
const jwt = require('jsonwebtoken'); // pra tokens

const Livro = require('./models/livro');  // importanto a classe livro
const usuarios = require('./data/usuarios'); // importando os usuarios pré cadastrados

const authMiddleware = require('./middlewares/authMiddleware'); //middleware pra autenticação do token

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') }); // carrega backend/.env, não importa de onde o node foi iniciado
//#endregion


const PORT = process.env.PORT || 3000; // puxa a port da env (3000 se não estiver definida)


//#region Banco de dados em formato de array com dados pre inseridos

let livros = [
    new Livro(1, 'O Pequeno Príncipe', 'Antoine de Saint-Exupéry', 1943, 'Reynal & Hitchcock', 96, 'Ficção'),
    new Livro(2, 'O Hobbit', 'J.R.R. Tolkien', 1937, 'George Allen & Unwin', 310, 'Fantasia'),
    new Livro(3, 'Dom Casmurro', 'Machado de Assis', 1899, 'Vozes', 256, 'Ficção'),
    new Livro(4, '1984', 'George Orwell', 1948, 'Secker & Warburg', 328, 'Ficção Científica'),
    new Livro(5, 'O Senhor dos Anéis', 'J.R.R. Tolkien', 1954, 'George Allen & Unwin', 423, 'Fantasia'),
    new Livro(6, 'Harry Potter e a Pedra Filosofal', 'J.K. Rowling', 1997, 'Bloomsbury', 223, 'Fantasia')
];

let proximoId = 7;

//#endregion

//#region função de validação dos dados de entrada das requisições

function validarDadosLivro(dados) {

    const {
        titulo,
        autor,
        ano,
        editora,
        paginas,
        genero
    } = dados || {};

    // Verificar campos de texto
    if (
        typeof titulo !== 'string' || !titulo.trim() ||
        typeof autor !== 'string' || !autor.trim() ||
        typeof editora !== 'string' || !editora.trim() ||
        typeof genero !== 'string' || !genero.trim()
    ) {
        return 'Preencha todos os campos.';
    }

    // Verificar se os campos numéricos são números inteiros
    if (
        !Number.isInteger(ano) ||
        !Number.isInteger(paginas)
    ) {
        return 'Ano e número de páginas devem ser números inteiros.';
    }

    // Verificar valores permitidos
    if (paginas < 1) {
        return 'O número de páginas deve ser maior que zero.';
    }

    if (
        ano < 1 ||
        ano > new Date().getFullYear()
    ) {
        return 'Ano de publicação inválido.';
    }

    return null;
}

//#endregion


// Middlewares
app.use(express.json());
app.use(cors());

app.use('/livros', authMiddleware); // aplica o middleware a todas as requisições que começam com /livros.

//#region get que envia todos os livros

app.get('/livros', (req, res) => {
    res.json(livros);
});

//#endregion

//#region get por id

app.get('/livros/:id', (req, res) => {

    const id = Number(req.params.id); // parametro :id da requisicao
    const livro = livros.find(livro => livro.id === id);

    if (!livro) { // se nao existe
        return res.status(404).json({
            mensagem: 'Livro não encontrado.'
        });
    }

    res.json(livro);
});

//#endregion

//#region requisicao post pra criar os livros

app.post('/livros', (req, res) => {

    // Verificar se a requisicao enviou os campos corretamente (null = tudo certo)
    const erro = validarDadosLivro(req.body);

    if (erro) {
        return res.status(400).json({
            mensagem: erro
        });
    }

    const { titulo, autor, ano, editora, paginas, genero } = req.body;

    // Criar novo livro
    const novoLivro = new Livro(
        proximoId,
        titulo.trim(),
        autor.trim(),
        ano,
        editora.trim(),
        paginas,
        genero.trim()
    );

    // Adicionar ao array
    livros.push(novoLivro);

    // Incrementar ID
    proximoId++;

    res.status(201).json(novoLivro);
});

//#endregion

//#region requisicao put para atualizar livros

app.put('/livros/:id', (req, res) => {

    const id = Number(req.params.id);

    // Procurar livro pelo ID
    const livro = livros.find(livro => livro.id === id);

    if (!livro) {
        return res.status(404).json({
            mensagem: 'Livro não encontrado.'
        });
    }

    // Verificar campos obrigatórios
    const erro = validarDadosLivro(req.body);

    if (erro) {
        return res.status(400).json({
            mensagem: erro
        });
    }

    const { titulo, autor, ano, editora, paginas, genero } = req.body;

    // Att os valores com os setters da classe livro
    // (setters da classe são propriedades, então usa-se atribuição e não chamada de função)
    livro.setTitulo = titulo.trim();
    livro.setAutor = autor.trim();
    livro.setAno = ano;
    livro.setEditora = editora.trim();
    livro.setPaginas = paginas;
    livro.setGenero = genero.trim();

    res.json(livro);
});

//#endregion

//#region requisicao delete para excluir livros

app.delete('/livros/:id', (req, res) => {

    const id = Number(req.params.id);

    // Encontrar a posição do livro no array
    const indice = livros.findIndex(livro => livro.id === id);

    if (indice === -1) {
        return res.status(404).json({
            mensagem: 'Livro não encontrado.'
        });
    }

    // Remover livro do array
    livros.splice(indice, 1);

    res.status(204).send();
});

//#endregion

//#region Autenticação de usuarios com tokens

app.post('/login', async (req, res) => { // funcao assincrona porque o bcrypt.compare é assíncrono

    const { usuario, senha } = req.body;

    // Verifica se os campos foram enviados
    if (!usuario || !senha) {
        return res.status(400).json({
            mensagem: 'Informe usuário e senha.'
        });
    }

    // Procura o usuário cadastrado
    const usuarioEncontrado = usuarios.find(
        u => u.usuario === usuario
    );

    // Verifica se o usuário existe
    if (!usuarioEncontrado) {
        return res.status(401).json({
            mensagem: 'Usuário ou senha incorretos.'
        });
    }

    // Compara a senha digitada com o hash armazenado
    const senhaCorreta = await bcrypt.compare( // await faz o codigo esperar isso pra continuar
        senha, // senha inserida
        usuarioEncontrado.senha // hash do usuario encontrado no banco
    );

    // Verifica se a senha está correta
    if (!senhaCorreta) {
        return res.status(401).json({
            mensagem: 'Usuário ou senha incorretos.'
        });
    }

    // Gera o token JWT
    const token = jwt.sign(
        {
            id: usuarioEncontrado.id,
            usuario: usuarioEncontrado.usuario,
            cargo: usuarioEncontrado.cargo
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1h'
        }
    );

    // Retorna o token
    res.status(200).json({
        mensagem: 'Login realizado com sucesso!',
        token: token
    });

});

//#endregion

//#region inicia o app express

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

//#endregion
