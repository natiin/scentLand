const BaseJoi = require("joi").extend(require("@joi/date"));

const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value) return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});
const Joi = BaseJoi.extend(extension);

module.exports.brandSchema = Joi.object({
  name: Joi.string().required().escapeHTML(),
  description: Joi.string().required().escapeHTML(),
  images: Joi.array().items(
    Joi.object()
      .keys({
        url: Joi.string().required().escapeHTML(),
        filename: Joi.string().required().escapeHTML(),
      })
      .required()
  ),
  deleteImages: Joi.array(),
});

module.exports.productSchema = Joi.object({
  name: Joi.object()
    .keys({
      brand: Joi.string().required().escapeHTML(),
      title: Joi.string().required().escapeHTML(),
    })
    .required(),
  description: Joi.string().required().escapeHTML(),
  notes: Joi.object()
    .keys({
      topNotes: Joi.array().items(Joi.string().escapeHTML().required()).single(),
      middleNotes: Joi.array().items(Joi.string().escapeHTML().required()).single(),
      baseNotes: Joi.array().items(Joi.string().escapeHTML().required()).single(),
    })
    .required(),
  scent: Joi.string().required().escapeHTML(),
  gender: Joi.array().items(Joi.string().valid("female", "male", "unisex").escapeHTML().required()).single(),
  launchYear: Joi.number().integer().empty("").default(""),
  type: Joi.string().valid("EDT", "EDP").required().escapeHTML(),

  prices: Joi.array()
    .items(
      Joi.object().keys({
        size: Joi.number().integer().required(),
        price: Joi.number().required(),
        isOnSale: Joi.boolean().empty("").default(false),
        salePrice: Joi.number().empty("").default(""),
      })
    )
    .required()
    .options({ stripUnknown: { arrays: true } }),

  images: Joi.array().items(
    Joi.object()
      .keys({
        url: Joi.string().required().escapeHTML(),
        filename: Joi.string().required().escapeHTML(),
      })
      .required()
  ),
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  body: Joi.string().required().escapeHTML(),
  rating: Joi.number().integer().min(1).max(5).required(),
  edited: Joi.object().keys({
    edited: Joi.boolean(),
    date: Joi.date().format("YYYY-MM-DD").utc(),
  }),

  date: Joi.date().format("YYYY-MM-DD").utc(),
});
