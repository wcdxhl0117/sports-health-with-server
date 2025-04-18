const db = require('../models/db');

// 获取用户公开信息
exports.getUserProfile = (req, res) => {
  try {
    const { userId } = req.params;
    
    // 获取用户信息
    const user = db.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    // 返回用户公开信息（不包含密码和敏感信息）
    const { password, email, ...publicUserInfo } = user;
    return res.status(200).json(publicUserInfo);
  } catch (error) {
    console.error('获取用户资料错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 更新用户资料
exports.updateUserProfile = (req, res) => {
  try {
    // 从请求中获取用户ID（由auth中间件处理）
    const userId = req.user.id;
    
    // 允许更新的字段
    const { nickname, bio, avatar, expertise } = req.body;
    
    // 获取用户信息
    const user = db.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    // 更新用户信息
    const updatedUser = db.updateUser(userId, {
      ...user,
      nickname: nickname !== undefined ? nickname : user.nickname,
      bio: bio !== undefined ? bio : user.bio,
      avatar: avatar !== undefined ? avatar : user.avatar,
      expertise: expertise !== undefined ? expertise : user.expertise
    });
    
    // 返回更新后的用户信息（不包含密码）
    const { password, ...userWithoutPassword } = updatedUser;
    return res.status(200).json({
      message: '用户资料已更新',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('更新用户资料错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 获取用户训练记录统计
exports.getUserStats = (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    
    // 获取用户信息
    const user = db.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    // 获取用户训练记录
    const trainingRecords = db.getTrainingRecordsByUserId(userId);
    
    // 计算统计数据
    const totalWorkouts = trainingRecords.length;
    
    // 计算训练时间总和（分钟）
    const totalTrainingTime = trainingRecords.reduce((sum, record) => {
      return sum + (record.duration || 0);
    }, 0);
    
    // 获取目标区域的训练次数
    const targetAreaMap = {};
    trainingRecords.forEach(record => {
      if (record.exercises && record.exercises.length > 0) {
        record.exercises.forEach(exercise => {
          const exerciseData = db.getExerciseById(exercise.exerciseId);
          if (exerciseData && exerciseData.targetArea) {
            targetAreaMap[exerciseData.targetArea] = (targetAreaMap[exerciseData.targetArea] || 0) + 1;
          }
        });
      }
    });
    
    // 构建统计响应
    const stats = {
      userId,
      username: user.username,
      totalWorkouts,
      totalTrainingTime,
      trainingDays: user.trainingDays || 0,
      targetAreaStats: Object.entries(targetAreaMap).map(([area, count]) => ({
        area,
        count
      })).sort((a, b) => b.count - a.count)
    };
    
    return res.status(200).json(stats);
  } catch (error) {
    console.error('获取用户统计错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 获取用户训练计划列表
exports.getUserTrainingPlans = (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    
    // 获取用户训练计划
    const trainingPlans = db.getTrainingPlansByUserId(userId);
    
    return res.status(200).json(trainingPlans);
  } catch (error) {
    console.error('获取用户训练计划错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
}; 