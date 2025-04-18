const express = require('express');
const router = express.Router();
const trainingController = require('../controllers/trainingController');
const authMiddleware = require('../middleware/authMiddleware');

// 公开路由 - 获取训练动作
router.get('/exercises', trainingController.getAllExercises);
router.get('/exercises/:exerciseId', trainingController.getExerciseById);
router.get('/exercises/target/:targetArea', trainingController.getExercisesByTargetArea);

// 公开路由 - 获取训练计划
router.get('/plans', trainingController.getAllTrainingPlans);
router.get('/plans/:planId', trainingController.getTrainingPlanById);

// 需要登录的路由
router.use(authMiddleware);

// 训练计划管理
router.post('/plans', trainingController.createTrainingPlan);
router.put('/plans/:planId', trainingController.updateTrainingPlan);

// 训练记录管理
router.get('/records', trainingController.getUserTrainingRecords);
router.post('/records', trainingController.addTrainingRecord);
router.put('/records/:recordId', trainingController.updateTrainingRecord);

module.exports = router; 