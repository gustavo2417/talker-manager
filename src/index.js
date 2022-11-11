const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const crypto = require('crypto');
const path = require('path');
const validate = require('./utils/validation');

const pathName = path.resolve(__dirname, 'talker.json');
const { bodyValidation,
  ValidatePost,
  validateWatchedAt,
  validateRate,
  validateAut,
  validateTalk,
} = validate;

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

app.get('/talker/search', validateAut, async (req, res) => {
  const searchTerm = req.query.q;
  const talkers = JSON.parse(await fs.readFile(pathName, 'utf-8'));
  const talker = talkers.filter((item) => 
  item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (searchTerm === undefined) {
    res.status(HTTP_OK_STATUS).json(talkers);
  } else if (talker.length === 0) {
    res.status(HTTP_OK_STATUS).json([]);
  } else {
    res.status(HTTP_OK_STATUS).json(talker);
  }
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

app.post('/login', bodyValidation, (_req, res) => {
  res.status(HTTP_OK_STATUS).json({ token: crypto.randomBytes(8).toString('hex') });
});

app.post('/talker', validateAut, ValidatePost, validateTalk,
validateWatchedAt, validateRate, async (req, res) => {
  const talkers = JSON.parse(await fs.readFile(pathName, 'utf-8'));
  const id = talkers[talkers.length - 1].id + 1;
  const newTalker = { id, ...req.body };

  talkers.push(newTalker);
  await fs.writeFile(pathName, JSON.stringify(talkers));
  return res.status(201).json(newTalker);
});

app.put('/talker/:id', validateAut, ValidatePost, validateTalk,
validateWatchedAt, validateRate, async (req, res) => {
  const talkers = JSON.parse(await fs.readFile(pathName, 'utf-8'));
  const id = Number(req.params.id);
  const talker = talkers.find((t) => t.id === id);
  const item = talkers.indexOf(talker);
  const updated = { id, ...req.body };

  talkers.splice(item, 1, updated);
  await fs.writeFile(pathName, JSON.stringify(talkers));
  res.status(200).json(updated);
});

app.delete('/talker/:id', validateAut, async (req, res) => {
  const id = Number(req.params.id);
  const talkers = JSON.parse(await fs.readFile(pathName, 'utf-8'));
  const talker = talkers.find((item) => item.id === id);
  const item = talkers.indexOf(talker);

  talkers.splice(item);
  await fs.writeFile(pathName, JSON.stringify(talker));
  res.sendStatus(204);
});
