const db = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// JWT密钥，实际应用中应从环境变量获取
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 注册新用户
exports.register = async (req, res) => {
  try {
    const { username, password, email, nickname } = req.body;

    // 验证必填字段
    if (!username || !password || !email) {
      return res.status(400).json({ message: '请提供用户名、密码和邮箱' });
    }

    // 检查用户名是否已存在
    const existingUser = db.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: '用户名已存在' });
    }

    // 加密密码
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 创建新用户
    const newUser = db.createUser({
      username,
      password: hashedPassword,
      email,
      nickname: nickname || username,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      bio: '',
      expertise: [],
      followers: 0,
      following: 0,
      trainingDays: 0
    });

    // 创建JWT令牌
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // 返回用户信息（不包含密码）和令牌
    const { password: pwd, ...userWithoutPassword } = newUser;
    return res.status(201).json({
      message: '注册成功',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('注册错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 用户登录
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 验证必填字段
    if (!username || !password) {
      return res.status(400).json({ message: '请提供用户名和密码' });
    }

    // 检查用户是否存在
    const user = db.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: '用户名或密码不正确' });
    }

    // 验证密码
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: '用户名或密码不正确' });
    }

    // 创建JWT令牌
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // 返回用户信息（不包含密码）和令牌
    const { password: pwd, ...userWithoutPassword } = user;
    return res.status(200).json({
      message: '登录成功',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('登录错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 获取当前登录用户信息
exports.getCurrentUser = (req, res) => {
  try {
    // 从请求中获取用户ID（由auth中间件处理）
    const userId = req.user.id;
    
    // 获取用户信息
    const user = db.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    // 返回用户信息（不包含密码）
    const { password, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('获取当前用户信息错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
}; 