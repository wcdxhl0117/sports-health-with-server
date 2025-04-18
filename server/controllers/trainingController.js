const db = require('../models/db');

// 获取所有训练动作
exports.getAllExercises = (req, res) => {
  try {
    const exercises = db.getExercises();
    return res.status(200).json(exercises);
  } catch (error) {
    console.error('获取训练动作错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 根据ID获取训练动作
exports.getExerciseById = (req, res) => {
  try {
    const { exerciseId } = req.params;
    const exercise = db.getExerciseById(parseInt(exerciseId));
    
    if (!exercise) {
      return res.status(404).json({ message: '训练动作不存在' });
    }
    
    return res.status(200).json(exercise);
  } catch (error) {
    console.error('获取训练动作错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 根据目标区域获取训练动作
exports.getExercisesByTargetArea = (req, res) => {
  try {
    const { targetArea } = req.params;
    // 获取请求中的limit参数
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    
    let exercises;
    
    // 如果是'all'，返回所有训练动作
    if (targetArea === 'all') {
      exercises = db.getExercises();
    } else {
      exercises = db.getExercisesByTargetArea(targetArea);
    }
    
    // 如果有limit参数，限制返回数量
    if (limit && limit > 0 && exercises.length > limit) {
      exercises = exercises.slice(0, limit);
    }
    
    return res.status(200).json(exercises);
  } catch (error) {
    console.error('获取训练动作错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 获取所有训练计划
exports.getAllTrainingPlans = (req, res) => {
  try {
    const plans = db.getTrainingPlans();
    return res.status(200).json(plans);
  } catch (error) {
    console.error('获取训练计划错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 根据ID获取训练计划
exports.getTrainingPlanById = (req, res) => {
  try {
    const { planId } = req.params;
    const plan = db.getTrainingPlanById(parseInt(planId));
    
    if (!plan) {
      return res.status(404).json({ message: '训练计划不存在' });
    }
    
    return res.status(200).json(plan);
  } catch (error) {
    console.error('获取训练计划错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 创建训练计划
exports.createTrainingPlan = (req, res) => {
  try {
    const userId = req.user.id;
    const { title, duration, difficulty, weeklyPlans, notes } = req.body;
    
    // 验证必填字段
    if (!title || !weeklyPlans) {
      return res.status(400).json({ message: '请提供训练计划标题和周计划' });
    }
    
    // 创建训练计划
    const newPlan = db.createTrainingPlan({
      userId,
      title,
      duration: duration || 4,
      difficulty: difficulty || '中等',
      weeklyPlans,
      notes: notes || ''
    });
    
    return res.status(201).json({
      message: '训练计划创建成功',
      plan: newPlan
    });
  } catch (error) {
    console.error('创建训练计划错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 更新训练计划
exports.updateTrainingPlan = (req, res) => {
  try {
    const userId = req.user.id;
    const { planId } = req.params;
    const { title, duration, difficulty, weeklyPlans, notes } = req.body;
    
    // 获取训练计划
    const plan = db.getTrainingPlanById(parseInt(planId));
    
    if (!plan) {
      return res.status(404).json({ message: '训练计划不存在' });
    }
    
    // 检查权限
    if (plan.userId !== userId) {
      return res.status(403).json({ message: '您没有权限修改此训练计划' });
    }
    
    // 更新训练计划
    const updatedPlan = db.updateTrainingPlan(parseInt(planId), {
      title: title !== undefined ? title : plan.title,
      duration: duration !== undefined ? duration : plan.duration,
      difficulty: difficulty !== undefined ? difficulty : plan.difficulty,
      weeklyPlans: weeklyPlans !== undefined ? weeklyPlans : plan.weeklyPlans,
      notes: notes !== undefined ? notes : plan.notes
    });
    
    return res.status(200).json({
      message: '训练计划更新成功',
      plan: updatedPlan
    });
  } catch (error) {
    console.error('更新训练计划错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 获取用户训练记录
exports.getUserTrainingRecords = (req, res) => {
  try {
    const userId = req.user.id;
    const records = db.getTrainingRecordsByUserId(userId);
    
    return res.status(200).json(records);
  } catch (error) {
    console.error('获取训练记录错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 添加训练记录
exports.addTrainingRecord = (req, res) => {
  try {
    const userId = req.user.id;
    const { planId, exercises, duration, completed, notes } = req.body;
    
    // 验证必填字段
    if (!planId || !exercises) {
      return res.status(400).json({ message: '请提供训练计划ID和训练动作信息' });
    }
    
    // 创建训练记录
    const newRecord = db.createTrainingRecord({
      userId,
      planId: parseInt(planId),
      exercises,
      duration: duration || 0,
      completed: completed || false,
      notes: notes || ''
    });
    
    // 更新用户训练天数
    const user = db.getUserById(userId);
    if (user) {
      db.updateUser(userId, {
        totalTrainingDays: (user.totalTrainingDays || 0) + 1
      });
    }
    
    return res.status(201).json({
      message: '训练记录添加成功',
      record: newRecord
    });
  } catch (error) {
    console.error('添加训练记录错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 更新训练记录
exports.updateTrainingRecord = (req, res) => {
  try {
    const userId = req.user.id;
    const { recordId } = req.params;
    const { exercises, duration, completed, notes } = req.body;
    
    // 获取训练记录
    const record = db.getTrainingRecordById(parseInt(recordId));
    
    if (!record) {
      return res.status(404).json({ message: '训练记录不存在' });
    }
    
    // 检查权限
    if (record.userId !== userId) {
      return res.status(403).json({ message: '您没有权限修改此训练记录' });
    }
    
    // 更新训练记录
    const updatedRecord = db.updateTrainingRecord(parseInt(recordId), {
      exercises: exercises !== undefined ? exercises : record.exercises,
      duration: duration !== undefined ? duration : record.duration,
      completed: completed !== undefined ? completed : record.completed,
      notes: notes !== undefined ? notes : record.notes
    });
    
    return res.status(200).json({
      message: '训练记录更新成功',
      record: updatedRecord
    });
  } catch (error) {
    console.error('更新训练记录错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
}; 