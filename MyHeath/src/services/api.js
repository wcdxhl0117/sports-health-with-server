import axios from 'axios';

// 创建API实例
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器 - 添加token到请求头
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理常见错误
api.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    // 401未授权错误，清除本地token
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // 如果有全局的路由实例，可以跳转到登录页
      // router.push('/login');
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// 认证相关API
export const authAPI = {
  // 用户注册
  register: (userData) => api.post('/auth/register', userData),

  // 用户登录
  login: (credentials) => api.post('/auth/login', credentials),

  // 获取当前用户信息
  getCurrentUser: () => api.get('/auth/me'),

  // 退出登录（前端处理）
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// 用户相关API
export const userAPI = {
  // 获取用户公开资料
  getUserProfile: (userId) => api.get(`/users/profile/${userId}`),

  // 更新当前用户资料
  updateUserProfile: (userData) => api.put('/users/profile', userData),

  // 获取用户统计信息
  getUserStats: (userId) => {
    if (userId) {
      return api.get(`/users/stats/${userId}`);
    }
    return api.get('/users/stats');
  },

  // 获取用户训练计划
  getUserTrainingPlans: (userId) => {
    if (userId) {
      return api.get(`/users/training-plans/${userId}`);
    }
    return api.get('/users/training-plans');
  }
};

// 训练相关API
export const trainingAPI = {
  // 获取所有训练动作
  getAllExercises: () => api.get('/training/exercises'),

  // 根据ID获取训练动作
  getExerciseById: (exerciseId) => api.get(`/training/exercises/${exerciseId}`),

  // 根据目标区域获取训练动作
  getExercisesByTargetArea: (targetArea, options = {}) => {
    const { limit } = options;
    let url = `/training/exercises/target/${targetArea}`;
    if (limit) {
      url += `?limit=${limit}`;
    }
    return api.get(url);
  },

  // 获取所有训练计划
  getAllTrainingPlans: () => api.get('/training/plans'),

  // 根据ID获取训练计划
  getTrainingPlanById: (planId) => api.get(`/training/plans/${planId}`),

  // 创建训练计划
  createTrainingPlan: (planData) => api.post('/training/plans', planData),

  // 更新训练计划
  updateTrainingPlan: (planId, planData) => api.put(`/training/plans/${planId}`, planData),

  // 获取用户训练记录
  getUserTrainingRecords: () => api.get('/training/records'),

  // 添加训练记录
  addTrainingRecord: (recordData) => api.post('/training/records', recordData),

  // 更新训练记录
  updateTrainingRecord: (recordId, recordData) => api.put(`/training/records/${recordId}`, recordData)
};

// 社区帖子相关API
export const postAPI = {
  // 获取所有帖子
  getAllPosts: () => api.get('/posts'),

  // 根据ID获取帖子（包含评论）
  getPostById: (postId) => api.get(`/posts/${postId}`),

  // 获取用户的帖子
  getUserPosts: (userId) => api.get(`/posts/user/${userId}`),

  // 创建帖子
  createPost: (postData) => api.post('/posts', postData),

  // 点赞帖子
  likePost: (postId) => api.post(`/posts/${postId}/like`),

  // 获取帖子评论
  getPostComments: (postId) => api.get(`/posts/${postId}/comments`),

  // 添加评论
  addComment: (postId, commentData) => api.post(`/posts/${postId}/comments`, commentData),

  // 点赞评论
  likeComment: (commentId) => api.post(`/posts/comments/${commentId}/like`)
};

export default {
  auth: authAPI,
  user: userAPI,
  training: trainingAPI,
  post: postAPI
};
