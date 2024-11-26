const regularExpressions = {
  name: {
    regex: /^[A-Z][a-zA-Z]{2,}$/,
    msg: "Nome inválido!",
  },
  phone: {
    regex: /^\d{11}$/,
    msg: "Numéro de telefone inválido!",
  },
};

module.exports = regularExpressions;
