<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { trainingAPI } from '@/services/api'

const router = useRouter()
const route = useRoute()

// 状态变量
const loading = ref(true)
const errorMsg = ref('')

// 训练动作数据
const exercise = ref({})

// 获取训练动作详情
const fetchExerciseDetail = async () => {
  try {
    loading.value = true
    errorMsg.value = ''

    console.log('获取训练动作详情，ID:', route.params.id)

    const data = await trainingAPI.getExerciseById(route.params.id)
    console.log('获取到的训练动作数据:', data)
    exercise.value = data || {}

    loading.value = false
  } catch (error) {
    console.error('获取训练动作详情失败:', error)
    errorMsg.value = '获取训练动作详情失败，请重试'
    loading.value = false
  }
}

// 返回到训练页面
const goBackToTraining = () => {
  router.push('/training')
}

// 格式化目标区域
const formatTargetArea = (targetArea) => {
  if (Array.isArray(targetArea)) {
    return targetArea.join(', ')
  }
  return targetArea || '未指定'
}

// 初始化
onMounted(() => {
  fetchExerciseDetail()
})
</script>

<template>
  <div class="exercise-detail-container">
    <van-nav-bar title="动作详情" left-arrow @click-left="router.go(-1)" />

    <!-- 加载状态 -->
    <van-loading v-if="loading" class="loading-indicator" type="spinner" color="#1989fa" />

    <!-- 错误消息 -->
    <van-empty v-else-if="errorMsg" description="数据加载失败" image="error">
      <template #description>
        <p>{{ errorMsg }}</p>
        <van-button type="primary" size="small" @click="fetchExerciseDetail">重试</van-button>
      </template>
    </van-empty>

    <template v-else-if="exercise.id">
      <div class="exercise-content">
        <!-- 训练动作图片/视频 -->
        <div class="exercise-media">
          <img
            :src="
              exercise.coverImage ||
              exercise.imageUrl ||
              'https://placehold.co/600x400?text=训练动作'
            "
            :alt="exercise.name"
            class="exercise-image"
          />
          <div
            v-if="exercise.videoUrl && exercise.videoUrl !== '#'"
            class="video-overlay"
            @click="() => window.open(exercise.videoUrl, '_blank')"
          >
            <van-icon name="play-circle-o" size="48" color="#fff" />
          </div>
        </div>

        <!-- 训练动作信息 -->
        <div class="exercise-info card">
          <h2 class="exercise-name">{{ exercise.name }}</h2>

          <div class="exercise-tags">
            <van-tag plain type="primary" class="tag">{{
              formatTargetArea(exercise.targetArea)
            }}</van-tag>
            <van-tag v-if="exercise.difficulty" plain type="success" class="tag">
              {{
                exercise.difficulty === 'beginner' || exercise.difficulty === '初级'
                  ? '初级'
                  : exercise.difficulty === 'intermediate' || exercise.difficulty === '中等'
                    ? '中级'
                    : exercise.difficulty === 'advanced' || exercise.difficulty === '高级'
                      ? '高级'
                      : exercise.difficulty
              }}
            </van-tag>
            <van-tag v-if="exercise.equipment" plain type="warning" class="tag">{{
              exercise.equipment
            }}</van-tag>
          </div>

          <div class="exercise-description">
            <h3>动作说明</h3>
            <p>{{ exercise.description }}</p>
          </div>

          <div v-if="exercise.steps && exercise.steps.length" class="exercise-steps">
            <h3>动作步骤</h3>
            <ol>
              <li v-for="(step, index) in exercise.steps" :key="index">{{ step }}</li>
            </ol>
          </div>

          <div class="exercise-tips">
            <h3>注意事项</h3>
            <p>{{ exercise.tips }}</p>
          </div>

          <div v-if="exercise.calories || exercise.duration" class="exercise-metrics">
            <div v-if="exercise.calories" class="metric-item">
              <div class="metric-icon"><van-icon name="fire-o" /></div>
              <div class="metric-value">{{ exercise.calories }} 卡路里/分钟</div>
            </div>
            <div v-if="exercise.duration" class="metric-item">
              <div class="metric-icon"><van-icon name="clock-o" /></div>
              <div class="metric-value">建议时长 {{ exercise.duration }} 秒</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="bottom-buttons">
        <van-button type="primary" block @click="goBackToTraining">返回训练页面</van-button>
      </div>
    </template>

    <van-empty v-else description="没有找到训练动作" />
  </div>
</template>

<style scoped>
.exercise-detail-container {
  min-height: 100vh;
  background-color: var(--background-color);
  padding-bottom: var(--space-xl);
}

.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
}

.exercise-content {
  padding: var(--space-md);
}

.exercise-media {
  position: relative;
  margin-bottom: var(--space-md);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.exercise-image {
  width: 100%;
  height: auto;
  display: block;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.exercise-info {
  padding: var(--space-lg);
  margin-bottom: var(--space-lg);
  background-color: var(--white);
  border-radius: var(--radius-md);
}

.exercise-name {
  font-size: var(--font-size-xl);
  margin-bottom: var(--space-md);
  color: var(--title-color);
}

.exercise-tags {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: var(--space-lg);
}

.tag {
  margin-right: var(--space-sm);
  margin-bottom: var(--space-sm);
}

.exercise-description,
.exercise-steps,
.exercise-tips,
.exercise-metrics {
  margin-bottom: var(--space-lg);
}

.exercise-description h3,
.exercise-steps h3,
.exercise-tips h3 {
  font-size: var(--font-size-md);
  margin-bottom: var(--space-sm);
  color: var(--title-color);
}

.exercise-description p,
.exercise-tips p {
  line-height: 1.6;
  color: var(--text-color);
}

.exercise-steps ol {
  padding-left: var(--space-lg);
}

.exercise-steps li {
  margin-bottom: var(--space-sm);
  line-height: 1.6;
}

.exercise-metrics {
  margin-top: var(--space-lg);
  border-top: 1px solid var(--divider-color);
  padding-top: var(--space-md);
}

.metric-item {
  display: flex;
  align-items: center;
  margin-bottom: var(--space-sm);
}

.metric-icon {
  margin-right: var(--space-sm);
  color: var(--primary-color);
}

.metric-value {
  color: var(--text-color);
}

.bottom-buttons {
  padding: var(--space-md);
  position: sticky;
  bottom: 0;
  background-color: var(--background-color);
}

.card {
  border-radius: var(--radius-md);
  background-color: var(--white);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
</style>
