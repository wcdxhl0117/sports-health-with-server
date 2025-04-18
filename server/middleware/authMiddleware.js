const jwt = require('jsonwebtoken');
const db = require('../models/db');

// JWT密钥，实际应用中应从环境变量获取
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 验证token的中间件
module.exports = (req, res, next) => {
  try {
    // 从请求头获取token
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: '没有提供访问令牌，请先登录' });
    }
    
    // 验证token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 检查用户是否存在
    const user = db.getUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: '用户不存在，请重新登录' });
    }
    
    // 将用户信息添加到请求对象
    req.user = { id: decoded.id, username: decoded.username };
    
    next();
  } catch (error) {
    console.error('验证令牌错误:', error);
    return res.status(401).json({ message: '令牌无效或已过期，请重新登录' });
  }
}; 