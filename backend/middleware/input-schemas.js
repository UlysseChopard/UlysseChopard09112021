const Joi = require("joi");

const schemas = {
  userPOST: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().min(3).required(),
  }),
  saucePOST: Joi.object().keys({
    name: Joi.string().required(),
    manufacturer: Joi.string().required(),
    description: Joi.string().required(),
    mainPepper: Joi.string().required(),
    heat: Joi.number().integer().min(1).max(10).required(),
  }),
};

module.exports = schemas;
