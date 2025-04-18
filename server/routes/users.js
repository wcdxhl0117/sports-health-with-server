/*
 * @Author: wangchao wcd126yx@126.com
 * @Date: 2025-04-18 20:29:11
 * @LastEditors: wangchao
 * @LastEditTime: 2025-04-18 20:32:50
 * @Description: file content
 */
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// 获取用户公开资料（无需登录）
router.get('/profile/:userId', userController.getUserProfile);

// 需要登录的路由
router.use(authMiddleware);

// 更新当前用户资料
router.put('/profile', userController.updateUserProfile);

// 获取用户统计信息
router.get('/stats', userController.getUserStats); // 当前用户
router.get('/stats/:userId', userController.getUserStats); // 指定用户

// 获取用户训练计划
router.get('/training-plans', userController.getUserTrainingPlans); // 当前用户
router.get('/training-plans/:userId', userController.getUserTrainingPlans); // 指定用户

module.exports = router; 