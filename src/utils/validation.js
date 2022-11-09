const bodyValidation = (req, res, next) => {
  if (req.body.email === undefined) {
    res.status(400).json({ message: 'O campo "email" é obrigatório' });
  } else if (req.body.password === undefined) {
    res.status(400).json({ message: 'O campo "password" é obrigatório' });
  } else {
    next();
  }
};

const formatValidation = (req, res, next) => {
  const regex = /\S+@\S+\.\S+/;
  const testEmail = regex.test(req.body.email);

  if (!testEmail) {
    res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  } else if (req.body.password.length < 6) {
    res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  next();
};

module.exports = {
  bodyValidation,
  formatValidation,
};