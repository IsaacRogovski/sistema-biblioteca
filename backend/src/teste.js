
const Livro = require('./models/livro');

const livro1 = new Livro(
    1,
    'Dom Casmurro',
    'Machado de Assis',
    '9788535910663',
    'Companhia das Letras',
    1899,
    'Romance',
    5
);

console.log('Livro:', livro1);
console.log('Título:', livro1.getTitulo());
console.log('Disponível?', livro1.estaDisponivel());

livro1.atualizarQuantidade(-2);

console.log('Nova quantidade:', livro1.getQuantidade());
