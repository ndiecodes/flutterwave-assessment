const Joi = require("joi");

exports.validateRequest = (req, res, next) => {
  const schema = Joi.object({
    rule: Joi.object({
      field: Joi.any().required(),
      condition: Joi.string().valid(...["eq", "neq", "gt", "gte", "contains"]),
      condition_value: Joi.any().required(),
    }).required(),
    data: Joi.any().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    const getTypeFormat = (str) => {
      if (str != undefined && str.length > 0) {
        const firstChar = str.charAt(0);
        if (firstChar.match(/[aeiou]/gi)) {
          return `an ${str}`;
        }
        return `a ${str}`;
      }
    };
    let message = error.details[0].message
      .replace(/['"]+/g, "")
      .replace("must", "should")
      .replace(
        "of type object",
        `${getTypeFormat(error.details[0].context.type)}`
      );

    const errorData = {
      message: message,
      status: "error",
      data: null,
    };

    return res.status(400).json(errorData);
  }

  return next();
};
