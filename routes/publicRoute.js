const express = require("express")
const { getSearchQuery, getSingleBlog } = require("../controller/publicController")
const blogRouter = express.Router()

blogRouter.get("/getsearchByQuery", getSearchQuery)
blogRouter.get("/singleBlog/:id", getSingleBlog)

module.exports = blogRouter