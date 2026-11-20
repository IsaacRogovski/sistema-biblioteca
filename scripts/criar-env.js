// Cria backend/.env a partir do backend/.env.example, se ainda não existir.
const fs = require('node:fs');
const path = require('node:path');

const exemplo = path.join(__dirname, '..', 'backend', '.env.example');
const destino = path.join(__dirname, '..', 'backend', '.env');

if (fs.existsSync(destino)) {
  console.log('backend/.env já existe, nada a fazer.');
} else {
  fs.copyFileSync(exemplo, destino);
  console.log('backend/.env criado. Troque o JWT_SECRET por uma chave sua, se quiser.');
}
