import Joi from 'joi';

const objectId = Joi.string().hex().length(24);

const productBaseSchema = Joi.object({
	name: Joi.string().trim().max(100),
	description: Joi.string().trim().max(500),
	price: Joi.number().min(0),
	stock: Joi.number().integer().min(0),
	catagory: Joi.string().trim(),
	category: Joi.string().trim(),
	imageUrl: Joi.string().uri()
})
	.rename('category', 'catagory', { ignoreUndefined: true })
	.with('category', 'catagory');

const createProductSchema = productBaseSchema.fork(
	['name', 'description', 'price', 'stock', 'catagory'],
	(field) => field.required()
);

const updateProductSchema = productBaseSchema.min(1);

const addToCartSchema = Joi.object({
	productId: objectId.required(),
	quantity: Joi.number().integer().min(1).required()
});

const updateCartSchema = Joi.object({
	items: Joi.array()
		.items(
			Joi.object({
				productId: objectId.required(),
				quantity: Joi.number().integer().min(1).required()
			})
		)
		.min(1)
		.required()
});

const createOrderSchema = Joi.object({
	customer: Joi.object({
		name: Joi.string().trim().required(),
		email: Joi.string().email().required(),
		address: Joi.string().trim().required(),
		phone: Joi.string().trim().required()
	}).required()
});

const validateBody = (schema) => (req, res, next) => {
	const { error, value } = schema.validate(req.body, {
		abortEarly: false,
		stripUnknown: true
	});

	if (error) {
		return res.status(400).json({
			success: false,
			error: error.details.map((detail) => detail.message)
		});
	}

	req.body = value;
	return next();
};

export {
	createProductSchema,
	updateProductSchema,
	addToCartSchema,
	updateCartSchema,
	createOrderSchema,
	validateBody
};
