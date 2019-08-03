const express = require("express");
const multer = require("multer");


const Post = require("../models/post");

const router = express.Router();

const MIME_TYPE_MAP = {
"img/png" : 'png',
"image/jpeg" : 'jpg',
"image/jpg" : 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, callbk) => {
    const isValid= MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type!");
    if(isValid){
      error = null;
    }
    callbk(error,"backend/images");
  },
  filename:(req,file,callbk) => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    callbk(null,name + '-' + Date.now() + '.' + ext);
  }
});



router.post("",multer({storage: storage}).single("image"),(req,res,next) => {
  const url= req.protocol + "://"+ req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });
  post.save().then(result => {
    res.status(201).json({
      post:{
        ...result,
        id: result._id
      }
    });
  });

});


router.get("",(req, res, next) =>{
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPost;
  if(pageSize && currentPage){
    postQuery
    .skip(pageSize * (currentPage - 1))
    .limit(pageSize);
  }
  postQuery
  .then(document =>
  {
    fetchedPost =document;
      return Post.count();
 })
 .then(count  => {
  res.status(200).json({
    message:"I am successfuly executed!",
    posts : fetchedPost,
    maxPosts : count
 });
});
});

router.get("/:id",(req, res, next) => {
Post.findById(req.params.id).then(post => {
  if(post){
    res.status(200).json(post);
  } else {
    res.status(400).json({message: 'Data not found!'});
  }
});
});

router.put("/:id",multer({storage: storage}).single("image"),(req, res, next) => {
  let imagePath = req.body.imagePath;
  if(req.file) {
    const url= req.protocol + "://"+ req.get("host");
    imagePath = url + "/images/" + req.file.filename
  }
  const post = new Post({
  _id: req.body.id,
  title: req.body.title,
  content: req.body.content,
  imagePath: imagePath
});

Post.updateOne({_id:req.params.id},post).then(result => {
res.status(200).json({message:"updated!"});
})
});

router.delete("/:id",(req,res,next) => {
Post.deleteOne({_id:req.params.id}).then(result => {
  console.log(result);
  res.status(200).json({message:'Post Deleted!'});
});
});

module.exports = router;
