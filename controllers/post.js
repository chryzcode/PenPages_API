import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { Post, postLikes } from "../models/post.js";
import Notification from "../models/notification.js";
import User from "../models/user.js";
import Follower from "../models/follower.js";
import Tag from "../models/tag.js";
import { Comment } from "../models/comment.js";
import "dotenv/config.js";
import { uploadToCloudinary } from "../utils/cloudinaryConfig.js";

const DOMAIN = process.env.DOMAIN;

export const createPost = async (req, res) => {
  req.body.author = req.user.userId;

  try {
    if (req.file) {
      const result = await uploadToCloudinary(req.file);
      req.body.image = result.secure_url; // Set Cloudinary URL to the image field
    }
    const post = await Post.create(req.body);

    // Notify followers
    const author = await User.findOne({ _id: post.author });
    if (!author) {
      throw new NotFoundError(`User/ Author with id ${post.author} does not exist`);
    }
    const followers = await Follower.find({ user: post.author });
    followers.forEach(async aFollower => {
      await Notification.create({
        fromUser: post.author,
        toUser: aFollower.follower,
        info: `${author.username} just published a post ${post.title}`,
        url: `${DOMAIN}/post/${post.id}`,
        type: "post",
        info_id: post.id,
      });
    });

    res.status(StatusCodes.CREATED).json({ post });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.userId;

  try {
    if (req.file) {
      const result = await uploadToCloudinary(req.file);
      req.body.image = result.secure_url; // Set Cloudinary URL to the image field
    }

    const post = await Post.findOneAndUpdate({ _id: postId, author: userId }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!post) {
      throw new NotFoundError(`Post with id ${postId} does not exist`);
    }

    res.status(StatusCodes.OK).json({ post });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

export const getAllPosts = async (req, res) => {
  let allPosts = await Post.find({})
    .populate({ path: "author", select: "username firstName lastName image _id" })
    .populate("tag")
    .sort("createdAt");

  const getLikesForPost = async postId => {
    try {
      const likes = await postLikes.find({ post: postId }).populate("user", "username firstName lastName _id");
      return likes;
    } catch (error) {
      console.error(`Error fetching likes for post ${postId}:`, error);
      return [];
    }
  };

  // Map over allPosts and retrieve likes for each post
  allPosts = await Promise.all(
    allPosts.map(async post => {
      const likes = await getLikesForPost(post._id);
      return { ...post.toObject(), likes }; // Merge likes into the post object
    })
  );
  res.status(StatusCodes.OK).json({ allPosts });
};

export const getPersonalisedPosts = async (req, res) => {
  const userId = req.user.userId;

  // Fetch followed authors
  const followedAuthors = await Follower.find({ follower: userId }).select("user");
  const followedAuthorIds = followedAuthors.map(follower => follower.user);

  let allPosts = await Post.find({ author: { $in: followedAuthorIds } })
    .populate({ path: "author", select: "username firstName lastName image _id" })
    .populate("tag")
    .sort("createdAt");

  allPosts = await Promise.all(
    allPosts.map(async post => {
      const likes = await getLikesForPost(post._id);
      return { ...post.toObject(), likes };
    })
  );

  res.status(StatusCodes.OK).json({ allPosts });
};

// Function to get likes for a post
const getLikesForPost = async postId => {
  try {
    const likes = await postLikes.find({ post: postId }).populate("user", "username firstName lastName _id");
    return likes;
  } catch (error) {
    console.error(`Error fetching likes for post ${postId}:`, error);
    return [];
  }
};

export const getPost = async (req, res) => {
  const { postId } = req.params;
  let post = await Post.findOne({ _id: postId })
    .populate({ path: "author", select: "username firstName lastName image _id" })
    .populate("tag");

  if (!post) {
    throw new NotFoundError(`Post with id ${postId} does not exist`);
  }

  // Function to get likes for the post
  const getLikesForPost = async postId => {
    try {
      const likes = await postLikes.find({ post: postId }).populate("user", "username firstName image lastName _id");
      return likes;
    } catch (error) {
      console.error(`Error fetching likes for post ${postId}:`, error);
      return [];
    }
  };

  const getPostComments = async postId => {
    try {
      const comments = await Comment.find({ post: postId }).populate("user", "username firstName image lastName _id");
      return comments;
    } catch (error) {
      console.error(`Error fetching comment for post ${postId}:`, error);
      return [];
    }
  };

  // Retrieve likes for the post
  const likes = await getLikesForPost(postId);
  const comments = await getPostComments(post);

  // Merge likes into the post object
  post = { ...post.toObject(), likes, comments };
  res.status(StatusCodes.OK).json({ post });
};

export const getUserPosts = async (req, res) => {
  const userPosts = await Post.find({ author: req.user.userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ userPosts });
};

export const deletePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.userId;
  const post = await Post.findOneAndDelete({ _id: postId, author: userId });
  if (!post) {
    throw new NotFoundError(`Post with id ${postId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ success: "Post successfully deleted" });
};

export const likePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.user;
  const liked = await postLikes.findOne({ post: postId, user: userId });
  const post = await Post.findOne({ _id: postId });
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new NotFoundError(`User with id ${userId} does not exists`);
  }
  if (!post) {
    throw new NotFoundError(`Post with id ${postId} does not exists`);
  }
  if (user.id == post.author) {
    throw new BadRequestError("You can not like your own post");
  }
  if (liked) {
    await postLikes.findOneAndDelete({ post: postId, user: userId });
  } else {
    await postLikes.create({ post: postId, user: userId });
    Notification.create({
      fromUser: user.id,
      toUser: post.author,
      info: `${user.username} just liked your post ${post.title}`,
      url: `${DOMAIN}/post/${post.id}`,
      type: "post",
      info_id: post.id,
    });
  }
  const likes = (await postLikes.find({ post: postId })).length;
  res.status(StatusCodes.OK).json({ postLikesCount: likes });
};

export const unlikePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.user;

  const post = await Post.findOne({ _id: postId });
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new NotFoundError(`User with id ${userId} does not exists`);
  }
  if (!post) {
    throw new NotFoundError(`Post with id ${postId} does not exists`);
  }
  if (user.id == post.author) {
    throw new BadRequestError("You can not unlike your own post");
  }

  await postLikes.findOneAndDelete({ post: postId, user: userId });

  const likes = (await postLikes.find({ post: postId })).length;
  res.status(StatusCodes.OK).json({ postLikesCount: likes });
};

export const aPostLikes = async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findOne({ _id: postId });
  if (!post) {
    throw new NotFoundError(`Post not found`);
  }
  const likes = await postLikes.find({ post: postId }).populate("user", "username firstName lastName image _id");
  res.status(StatusCodes.OK).json({ likes });
};

export const getAUserPosts = async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username: username });
  if (!user) {
    throw new NotFoundError(`User does not exist`);
  }
  let posts = await Post.find({ author: user._id })
    .populate({ path: "author", select: "username firstName lastName image _id" })
    .populate("tag");

  const getLikesForPost = async postId => {
    try {
      const likes = await postLikes.find({ post: postId }).populate("user", "username firstName lastName _id");
      return likes;
    } catch (error) {
      console.error(`Error fetching likes for post ${postId}:`, error);
      return [];
    }
  };

  // Map over allPosts and retrieve likes for each post
  posts = await Promise.all(
    posts.map(async post => {
      const likes = await getLikesForPost(post._id);
      return { ...post.toObject(), likes }; // Merge likes into the post object
    })
  );
  res.status(StatusCodes.OK).json({ posts });
};

export const searchPosts = async (req, res) => {
  const { query } = req.query;

  // Initialize query object
  let searchQuery = {};

  if (query) {
    // Add title search
    searchQuery.title = { $regex: query, $options: "i" }; // Case-insensitive regex search

    // Find the author(s) matching the query using case-insensitive regex
    const authorMatches = await User.find({
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
      ],
    });

    if (authorMatches.length > 0) {
      const authorIds = authorMatches.map(user => user._id);
      searchQuery.author = { $in: authorIds };
    }

    // Find the tags matching the query using case-insensitive regex
    const tagMatches = await Tag.find({ name: { $regex: query, $options: "i" } });

    if (tagMatches.length > 0) {
      const tagIds = tagMatches.map(tag => tag._id);
      searchQuery.tag = { $in: tagIds };
    }

    // Add type search
    const typeOptions = ["article", "poem", "book"];
    if (typeOptions.includes(query.toLowerCase())) {
      searchQuery.type = query.toLowerCase();
    }
  }

  let posts = await Post.find(searchQuery).populate("author tag");
  const getLikesForPost = async postId => {
    try {
      const likes = await postLikes.find({ post: postId }).populate("user", "username firstName lastName _id");
      return likes;
    } catch (error) {
      console.error(`Error fetching likes for post ${postId}:`, error);
      return [];
    }
  };

  // Map over allPosts and retrieve likes for each post
  posts = await Promise.all(
    posts.map(async post => {
      const likes = await getLikesForPost(post._id);
      return { ...post.toObject(), likes };
    })
  );

  res.status(200).json({ posts });
};
