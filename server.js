const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(bodyParser.json()); // Para analisar o corpo da requisição como JSON

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

// Iniciando o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const file = document.getElementById('imagem').files[0];

    // Verificar o tamanho do arquivo (em bytes)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        alert('O arquivo é muito grande. O tamanho máximo permitido é 10MB.');
        return;
    }

    const reader = new FileReader();

    reader.onloadend = function () {
        const animal = {
            nome: document.getElementById('nome').value,
            raca: document.getElementById('raca').value,
            cor: document.getElementById('cor').value,
            idade: document.getElementById('idade').value,
            imagem: reader.result
        };

        fetch('http://localhost:3000/api/animais', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(animal)
        })
        .then(res => {
            if (!res.ok) throw new Error('Erro ao cadastrar animal.');
            return res.json();
        })
        .then(() => {
            alert('Animal cadastrado com sucesso!');
            form.reset();
        })
        .catch(err => {
            console.error(err);
            alert('Erro ao cadastrar animal.');
        });
    }

    reader.readAsDataURL(file);
});
