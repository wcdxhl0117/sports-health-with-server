const db = require('../models/db');

// 获取所有帖子
exports.getAllPosts = (req, res) => {
  try {
    const posts = db.getPosts();
    return res.status(200).json(posts);
  } catch (error) {
    console.error('获取帖子错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 根据ID获取帖子
exports.getPostById = (req, res) => {
  try {
    const { postId } = req.params;
    const post = db.getPostById(parseInt(postId));
    
    if (!post) {
      return res.status(404).json({ message: '帖子不存在' });
    }
    
    // 获取帖子评论
    const comments = db.getCommentsByPostId(parseInt(postId));
    
    return res.status(200).json({
      ...post,
      comments
    });
  } catch (error) {
    console.error('获取帖子错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 获取用户帖子
exports.getUserPosts = (req, res) => {
  try {
    const { userId } = req.params;
    const posts = db.getPostsByUserId(parseInt(userId));
    
    return res.status(200).json(posts);
  } catch (error) {
    console.error('获取用户帖子错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 创建帖子
exports.createPost = (req, res) => {
  try {
    const userId = req.user.id;
    const { content, images, tags } = req.body;
    
    // 验证必填字段
    if (!content) {
      return res.status(400).json({ message: '请提供帖子内容' });
    }
    
    // 获取用户信息
    const user = db.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    // 创建帖子
    const userInfo = {
      id: user.id,
      name: user.name || user.nickname || user.username,
      avatar: user.avatar,
      isExpert: user.isExpert || false
    };
    
    const newPost = db.createPost({
      userId,
      user: userInfo,
      content,
      images: images || [],
      tags: tags || []
    });
    
    return res.status(201).json({
      message: '帖子发布成功',
      post: newPost
    });
  } catch (error) {
    console.error('创建帖子错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 点赞帖子
exports.likePost = (req, res) => {
  try {
    const { postId } = req.params;
    
    // 获取帖子
    const post = db.getPostById(parseInt(postId));
    
    if (!post) {
      return res.status(404).json({ message: '帖子不存在' });
    }
    
    // 点赞帖子
    const updatedPost = db.likePost(parseInt(postId));
    
    return res.status(200).json({
      message: '点赞成功',
      likes: updatedPost.likes
    });
  } catch (error) {
    console.error('点赞帖子错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 获取帖子评论
exports.getPostComments = (req, res) => {
  try {
    const { postId } = req.params;
    
    // 获取帖子
    const post = db.getPostById(parseInt(postId));
    
    if (!post) {
      return res.status(404).json({ message: '帖子不存在' });
    }
    
    // 获取评论
    const comments = db.getCommentsByPostId(parseInt(postId));
    
    return res.status(200).json(comments);
  } catch (error) {
    console.error('获取评论错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 添加评论
exports.addComment = (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;
    const { content, parentId } = req.body;
    
    // 验证必填字段
    if (!content) {
      return res.status(400).json({ message: '请提供评论内容' });
    }
    
    // 获取帖子
    const post = db.getPostById(parseInt(postId));
    
    if (!post) {
      return res.status(404).json({ message: '帖子不存在' });
    }
    
    // 获取用户信息
    const user = db.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    // 创建评论
    const userInfo = {
      id: user.id,
      name: user.name || user.nickname || user.username,
      avatar: user.avatar,
      isExpert: user.isExpert || false
    };
    
    const newComment = db.createComment({
      postId: parseInt(postId),
      userId,
      user: userInfo,
      content,
      parentId: parentId ? parseInt(parentId) : null
    });
    
    return res.status(201).json({
      message: '评论发布成功',
      comment: newComment
    });
  } catch (error) {
    console.error('添加评论错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 点赞评论
exports.likeComment = (req, res) => {
  try {
    const { commentId } = req.params;
    
    // 获取评论
    const comment = db.getCommentById(parseInt(commentId));
    
    if (!comment) {
      return res.status(404).json({ message: '评论不存在' });
    }
    
    // 点赞评论
    const updatedComment = db.likeComment(parseInt(commentId));
    
    return res.status(200).json({
      message: '点赞成功',
      likes: updatedComment.likes
    });
  } catch (error) {
    console.error('点赞评论错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
}; 