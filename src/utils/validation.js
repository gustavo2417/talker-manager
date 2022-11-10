const bodyValidation = (req, res, next) => {
  const regex = /\S+@\S+\.\S+/;
  const testEmail = regex.test(req.body.email);

  if (req.body.email === undefined) {
    res.status(400).json({ message: 'O campo "email" é obrigatório' });
  } else if (req.body.password === undefined) {
    res.status(400).json({ message: 'O campo "password" é obrigatório' });
  } else if (!testEmail) {
    res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  } else if (req.body.password.length < 6) {
    res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  } else {
    next();
  }
};

const ValidatePost = (req, res, next) => {
  if (req.body.name === undefined) {
    res.status(400).json({ message: 'O campo "name" é obrigatório' });
  } else if (req.body.name.length < 3) {
    res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  } else if (req.body.age === undefined) {
    res.status(400).json({ message: 'O campo "age" é obrigatório' });
  } else if (req.body.age < 18) {
    res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
  } else {
    next();
  }
};

const validateTalk = (req, res, next) => {
  if (req.body.talk === undefined) {
    res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  } else {
    next();
  }
};

const validateWatchedAt = (req, res, next) => {
  const regex = /^[0-9]{2}[/][0-9]{2}[/][0-9]{4}$/g;
  const { watchedAt } = req.body.talk;
  const testData = regex.test(watchedAt);

  if (watchedAt === undefined) {
    res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  } else if (!testData) {
    res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  } else {
    next();
  }
};

const validateRate = (req, res, next) => {
  const { rate } = req.body.talk;

  if (rate === undefined) {
    res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  } else if (rate < 1 || rate > 5 || !Number.isInteger(rate)) {
    res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  } else {
    next();
  }
};

const validateAut = (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization === undefined) {
    res.status(401).json({ message: 'Token não encontrado' });
  } else if (authorization.length < 16) {
    res.status(401).json({ message: 'Token inválido' });
  } else if (authorization.typeOf === 'string') {
    res.status(401).json({ message: 'Token inválido' });
  } else {
    next();
  }
};

module.exports = {
  bodyValidation,
  ValidatePost,
  validateWatchedAt,
  validateRate,
  validateAut,
  validateTalk,
};