<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const loading = ref(false)

// 注册处理
const handleRegister = () => {
  // 基本表单验证
  if (!username.value || !password.value || !confirmPassword.value) {
    errorMessage.value = '请填写所有必填项'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = '两次输入的密码不一致'
    return
  }

  // 显示加载状态
  loading.value = true

  // 模拟注册请求
  setTimeout(() => {
    // 这里应该是实际的注册API调用
    // 模拟注册成功

    // 注册成功后自动登录
    localStorage.setItem(
      'user',
      JSON.stringify({
        username: username.value,
        isLoggedIn: true,
      }),
    )

    // 跳转到首页
    router.push('/')
  }, 1000)
}

// 返回登录页
const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="register-container">
    <van-nav-bar title="注册" left-arrow @click-left="router.go(-1)" />

    <div class="register-form">
      <h2 class="register-title">创建您的账号</h2>

      <div class="form-group">
        <van-field
          v-model="username"
          label="用户名"
          placeholder="请输入用户名"
          :error="!!errorMessage"
        />

        <van-field
          v-model="password"
          type="password"
          label="密码"
          placeholder="请输入密码"
          :error="!!errorMessage"
        />

        <van-field
          v-model="confirmPassword"
          type="password"
          label="确认密码"
          placeholder="请再次输入密码"
          :error="!!errorMessage"
        />

        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      </div>

      <div class="form-actions">
        <van-button type="primary" block size="large" @click="handleRegister" :loading="loading">
          注册
        </van-button>

        <div class="login-link">
          已有账号？<span class="text-link" @click="goToLogin">去登录</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  height: 100vh;
  background-color: var(--background-color);
}

.register-form {
  padding: var(--space-xl);
}

.register-title {
  font-size: var(--font-size-xl);
  text-align: center;
  margin-bottom: var(--space-xl);
  color: var(--title-color);
}

.form-group {
  margin-bottom: var(--space-xl);
}

.error-message {
  color: var(--error-color);
  font-size: var(--font-size-sm);
  margin-top: var(--space-md);
  text-align: center;
}

.form-actions {
  margin-top: var(--space-xl);
}

.login-link {
  text-align: center;
  margin-top: var(--space-lg);
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
}

.text-link {
  color: var(--primary-color);
  cursor: pointer;
}
</style>
