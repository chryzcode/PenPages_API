import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import Tag from "../models/tag.js";
import User from "../models/user.js";

export const createTag = async (req, res) => {
  const userId = req.user.userId;
  const user = User.findOne({ _id: userId, admin: true });
  if (!user) {
    throw new NotFoundError(`User with id ${userId} who is an admin does not exist`);
  }
  const tag = await Tag.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ tag });
};

export const getAllTags = async (req, res) => {
  const tags = await Tag.find({});
  res.status(StatusCodes.OK).json({ tags });
};

export const getTag = async (req, res) => {
  const { tagId } = req.params;
  const tag = await Tag.findOne({ _id: tagId });
  if (!tag) {
    throw new NotFoundError(`Tag with id ${tagId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ tag });
};

export const updateTag = async (req, res) => {
  const { tagId } = req.params;
  const user = User.findOne({ _id: userId, admin: true });
  if (!user) {
    throw new NotFoundError(`User with id ${userId} who is an admin does not exist`);
  }
  const tag = await Tag.findOneAndUpdate({ _id: tagId }, req.body, { new: true, runValidators: true });
  if (!tag) {
    throw new NotFoundError(`Tag with id ${tagId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ tag });
};

export const deleteTag = async (req, res) => {
  const { tagId } = req.params;
  const user = User.findOne({ _id: userId, admin: true });
  if (!user) {
    throw new NotFoundError(`User with id ${userId} who is an admin does not exist`);
  }
  const tag = await Tag.findOneAndDelete({ _id: tagId });
  if (!tag) {
    throw new NotFoundError(`Tag with id ${tagId} does not exist`);
  }
  res.status(StatusCodes.OK).send();
};
