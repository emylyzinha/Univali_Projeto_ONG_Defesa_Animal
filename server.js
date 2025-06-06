const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Caminho para o arquivo JSON
const animaisFilePath = path.join(__dirname, 'api', 'animais.json');

// Função para ler os dados do arquivo JSON
function lerAnimais() {
    const data = fs.readFileSync(animaisFilePath);
    return JSON.parse(data);
}

// Função para salvar os dados no arquivo JSON
function salvarAnimais(animais) {
    fs.writeFileSync(animaisFilePath, JSON.stringify(animais, null, 2));
}


// Permite corpo de até 100MB (em JSON)
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Rota para adicionar animais
app.post('/api/animais', (req, res) => {
    const novoAnimal = req.body; // Obtenha os dados do animal do corpo da requisição
    const animais = lerAnimais(); // Ler os animais existentes
    animais.push(novoAnimal); // Adicionar o novo animal
    salvarAnimais(animais); // Salvar os animais atualizados
    res.status(201).json({ message: 'Animal cadastrado com sucesso!' });
});

// Rota para remover animais
app.delete('/api/animais/:id', (req, res) => {
    const id = parseInt(req.params.id); // Obter o ID do animal a ser removido
    let animais = lerAnimais(); // Ler os animais existentes
    animais = animais.filter((_, index) => index !== id); // Remover o animal pelo índice
    salvarAnimais(animais); // Salvar os animais atualizados
    res.json({ message: 'Animal removido com sucesso!' });
});

// Rota para listar animais
app.get('/api/animais.json', (req, res) => {
    const animais = lerAnimais(); // Ler os animais existentes
    res.json(animais); // Retornar os animais como JSON
});

// Middleware para servir arquivos estáticos da pasta 'api'
app.use(express.static(path.join(__dirname))); // Serve arquivos estáticos da pasta atual

const nodemailer = require('nodemailer');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'Univali_Projeto_ONG_Defesa_Animal'))); 

app.post('/enviar', async (req, res) => {
  const dados = req.body;

  const mensagem = Object.entries(dados).map(
    ([campo, valor]) => `${campo}: ${valor}`
  ).join('\n');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'emylysantosguitar@gmail.com',
      pass: '20548620'
    }
  });

  await transporter.sendMail({
    from: 'emylysantosguitar@gmail.com',
    to: 'emylysantosguitar@gmail.com',
    subject: `Formulário de Adoção - Interesse no animal: ${dados.animal || 'Não especificado'}`,
    text: mensagem
  });

  res.send('Formulário enviado com sucesso!');
});

// Iniciando o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
