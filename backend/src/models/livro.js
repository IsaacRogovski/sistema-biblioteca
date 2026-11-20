class Livro {

    // metodo construtor
    constructor(id, titulo, autor, ano, editora, paginas, genero) {
        this.id = id;
        this.titulo = titulo;
        this.autor = autor;
        this.ano = ano;
        this.editora = editora;
        this.paginas = paginas;
        this.genero = genero;
    }

    // Getters
    get getId() {
        return this.id;
    }

    get getTitulo() {
        return this.titulo;
    }

    get getAutor() {
        return this.autor;
    }

    get getAno() {
        return this.ano;
    }

    get getEditora() {
        return this.editora;
    }

    get getPaginas() {
        return this.paginas;
    }

    get getGenero() {
        return this.genero;
    }

    // Setters (são propriedades: usar livro.setTitulo = 'x', e não livro.setTitulo('x'))
    set setTitulo(titulo) {
        this.titulo = titulo;
    }

    set setAutor(autor) {
        this.autor = autor;
    }

    set setAno(ano) {
        this.ano = ano;
    }

    set setEditora(editora) {
        this.editora = editora;
    }

    set setPaginas(paginas) {
        this.paginas = paginas;
    }

    set setGenero(genero) {
        this.genero = genero;
    }
}

// exportando a classe
module.exports = Livro;
