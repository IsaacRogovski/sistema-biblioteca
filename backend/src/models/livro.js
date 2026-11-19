class Livro {

    // metodo construtor
    constructor(id, titulo, autor, editora, anoPublicacao, categoria, quantidade) {
        this.id = id;
        this.titulo = titulo;
        this.autor = autor;
        this.editora = editora;
        this.anoPublicacao = anoPublicacao;
        this.categoria = categoria;
        this.quantidade = quantidade;
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

    get getEditora() {
        return this.editora;
    }

    get getAnoPublicacao() {
        return this.anoPublicacao;
    }

    get getCategoria() {
        return this.categoria;
    }

    get getQuantidade() {
        return this.quantidade;
    }

    // Setters
    set setTitulo(titulo) {
        this.titulo = titulo;
    }

    set setAutor(autor) {
        this.autor = autor;
    }

    set setEditora(editora) {
        this.editora = editora;
    }

    set setAnoPublicacao(anoPublicacao) {
        this.anoPublicacao = anoPublicacao;
    }

    set setCategoria(categoria) {
        this.categoria = categoria;
    }

    set setQuantidade(quantidade) {
        this.quantidade = quantidade;
    }

    // Métodos próprios
    estaDisponivel() {
        return this.quantidade > 0;
    }

    atualizarQuantidade(valor) {
        this.quantidade += valor;

        if (this.quantidade < 0) {
            this.quantidade = 0;
        }
    }
}

// exportando a classe
module.exports = Livro;
