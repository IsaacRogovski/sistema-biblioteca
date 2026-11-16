
class Usuario {

    // metodo construtor
    constructor(id, nome, usuario, senha, cargo) {
        this.id = id;
        this.nome = nome;
        this.usuario = usuario;
        this.senha = senha;
        this.cargo = cargo;
    }

    // getters
    get getId() {
        return this.id;
    }

    get getNome() {
        return this.nome;
    }

    get getUsuario() {
        return this.usuario;
    }

    get getSenha() {
        return this.senha;
    }

    get getCargo() {
        return this.cargo;
    }

    // setters
    set setNome(nome) {
        this.nome = nome;
    }

    set setUsuario(usuario) {
        this.usuario = usuario;
    }

    set setSenha(senha) {
        this.senha = senha;
    }

    set setCargo(cargo) {
        this.cargo = cargo;
    }

}

// exportando a classe
module.exports = Usuario;
