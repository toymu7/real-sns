const router = require("express").Router();
const User = require("../models/User.js");

// CRUD
// ユーザー情報の更新
router.put("/:id", async(req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin){
    try{
      const user = await User.findByIdAndUpdate(req.params.id, {$set: req.body});
      res.status(200).json("ユーザー情報が更新できました");
    }catch(err){
      console.log(err);
    }
  }else{
    return res.status(403).json("あなたは自分のアカウントの時のみ情報を更新できます。");
  }
});

// ユーザー情報の削除
router.delete("/:id", async(req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin){
    try{
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("ユーザー情報が削除されました");
    }catch(err){
      console.log(err);
    }
  }else{
    return res.status(403).json("あなたは自分のアカウントの時のみ情報を削除できます。");
  }
});


// router.get("/", (req, res) => {
//   res.send("user router");
// });

module.exports = router;