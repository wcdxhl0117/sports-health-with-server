<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '../services/api'
import { showToast, showLoadingToast, closeToast } from 'vant'

const router = useRouter()

// 表单数据
const username = ref('')
const password = ref('')
const loading = ref(false)

// 登录方法
const handleLogin = async () => {
  // 简单的表单验证
  if (!username.value || !password.value) {
    showToast('请输入用户名和密码')
    return
  }

  try {
    loading.value = true
    const loadingToast = showLoadingToast({
      message: '登录中...',
      forbidClick: true,
    })

    // 调用登录接口
    const response = await authAPI.login({
      username: username.value,
      password: password.value,
    })

    // 保存token和用户信息到本地存储
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response.user))

    closeToast(loadingToast)
    showToast('登录成功')

    // 跳转到首页
    router.push('/')
  } catch (error) {
    console.error('登录失败:', error)
    showToast({
      message: error.message || '登录失败，请检查用户名和密码',
      type: 'fail',
    })
  } finally {
    loading.value = false
  }
}

// 快速登录（使用预设账号）
const quickLogin = async (type) => {
  if (type === 'user') {
    username.value = 'user1'
    password.value = 'password123'
  } else if (type === 'expert') {
    username.value = 'expert1'
    password.value = 'password123'
  } else {
    // admin
    username.value = 'admin'
    password.value = 'password123'
  }

  await handleLogin()
}
</script>

<template>
  <div class="login-container">
    <div class="login-header">
      <img src="../assets/logo.png" alt="Logo" class="login-logo" />
      <h1 class="login-title">登录</h1>
      <p class="login-subtitle">欢迎使用康复训练指导系统</p>
    </div>

    <div class="login-form">
      <van-form @submit="handleLogin">
        <van-cell-group inset>
          <van-field
            v-model="username"
            name="username"
            label="用户名"
            placeholder="请输入用户名"
            :rules="[{ required: true, message: '请填写用户名' }]"
          />
          <van-field
            v-model="password"
            type="password"
            name="password"
            label="密码"
            placeholder="请输入密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
        </van-cell-group>

        <div class="login-actions">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="loading"
            :disabled="loading"
          >
            登录
          </van-button>

          <div class="register-link">
            <span>还没有账号？</span>
            <router-link to="/register">立即注册</router-link>
          </div>
        </div>
      </van-form>
    </div>

    <div class="quick-login">
      <p class="quick-login-title">快速体验（测试账号）</p>
      <div class="quick-login-options">
        <van-button plain size="small" @click="quickLogin('user')">普通用户</van-button>
        <van-button plain size="small" @click="quickLogin('expert')">专家账号</van-button>
        <van-button plain size="small" @click="quickLogin('admin')">管理员</van-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  padding: var(--space-xl) var(--space-md);
  background-color: var(--background-color);
  display: flex;
  flex-direction: column;
}

.login-header {
  text-align: center;
  margin-bottom: var(--space-xl);
  padding-top: var(--space-xl);
}

.login-logo {
  width: 80px;
  height: 80px;
  margin-bottom: var(--space-md);
}

.login-title {
  font-size: var(--font-size-xl);
  color: var(--title-color);
  margin-bottom: var(--space-sm);
}

.login-subtitle {
  font-size: var(--font-size-md);
  color: var(--text-color-secondary);
}

.login-form {
  margin-bottom: var(--space-xl);
}

.login-actions {
  margin: var(--space-xl) var(--space-sm);
}

.register-link {
  margin-top: var(--space-md);
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
}

.register-link a {
  color: var(--primary-color);
  text-decoration: none;
  margin-left: var(--space-xs);
}

.quick-login {
  margin-top: auto;
  text-align: center;
  padding: var(--space-md);
}

.quick-login-title {
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
  margin-bottom: var(--space-sm);
}

.quick-login-options {
  display: flex;
  justify-content: center;
  gap: var(--space-md);
}
</style>
