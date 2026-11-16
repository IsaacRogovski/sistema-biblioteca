//#region importando modulos

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

const Livro = require('./models/livro');  // importanto a classe livro

//#endregion 

//#region Banco de dados em formato de array com dados pre inseridos

let livros = [
    new Livro(
        1,
        'Dom Casmurro',
        'Machado de Assis',
        'Companhia das Letras',
        1899,
        'Romance',
        5
    ),

    new Livro(
        2,
        'O Pequeno Príncipe',
        'Antoine de Saint-Exupéry',
        'Agir',
        1943,
        'Fantasia',
        8
    ),

    new Livro(
        3,
        '1984',
        'George Orwell',
        'Companhia das Letras',
        1949,
        'Ficção distópica',
        3
    )
];

//#endregion 

// Próximo ID disponível
let proximoId = 4;
// Middlewares
app.use(express.json());
app.use(cors());

//#region get que envia todos os livros

app.get('/livros', (req, res) => { 
    res.json(livros); 
});

//#endregion

//#region get por id

app.get('/livros/:id', (req, res) => {

    const id = Number(req.params.id); //req = requisicao, logo, o parametro id da requisicao que foi enviada no get, o :id
    const livro = livros.find(livro => livro.id === id);  // essa bagaca define livro como o livro que o id = o da requisicao

    if (!livro) { //se nao existe
        return res.status(404).json({
            erro: 'Livro não encontrado'
        });
    }

    res.json(livro); // se ele existir ele retorna a requisicao get com o livro que foi pedido
});

//#endregion

//#region requisicao post pra criar os livros

app.post('/livros', (req, res) => {

    const {
        titulo,
        autor,
        editora,
        anoPublicacao,
        categoria,
        quantidade
    } = req.body; // pega os dados do corpo da requisição e os atribui para constantes

    // Verificar se a requisicao enviou os campos obrigatorios
    if (
        !titulo ||
        !autor ||
        !editora ||
        !anoPublicacao ||
        !categoria ||
        quantidade === undefined
    ) {
        return res.status(400).json({
            erro: 'Todos os campos são obrigatórios'
        });
    }

    // Criar novo livro
    const novoLivro = new Livro(
        proximoId,
        titulo,
        autor,
        editora,
        Number(anoPublicacao),
        categoria,
        Number(quantidade)
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
            erro: 'Livro não encontrado'
        });
    }

    // Receber os novos dados
    const {
        titulo,
        autor,
        editora,
        anoPublicacao,
        categoria,
        quantidade
    } = req.body;

    // Verificar campos obrigatórios
    if (
        !titulo ||
        !autor ||
        !editora ||
        !anoPublicacao ||
        !categoria ||
        quantidade === undefined
    ) {
        return res.status(400).json({
            erro: 'Todos os campos são obrigatórios'
        });
    }

    // Att os valores com os metodos setters da classe livro
    livro.setTitulo(titulo);
    livro.setAutor(autor);
    livro.setEditora(editora);
    livro.setAnoPublicacao(Number(anoPublicacao));
    livro.setCategoria(categoria);
    livro.setQuantidade(Number(quantidade));

    res.json(livro);
});

//#endregion

//#region inicia o app express

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

//#endregion