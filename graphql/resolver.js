const User = require("../models/user");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const Post = require("../models/post");
const { create } = require("../models/user");

module.exports = {
  hello() {
    return { text: { statement: "whatsup" }, views: 2 };
  },
  createUser: async function (args, req) {
    const errors = [];
    if (!validator.isEmail(args.userInput.email)) {
      errors.push({ message: "Invalid email" });
    }
    if (
      validator.isEmpty(args.userInput.password) ||
      !validator.isLength(args.userInput.password, { min: 5 })
    ) {
      errors.push({ message: "too  short  password" });
    }
    if (errors.length > 0) {
      console.log(errors);
      const error = new Error("Invalid Input");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const exisitngUser = await User.findOne({ email: args.userInput.email });

    if (exisitngUser) {
      const error = new Error(`User exists already`);
      throw error;
    }
    const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
    const user = User({
      email: args.userInput.email,
      name: args.userInput.name,
      password: hashedPassword,
    });
    const createdUser = await user.save();
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },
  login: async function ({ email, password }, req) {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error(`User not found`);
      error.code = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error(`PAssword is Incorrect`);
      error.code = 401;
      throw error;
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET_STRING,
      { expiresIn: "1h" }
    );

    return { token: token, userId: user._id.toString() };
  },
  createPost: async function ({ postInput }, req) {
    if (!req.isAuth) {
      const error = new Error(`Not Authenticated`);
      error.code = 401;
      throw error;
    }
    const errors = [];
    if (
      validator.isEmpty(postInput.title) ||
      !validator.isLength(postInput.title, { min: 5 })
    ) {
      errors.push({ message: "Title is invalid" });
    }
    if (errors.length > 0) {
      console.log(errors);
      const error = new Error("Invalid Input");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const user = await User.findById(req.userId);
    if (!user) {
      throw new Error(`invalid user`);
    }
    const post = Post({
      title: postInput.title,
      content: postInput.content,
      imageUrl: postInput.imageUrl,
      creator: user,
    });
    const createdPost = await post.save();
    user.posts.push(createdPost);
    user.save();
    return {
      ...createdPost,
      _id: createdPost._id.toString(),
      createdAt: createdPost.createdAt.toISOString(),
      updatedAt: createdPost.updatedAt.toISOString(),
    };
  },
  posts: async function ({ page }, req) {
    if (!req.isAuth) {
      const error = new Error(`Not Authenticated`);
      error.code = 401;
      throw error;
    }
    if (!page) {
      page = 1;
    }
    const perPage = 2;
    const totalPosts = await Post.find().countDocuments();
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("creator");

    return {
      posts: posts.map((p) => {
        return {
          ...p._doc,
          _id: p._id.toString(),
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString,
        };
      }),
      totalPosts: totalPosts,
    };
  },
  
};
