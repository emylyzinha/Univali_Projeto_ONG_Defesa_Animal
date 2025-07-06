const form = document.getElementById('form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const file = document.getElementById('imagem').files[0];

    // Verificar o tamanho do arquivo (em bytes)
    const maxSize = 100 * 1024 * 1024; // 10MB
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

        fetch('https://univali-projeto-ong-defesa-animal.onrender.com/api/animais', {
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
