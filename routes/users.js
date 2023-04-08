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

// ユーザー情報の取得
router.get("/:id", async(req, res) => {
    try{
      const user = await User.findById(req.params.id);
      const {password, updatedAt, ...other } = user._doc;
      res.status(200).json(other);
    }catch(err){
      console.log(err);
    }
});

// ユーザのフォロー
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id){
    try{
      // 今からフォローするユーザ
      const user = await User.findById(req.params.id);
      // 自分
      const currentUser = await User.findById(req.body.userId);
      // フォロワーに自分がいなければフォローできる
      if (!user.followers.includes(req.body.userId)){
        await user.updateOne({
          $push: {
            followers: req.body.userId
          },
        });
        await currentUser.updateOne({
          $push:{
            followings:req.params.id,
          },
        });
        return res.status(200).json("フォローに成功しました。");
      }else{
        return res.status(403).json("あなたは既にこのユーザーをフォローしています。")
      }
    }catch(err){
      console.log(err);
    }
  }else{
    return res.status(500).json("自分自身をフォローできません。")
  }
});

// ユーザーのフォローを外す
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id){
    try{
      // 今からフォローを外すユーザ
      const user = await User.findById(req.params.id);
      // 自分
      const currentUser = await User.findById(req.body.userId);
      // フォロワーに存在したらフォローを外せる
      if (user.followers.includes(req.body.userId)){
        await user.updateOne({
          $pull: {
            followers: req.body.userId
          },
        });
        await currentUser.updateOne({
          $pull:{
            followings:req.params.id,
          },
        });
        return res.status(200).json("フォローを解除しました。");
      }else{
        return res.status(403).json("このユーザーはフォローを解除できません。")
      }
    }catch(err){
      console.log(err);
    }
  }else{
    return res.status(500).json("自分自身をフォローできません。")
  }
});


module.exports = router;