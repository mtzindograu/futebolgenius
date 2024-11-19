// Importando pacotes
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Configurando o app
const app = express();
const port = 6969;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Conectando ao MongoDB (substitua pelo seu URI do MongoDB Atlas)
const mongoURI = "mongodb+srv://mateus:mateus@cluster0.9qltb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongoURI)
    .then(() => console.log('Conectado ao MongoDB Atlas'))
    .catch((err) => console.error('Erro ao conectar ao MongoDB', err));

// Definindo o modelo do MongoDB
const historySchema = new mongoose.Schema({
    isGPT: Boolean,
    action: String,
    ip: String,
    timestamp: { type: Date, default: Date.now }
});

const History = mongoose.model('History', historySchema);

// Rota para salvar o histórico de ações
app.post('/historico', async (req, res) => {
    const { isGPT, action, ip } = req.body;

    try {
        const newHistory = new History({ isGPT, action, ip });
        await newHistory.save();
        res.status(200).send('Histórico salvo com sucesso!');
    } catch (error) {
        res.status(500).send('Erro ao salvar o histórico: ' + error.message);
    }
});

// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
