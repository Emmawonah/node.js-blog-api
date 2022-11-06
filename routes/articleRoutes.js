const express = require("express");
const { createPost, getAllPosts, updateState, updatePost, deletePost } = require("../controller/articleController");
const articleRouter = express.Router();

articleRouter.post("/createArticle", createPost);
articleRouter.get("/getArticle", getAllPosts)
articleRouter.patch("/updateArticleState/:id",updateState)
articleRouter.put("/editArticle/:id",updatePost)
articleRouter.delete("/deleteArticle/:id",deletePost)

module.exports = articleRouter
