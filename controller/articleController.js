const PostModel = require("../models/articleModel");
const UserModel = require("../models/userModel");

const CalculateReadingTime = async (body) => {
    const length = body.split(" ").length
    // console.log(bodylength)
    const Constant = 200
    const timeFrac = length / Constant
    const min = Math.floor(timeFrac)
    const seconds = Math.ceil((timeFrac - min) * 60)
    const time = `${min} minutes ${seconds} seconds`

    return time
}

const createPost = async (req, res, next) => {
  try {
    const { title, description, tags, body } = req.body;
    const author = req.user._id;

    const reading_time = await CalculateReadingTime(body);

    const authorName = `${req.user.firstname} ${req.user.lastname}`

    let post = await PostModel.create({
      title,
      description,
      tags,
      body,
      author,
      reading_time,
      authorName
    });

    post = await post.populate("author","firstname lastname")
    await post.save()
    const user = await UserModel.findById(author);
    user.posts.push(post._id);
    await user.save();

    return res.status(201).json({
      message: "Article created succesfully",
    });
  } catch (error) {
    error.status = 404;
    error.message = error.message || "not accepted";
    next(error);
  }
};

const getAllPosts = async (req, res, next) => {
  try {
    const { state = "draft", page = 1 } = req.query;

    const limit = 20
    const id = req.user._id
    const post = await PostModel.find({ author: id, state }).populate("author", "firstname lastname")
      .limit(limit * 1) 
      .skip((parseInt(page) - 1) * limit);

    // const post = PostByState
    // console.log(PostByState)
    return res.status(200).json({
      post
    })
    // console.log(PostByState)
  } catch (error) {
    error.status = 404;
    error.message = error.message || "not accepted";
    next(error);
  }
};

const updateState = async (req, res, next) => {
  try {
    const postid = req.params.id
    const state = req.query.state
    const post = await PostModel.findById({ _id: postid })
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).send("Not Authorised")
    }
    post.state = state 
    await post.save()

    return res.status(201).json({
      message: "state Updated succesfully",
    });

  } catch (error) {
    error.status = 404;
    error.message = error.message || "not accepted";
    next(error);
  }
}

const updatePost = async (req, res, next) => {
  try {
    const postid = req.params.id
    const post = await PostModel.findById({ _id: postid })
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).send("UnAuthorised")
    }
    let reading_time
    if (req.body.body) {
      reading_time = await CalculateReadingTime(req.body.body)
      await post.updateOne({ ...req.body, reading_time })
      return res.status(201).json({
        message: "edited succesfully",
      });
    }
    await post.updateOne({ ...req.body })
    return res.status(201).json({
      message: "edited succesfully",
    });
    // await PostModel.findByIdAndUpdate(postid,req.body)
  } catch (error) {
    error.status = 404;
    error.message = error.message || "not accepted";
    next(error);
  }
}

const deletePost = async (req,res,next) => {
  try {
    const postid = req.params.id
    const post = await PostModel.findById({ _id: postid })
    // console.log(post)
    if(!post){
      return res.status(404).send("details not found")
    }
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).send("Not Authorised")
    }
    const user = await UserModel.findById(req.user._id)
    user.posts = user.posts.filter(ids => ids.toString() !== postid)
    await user.save()
    await post.deleteOne()

    return res.status(201).json({
      message: "deleted succesfully",
    });
  } catch (error) {
    error.status = 404;
    error.message = error.message || "not accepted";
    next(error);
  }
}

module.exports = { createPost, getAllPosts, updateState, updatePost,deletePost };
