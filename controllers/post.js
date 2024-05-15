import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { Post, postLikes } from "../models/post.js";
import cloudinary from "cloudinary";
import Notification from "../models/notification.js";
import User from "../models/user.js";
import Follower from "../models/follower.js";
import { Comment } from "../models/comment.js";
import path from "path";
import "dotenv/config.js";

const DOMAIN = process.env.DOMAIN;

const options = {
  use_filename: true,
  unique_filename: false,
  overwrite: true,
};

export const createPost = async (req, res) => {
  req.body.author = req.user.userId;
  const imagePath = req.body.image;
  try {
    const result = await cloudinary.v2.uploader.upload(imagePath, {
      folder: "PenPages/Post/Image/",
      use_filename: true,
    });
    req.body.imageCloudinaryUrl = result.url;
    const imageName = path.basename(req.body.image);
    req.body.image = imageName;
  } catch (error) {
    console.log(error);
    throw new BadRequestError("error uploading image on cloudinary");
  }
  if (!req.body.imageCloudinaryUrl) {
    throw new BadRequestError("error uploading image on cloudinary");
  }
  const post = await Post.create({ ...req.body });
  const author = await User.findOne({ _id: post.author });
  if (!author) {
    throw new NotFoundError(`User/ Author with id ${post.author} does not exist`);
  }
  const followers = await Follower.find({ user: post.author });
  followers.forEach(aFollower => {
    Notification.create({
      fromUser: post.author,
      toUser: aFollower.follower,
      info: `${author.username} just published a post ${post.title}`,
      url: `${DOMAIN}/api/v1/post/${post.id}`,
    });
  });
  res.status(StatusCodes.CREATED).json({ post });
};

export const getAllPosts = async (req, res) => {
  let allPosts = await Post.find({})
    .populate({ path: "author", select: "username firstName lastName imageCloudinaryUrl _id" })
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
  let allPosts = [];
  let allFollowedAuthors = [];

  // Get all authors followed by the user
  const followedAuthors = await Follower.find({ follower: userId });
  followedAuthors.forEach(aFollowedAuthor => {
    allFollowedAuthors.push(aFollowedAuthor.follower);
  });

  // Loop through each followed author to fetch their posts
  for (let i = 0; i < allFollowedAuthors.length; i++) {
    const authorId = allFollowedAuthors[i];

    // Fetch posts for the current followed author
    const posts = await Post.find({ author: authorId });

    // Loop through each post to get likes
    for (let j = 0; j < posts.length; j++) {
      const post = posts[j];

      // Fetch likes for the current post
      const likes = await getLikesForPost(post._id);

      // Add likes to the post object
      post.likes = likes;

      // Add the post to the list of all posts
      allPosts.push(post);
    }
  }

  // Return all posts with likes in the response
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
    .populate({ path: "author", select: "username firstName lastName imageCloudinaryUrl _id" })
    .populate("tag");

  if (!post) {
    throw new NotFoundError(`Post with id ${postId} does not exist`);
  }

  // Function to get likes for the post
  const getLikesForPost = async postId => {
    try {
      const likes = await postLikes.find({ post: postId }).populate("user", "username firstName lastName _id");
      return likes;
    } catch (error) {
      console.error(`Error fetching likes for post ${postId}:`, error);
      return [];
    }
  };

  const getPostComments = async postId => {
    try {
      const comments = await Comment.find({ post: postId }).populate("user", "username firstName lastName _id");
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

export const updatePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.userId;
  const imagePath = req.files.fileToUpload.path;

  if (imagePath) {
    try {
      const result = await cloudinary.v2.uploader.upload(imagePath, {
        folder: "PenPages/Post/Image",
        use_filename: true,
      });

      req.body.imageCloudinaryUrl = result.url;
      const imageName = path.basename(req.files.fileToUpload.path);
      req.body.image = imageName;
    } catch (error) {
      console.error(error);
      throw new BadRequestError("error uploading image on cloudinary");
    }
  }

  const post = await Post.findOneAndUpdate({ _id: postId, author: userId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!post) {
    throw new NotFoundError(`Post with id ${postId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ post });
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
      url: `${DOMAIN}/api/v1/post/${post.id}`,
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
  const likes = await postLikes
    .find({ post: postId })
    .populate("user", "username firstName lastName imageCloudinaryUrl _id");
  res.status(StatusCodes.OK).json({ likes });
};

export const getAUserPosts = async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username: username });
  if (!user) {
    throw new NotFoundError(`User does not exist`);
  }
  let posts = await Post.find({ author: user._id })
    .populate({ path: "author", select: "username firstName lastName imageCloudinaryUrl _id" })
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
