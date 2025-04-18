const fs = require('fs');
const path = require('path');

// 数据文件路径
const dataPath = path.join(__dirname, '../data');
const usersFile = path.join(dataPath, 'users.json');
const trainingPlansFile = path.join(dataPath, 'training_plans.json');
const exercisesFile = path.join(dataPath, 'exercises.json');
const trainingRecordsFile = path.join(dataPath, 'training_records.json');
const postsFile = path.join(dataPath, 'posts.json');
const commentsFile = path.join(dataPath, 'comments.json');

// 创建数据目录（如果不存在）
if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath, { recursive: true });
}

// 工具函数：读取JSON文件
const readJsonFile = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return [];
  }
};

// 工具函数：写入JSON文件
const writeJsonFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
    return false;
  }
};

// 数据操作函数
const db = {
  // 用户相关
  getUsers: () => readJsonFile(usersFile),
  getUserById: (id) => {
    const users = readJsonFile(usersFile);
    return users.find(user => user.id === id);
  },
  getUserByUsername: (username) => {
    const users = readJsonFile(usersFile);
    return users.find(user => user.username === username);
  },
  createUser: (userData) => {
    const users = readJsonFile(usersFile);
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      ...userData,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    writeJsonFile(usersFile, users);
    return newUser;
  },
  updateUser: (id, userData) => {
    const users = readJsonFile(usersFile);
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...userData };
      writeJsonFile(usersFile, users);
      return users[index];
    }
    return null;
  },

  // 训练计划相关
  getTrainingPlans: () => readJsonFile(trainingPlansFile),
  getTrainingPlanById: (id) => {
    const plans = readJsonFile(trainingPlansFile);
    return plans.find(plan => plan.id === id);
  },
  getTrainingPlansByUserId: (userId) => {
    const plans = readJsonFile(trainingPlansFile);
    return plans.filter(plan => plan.userId === userId);
  },
  createTrainingPlan: (planData) => {
    const plans = readJsonFile(trainingPlansFile);
    const newPlan = {
      id: plans.length > 0 ? Math.max(...plans.map(p => p.id)) + 1 : 1,
      ...planData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    plans.push(newPlan);
    writeJsonFile(trainingPlansFile, plans);
    return newPlan;
  },
  updateTrainingPlan: (id, planData) => {
    const plans = readJsonFile(trainingPlansFile);
    const index = plans.findIndex(plan => plan.id === id);
    if (index !== -1) {
      plans[index] = { 
        ...plans[index], 
        ...planData,
        updatedAt: new Date().toISOString()
      };
      writeJsonFile(trainingPlansFile, plans);
      return plans[index];
    }
    return null;
  },

  // 训练动作相关
  getExercises: () => readJsonFile(exercisesFile),
  getExerciseById: (id) => {
    const exercises = readJsonFile(exercisesFile);
    return exercises.find(exercise => exercise.id === id);
  },
  getExercisesByTargetArea: (targetArea) => {
    const exercises = readJsonFile(exercisesFile);
    
    // 处理targetArea是字符串的情况
    if (typeof targetArea === 'string') {
      return exercises.filter(exercise => {
        if (Array.isArray(exercise.targetArea)) {
          return exercise.targetArea.includes(targetArea);
        } else if (typeof exercise.targetArea === 'string') {
          return exercise.targetArea === targetArea;
        }
        return false;
      });
    }
    
    // 处理targetArea是数组的情况
    if (Array.isArray(targetArea)) {
      return exercises.filter(exercise => {
        if (Array.isArray(exercise.targetArea)) {
          return targetArea.some(area => exercise.targetArea.includes(area));
        } else if (typeof exercise.targetArea === 'string') {
          return targetArea.includes(exercise.targetArea);
        }
        return false;
      });
    }
    
    // 默认返回空数组
    return [];
  },

  // 训练记录相关
  getTrainingRecords: () => readJsonFile(trainingRecordsFile),
  getTrainingRecordById: (id) => {
    const records = readJsonFile(trainingRecordsFile);
    return records.find(record => record.id === id);
  },
  getTrainingRecordsByUserId: (userId) => {
    const records = readJsonFile(trainingRecordsFile);
    return records.filter(record => record.userId === userId);
  },
  createTrainingRecord: (recordData) => {
    const records = readJsonFile(trainingRecordsFile);
    const newRecord = {
      id: records.length > 0 ? Math.max(...records.map(r => r.id)) + 1 : 1,
      ...recordData,
      date: new Date().toISOString()
    };
    records.push(newRecord);
    writeJsonFile(trainingRecordsFile, records);
    return newRecord;
  },
  updateTrainingRecord: (id, recordData) => {
    const records = readJsonFile(trainingRecordsFile);
    const index = records.findIndex(record => record.id === id);
    if (index !== -1) {
      records[index] = { ...records[index], ...recordData };
      writeJsonFile(trainingRecordsFile, records);
      return records[index];
    }
    return null;
  },

  // 帖子相关
  getPosts: () => readJsonFile(postsFile),
  getPostById: (id) => {
    const posts = readJsonFile(postsFile);
    return posts.find(post => post.id === id);
  },
  getPostsByUserId: (userId) => {
    const posts = readJsonFile(postsFile);
    return posts.filter(post => post.userId === userId);
  },
  createPost: (postData) => {
    const posts = readJsonFile(postsFile);
    const newPost = {
      id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
      ...postData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0
    };
    posts.push(newPost);
    writeJsonFile(postsFile, posts);
    return newPost;
  },
  updatePost: (id, postData) => {
    const posts = readJsonFile(postsFile);
    const index = posts.findIndex(post => post.id === id);
    if (index !== -1) {
      posts[index] = { 
        ...posts[index], 
        ...postData,
        updatedAt: new Date().toISOString()
      };
      writeJsonFile(postsFile, posts);
      return posts[index];
    }
    return null;
  },
  likePost: (id) => {
    const posts = readJsonFile(postsFile);
    const index = posts.findIndex(post => post.id === id);
    if (index !== -1) {
      posts[index].likes += 1;
      writeJsonFile(postsFile, posts);
      return posts[index];
    }
    return null;
  },

  // 评论相关
  getComments: () => readJsonFile(commentsFile),
  getCommentById: (id) => {
    const comments = readJsonFile(commentsFile);
    return comments.find(comment => comment.id === id);
  },
  getCommentsByPostId: (postId) => {
    const comments = readJsonFile(commentsFile);
    return comments.filter(comment => comment.postId === postId);
  },
  createComment: (commentData) => {
    const comments = readJsonFile(commentsFile);
    const newComment = {
      id: comments.length > 0 ? Math.max(...comments.map(c => c.id)) + 1 : 1,
      ...commentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0
    };
    comments.push(newComment);
    writeJsonFile(commentsFile, comments);
    return newComment;
  },
  likeComment: (id) => {
    const comments = readJsonFile(commentsFile);
    const index = comments.findIndex(comment => comment.id === id);
    if (index !== -1) {
      comments[index].likes += 1;
      writeJsonFile(commentsFile, comments);
      return comments[index];
    }
    return null;
  }
};

module.exports = db; 