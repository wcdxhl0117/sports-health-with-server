<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { trainingAPI } from '@/services/api'

const router = useRouter()
const route = useRoute()

// 状态变量
const currentExerciseIndex = ref(0)
const showCompletionDialog = ref(false)
const loading = ref(true)
const errorMsg = ref('')

// 训练计划数据
const trainingData = ref({
  id: route.params.id,
  title: '今日训练计划',
  exercises: [],
})

// 当前练习
const currentExercise = computed(() => {
  return trainingData.value.exercises[currentExerciseIndex.value] || {}
})

// 训练进度
const progress = computed(() => {
  return {
    current: currentExerciseIndex.value + 1,
    total: trainingData.value.exercises.length,
    percent: Math.round(
      ((currentExerciseIndex.value + 1) / trainingData.value.exercises.length) * 100,
    ),
  }
})

// 下一个练习
const nextExercise = () => {
  if (currentExerciseIndex.value < trainingData.value.exercises.length - 1) {
    currentExerciseIndex.value++
  } else {
    // 所有练习完成
    showCompletionDialog.value = true
  }
}

// 上一个练习
const prevExercise = () => {
  if (currentExerciseIndex.value > 0) {
    currentExerciseIndex.value--
  }
}

// 完成训练
const completeTraining = async () => {
  try {
    // 保存训练记录到服务器
    const recordData = {
      planId: parseInt(trainingData.value.id),
      exercises: trainingData.value.exercises.map((ex) => ex.id),
      duration: 20, // 预估时间，实际应用中可以计时
      completed: true,
      notes: '',
    }

    await trainingAPI.addTrainingRecord(recordData)

    // 返回训练页面
    router.push('/training')
  } catch (error) {
    console.error('保存训练记录失败:', error)
    errorMsg.value = '保存训练记录失败，请重试'
  }
}

// 获取训练计划详情
const fetchTrainingPlan = async () => {
  try {
    loading.value = true
    errorMsg.value = ''

    console.log('获取训练计划详情，ID:', route.params.id)

    const planData = await trainingAPI.getTrainingPlanById(route.params.id)
    console.log('获取到的训练计划数据:', planData)

    // 设置基本计划信息
    trainingData.value = {
      ...planData,
      exercises: [], // 初始化exercises为空数组
    }

    // 根据计划数据类型进行处理
    if (planData.exercises && planData.exercises.length > 0) {
      // 直接包含exercises数组的情况
      if (typeof planData.exercises[0] === 'number') {
        // exercises只包含ID的情况
        const exercisePromises = planData.exercises.map((exId) => trainingAPI.getExerciseById(exId))
        const exerciseDetails = await Promise.all(exercisePromises)

        // 为每个训练动作添加组数和次数信息
        trainingData.value.exercises = exerciseDetails.map((ex) => ({
          ...ex,
          sets: 3, // 默认组数
          reps: 12, // 默认次数
          restTime: 30, // 默认休息时间(秒)
        }))
      } else {
        // exercises已经包含完整信息的情况
        trainingData.value.exercises = planData.exercises.map((ex) => ({
          ...ex,
          sets: ex.sets || 3,
          reps: ex.reps || 12,
          restTime: ex.restTime || 30,
        }))
      }
    } else if (planData.weeklyPlans && planData.weeklyPlans.length > 0) {
      // 处理weeklyPlans结构的训练计划
      // 合并所有天的训练动作到一个数组中
      const allExercises = []

      // 遍历每个训练日
      for (const dayPlan of planData.weeklyPlans) {
        if (dayPlan.exercises && dayPlan.exercises.length > 0) {
          // 将每天的训练动作添加到总数组中
          for (const exercise of dayPlan.exercises) {
            allExercises.push({
              ...exercise,
              sets: exercise.sets || 3,
              reps: exercise.reps || 12,
              restTime: exercise.restTime || 30,
              day: dayPlan.day, // 添加是哪一天的训练
            })
          }
        }
      }

      // 如果exercises包含ID，需要获取详细信息
      if (
        allExercises.length > 0 &&
        typeof allExercises[0].id === 'number' &&
        !allExercises[0].name
      ) {
        const exercisePromises = allExercises.map((ex) => trainingAPI.getExerciseById(ex.id))
        const exerciseDetails = await Promise.all(exercisePromises)

        // 将详细信息合并回原来的数组
        trainingData.value.exercises = allExercises.map((ex, index) => ({
          ...exerciseDetails[index],
          sets: ex.sets,
          reps: ex.reps,
          restTime: ex.restTime || 30,
          day: ex.day,
        }))
      } else {
        trainingData.value.exercises = allExercises
      }
    }

    console.log('处理后的训练计划数据:', trainingData.value)
    loading.value = false
  } catch (error) {
    console.error('获取训练计划失败:', error)
    errorMsg.value = '获取训练计划失败，请重试'
    loading.value = false
  }
}

// 初始化
onMounted(() => {
  fetchTrainingPlan()
})
</script>

