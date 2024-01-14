import { StatusCodes } from "http-status-codes";
import Tag from "../models/tag.js";

export const createTag = async (req, res) => {
	const tag = await Tag.create({ ...req.body });
	res.status(StatusCodes.CREATED).json({ tag });
};

export const getAllTags = async (req, res) => {
	const tags = await Tag.find({});
	res.status(StatusCodes.OK).json({ tags });
};

export const getTag = async (req, res) => {
	const {tagId} = req.params
	const tag = await Tag.findOne({ _id: tagId });
	if (!tag) {
    throw new NotFoundError(`Tag with id ${tagId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ tag });
};

export const updateTag = async (req, res) => {
  const { tagId } = req.params;
  const tag = await Tag.findOneAndUpdate({ _id: tagId }, req.body, { new: true, runValidators: true });
  res.status(StatusCodes.OK).json({ tag });
};
