const RuleValidator = require("../lib/RuleValidator");

exports.index = (req, res) => {
  const personalData = {
    message: "My Rule-Validation API",
    status: "success",
    data: {
      name: "Ndifreke Friday",
      github: "@ndiecodes",
      email: process.env.EMAIL,
      mobile: process.env.PHONE_NUMBER,
      twitter: "@ndiecodes",
    },
  };

  return res.status(200).json(personalData);
};

exports.validation = (req, res) => {
  const { status, response } = new RuleValidator(req.body).validate();
  res.status(status).json(response);
};
