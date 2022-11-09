const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const crypto = require('crypto');
const path = require('path');
const validate = require('./utils/validation');

const pathName = path.resolve(__dirname, 'talker.json');
const { bodyValidation, formatValidation } = validate;

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker', async (_req, res) => {
  const talkers = JSON.parse(await fs.readFile(pathName, 'utf-8'));

  res.status(HTTP_OK_STATUS).send(talkers);
});

app.get('/talker/:id', async (req, res) => {
  const id = Number(req.params.id);
  const talkers = JSON.parse(await fs.readFile(pathName, 'utf-8'));

  const talker = talkers.find((t) => t.id === id);
  if (talker) {
    res.json(talker);
  } else {
    res.status(404).send({ message: 'Pessoa palestrante não encontrada' });
  }
});

app.post('/login', bodyValidation, formatValidation, (_req, res) => {
  res.status(HTTP_OK_STATUS).json({ token: crypto.randomBytes(8).toString('hex') });
});