<template>
  <div class="training-detail-container">
    <van-nav-bar :title="trainingData.title" left-arrow @click-left="router.go(-1)" />

    <!-- 加载状态 -->
    <van-loading v-if="loading" class="loading-indicator" type="spinner" color="#1989fa" />

    <!-- 错误消息 -->
    <van-empty v-else-if="errorMsg" description="数据加载失败" image="error">
      <template #description>
        <p>{{ errorMsg }}</p>
        <van-button type="primary" size="small" @click="fetchTrainingPlan">重试</van-button>
      </template>
    </van-empty>

    <template v-else>
      <!-- 进度指示器 -->
      <div class="progress-container">
        <div class="progress-text">{{ progress.current }}/{{ progress.total }}</div>
        <van-progress :percentage="progress.percent" stroke-width="4" :show-pivot="false" />
      </div>

      <div class="exercise-content">
        <!-- 练习图片/视频 -->
        <div class="exercise-media">
          <img
            :src="currentExercise.coverImg || currentExercise.imageUrl"
            :alt="currentExercise.name"
            class="exercise-image"
          />
          <div
            v-if="currentExercise.videoUrl"
            class="video-overlay"
            @click="() => window.open(currentExercise.videoUrl, '_blank')"
          >
            <van-icon name="play-circle-o" size="48" color="#fff" />
          </div>
        </div>

        <!-- 练习信息 -->
        <div class="exercise-info card">
          <h2 class="exercise-name">{{ currentExercise.name }}</h2>

          <div class="exercise-metrics">
            <div class="metric-item">
              <div class="metric-value">{{ currentExercise.sets }}</div>
              <div class="metric-label">组数</div>
            </div>

            <div class="metric-item">
              <div class="metric-value">{{ currentExercise.reps }}</div>
              <div class="metric-label">次数/组</div>
            </div>

            <div class="metric-item">
              <div class="metric-value">{{ currentExercise.restTime }}s</div>
              <div class="metric-label">休息时间</div>
            </div>
          </div>

          <div class="exercise-description">
            <h3>动作说明</h3>
            <p>{{ currentExercise.description }}</p>
          </div>

          <div v-if="currentExercise.steps && currentExercise.steps.length" class="exercise-steps">
            <h3>动作步骤</h3>
            <ol>
              <li v-for="(step, index) in currentExercise.steps" :key="index">{{ step }}</li>
            </ol>
          </div>

          <div class="exercise-tips">
            <h3>注意事项</h3>
            <p>{{ currentExercise.tips }}</p>
          </div>
        </div>
      </div>

      <!-- 导航按钮 -->
      <div class="navigation-buttons">
        <van-button
          plain
          type="primary"
          :disabled="currentExerciseIndex === 0"
          @click="prevExercise"
        >
          上一个
        </van-button>

        <van-button type="primary" @click="nextExercise">
          {{ progress.current === progress.total ? '完成训练' : '下一个' }}
        </van-button>
      </div>

      <!-- 完成训练弹窗 -->
      <van-dialog
        :show="showCompletionDialog"
        @update:show="showCompletionDialog = $event"
        title="训练完成"
        confirm-button-text="返回训练计划"
        @confirm="completeTraining"
      >
        <div class="completion-content">
          <van-icon name="success" size="48" color="var(--success-color)" />
          <p class="completion-message">恭喜您完成了今天的训练！</p>
          <div class="completion-stats">
            <div class="stat-item">
              <div class="stat-value">{{ trainingData.exercises.length }}</div>
              <div class="stat-label">训练动作</div>
            </div>

            <div class="stat-item">
              <div class="stat-value">
                {{ trainingData.exercises.reduce((sum, ex) => sum + ex.sets, 0) }}
              </div>
              <div class="stat-label">总组数</div>
            </div>

            <div class="stat-item">
              <div class="stat-value">~20<small>分钟</small></div>
              <div class="stat-label">训练时长</div>
            </div>
          </div>
        </div>
      </van-dialog>
    </template>
  </div>
</template>

<style scoped>
.training-detail-container {
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

.progress-container {
  padding: var(--space-md) var(--space-lg);
  background-color: #fff;
  margin-bottom: var(--space-md);
}

.progress-text {
  display: flex;
  justify-content: flex-end;
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
  margin-bottom: var(--space-xs);
}

.exercise-media {
  position: relative;
  margin-bottom: var(--space-md);
}

.exercise-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
}

.exercise-info {
  padding: var(--space-lg);
  margin-bottom: var(--space-md);
}

.exercise-name {
  font-size: var(--font-size-xl);
  color: var(--title-color);
  margin-bottom: var(--space-md);
}

.exercise-metrics {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-lg);
}

.metric-item {
  text-align: center;
  flex: 1;
}

.metric-value {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  color: var(--primary-color);
}

.metric-label {
  font-size: var(--font-size-xs);
  color: var(--text-color-secondary);
  margin-top: var(--space-xs);
}

.exercise-description,
.exercise-tips {
  margin-bottom: var(--space-md);
}

.exercise-description h3,
.exercise-tips h3 {
  font-size: var(--font-size-md);
  color: var(--title-color);
  margin-bottom: var(--space-sm);
}

.exercise-description p,
.exercise-tips p {
  font-size: var(--font-size-sm);
  line-height: 1.5;
  color: var(--text-color);
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  padding: var(--space-lg);
  background-color: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.navigation-buttons .van-button {
  width: 48%;
}

.completion-content {
  padding: var(--space-lg);
  text-align: center;
}

.completion-message {
  font-size: var(--font-size-lg);
  color: var(--title-color);
  margin: var(--space-md) 0;
}

.completion-stats {
  display: flex;
  justify-content: space-around;
  margin-top: var(--space-lg);
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--primary-color);
}

.stat-value small {
  font-size: var(--font-size-xs);
  font-weight: normal;
}

.stat-label {
  font-size: var(--font-size-xs);
  color: var(--text-color-secondary);
  margin-top: var(--space-xs);
}
</style>
