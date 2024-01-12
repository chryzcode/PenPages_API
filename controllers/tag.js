const Tag = require('../models/tag')
const { StatusCodes } = require("http-status-codes");

const createTag = async (req, res) => {
    const tag = await Tag.create({ ...req.body })
    res.status(StatusCodes.CREATED).json({tag})
}

const getAllTags = async (req, res) => {
  const tags = await Tag.find({});
  res.status(StatusCodes.OK).json({ tags });
};


module.exports = { createTag, getAllTags };