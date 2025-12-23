import Joi from "joi";

const bookSchema = Joi.object({
  title: Joi.string().required(),
  price: Joi.number().min(0).required()
});

const validateBook = (req, res, next) => {
  const { error } = bookSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message
    });
  }

  next();
};

export default validateBook;
