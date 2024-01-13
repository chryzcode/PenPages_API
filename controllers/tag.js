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
	const tag = await Tag.find({ _id: tagId });
  res.status(StatusCodes.OK).json({ tag });
};
