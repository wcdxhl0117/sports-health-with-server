<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 表单数据
const planData = ref(null)

// 训练计划（模拟数据）
const trainingPlan = ref({
  weeklyPlans: [
    {
      day: '周一',
      exercises: [
        { id: 1, name: '床上抬腿', sets: 3, reps: 12, videoUrl: '#' },
        { id: 2, name: '坐姿膝关节屈伸', sets: 3, reps: 15, videoUrl: '#' },
      ],
    },
    {
      day: '周三',
      exercises: [
        { id: 3, name: '踝泵运动', sets: 4, reps: 15, videoUrl: '#' },
        { id: 4, name: '弹力带阻力训练', sets: 3, reps: 10, videoUrl: '#' },
      ],
    },
    {
      day: '周五',
      exercises: [
        { id: 5, name: '站立髋外展', sets: 3, reps: 15, videoUrl: '#' },
        { id: 6, name: '平衡板训练', sets: 2, reps: 30, videoUrl: '#' },
      ],
    },
  ],
  duration: 8, // 周
  difficulty: '中等',
  notes: '请根据自身情况调整训练强度，如有不适请立即停止并咨询专业医师。',
})

// 加载表单数据
onMounted(() => {
  const savedData = localStorage.getItem('customPlanData')
  if (savedData) {
    planData.value = JSON.parse(savedData)
  }
})

// 开始训练
const startTraining = () => {
  // 保存训练计划
  localStorage.setItem('activeTrainingPlan', JSON.stringify(trainingPlan.value))

  // 跳转到训练页面
  router.push('/training')
}

// 查看训练详情
const viewExerciseDetail = (exercise) => {
  // 实际项目中可能跳转到详情页或显示详情弹窗
  console.log('View exercise detail', exercise)
}
</script>

<template>
  <div class="plan-result-container">
    <van-nav-bar title="训练方案" left-arrow @click-left="router.go(-1)" />

    <div class="header-card card">
      <h2 class="plan-title">您的专属康复训练方案</h2>
      <div class="plan-subtitle">
        基于您的{{ planData?.injuryType === 'knee' ? '膝关节损伤' : '受伤情况' }}定制，为期{{
          trainingPlan.duration
        }}周
      </div>
    </div>

    <div class="plan-overview card">
      <div class="overview-item">
        <div class="item-label">训练频率</div>
        <div class="item-value">每周{{ trainingPlan.weeklyPlans.length }}天</div>
      </div>

      <div class="overview-item">
        <div class="item-label">训练难度</div>
        <div class="item-value">{{ trainingPlan.difficulty }}</div>
      </div>

      <div class="overview-item">
        <div class="item-label">预计时长</div>
        <div class="item-value">每次20-30分钟</div>
      </div>
    </div>

    <div class="weekly-plan card">
      <h3 class="section-title">每周训练内容</h3>

      <div v-for="(dayPlan, index) in trainingPlan.weeklyPlans" :key="index" class="day-plan">
        <div class="day-header">{{ dayPlan.day }}</div>

        <div
          v-for="exercise in dayPlan.exercises"
          :key="exercise.id"
          class="exercise-item"
          @click="viewExerciseDetail(exercise)"
        >
          <div class="exercise-info">
            <div class="exercise-name">{{ exercise.name }}</div>
            <div class="exercise-detail">{{ exercise.sets }}组 x {{ exercise.reps }}次</div>
          </div>
          <van-icon name="play-circle-o" class="play-icon" />
        </div>
      </div>
    </div>

    <div class="notes card">
      <h3 class="section-title">注意事项</h3>
      <p>{{ trainingPlan.notes }}</p>
    </div>

    <div class="action-buttons">
      <van-button type="primary" block size="large" @click="startTraining">
        开始我的训练计划
      </van-button>

      <van-button
        plain
        type="primary"
        block
        size="large"
        class="mt-md"
        @click="router.push('/plan-custom')"
      >
        重新定制方案
      </van-button>
    </div>
  </div>
</template>

<style scoped>
.plan-result-container {
  min-height: 100vh;
  background-color: var(--background-color);
  padding-bottom: var(--space-xl);
}

.header-card {
  text-align: center;
  padding: var(--space-xl) var(--space-lg);
}

.plan-title {
  font-size: var(--font-size-xl);
  color: var(--title-color);
  margin-bottom: var(--space-sm);
}

.plan-subtitle {
  color: var(--text-color-secondary);
  font-size: var(--font-size-sm);
}

.plan-overview {
  display: flex;
  justify-content: space-between;
  padding: var(--space-lg);
}

.overview-item {
  text-align: center;
  flex: 1;
}

.item-label {
  font-size: var(--font-size-xs);
  color: var(--text-color-secondary);
  margin-bottom: var(--space-xs);
}

.item-value {
  font-size: var(--font-size-lg);
  font-weight: 500;
  color: var(--title-color);
}

.section-title {
  font-size: var(--font-size-md);
  font-weight: 500;
  color: var(--title-color);
  margin-bottom: var(--space-md);
}

.day-plan {
  margin-bottom: var(--space-md);
}

.day-header {
  font-weight: 500;
  color: var(--primary-color);
  margin-bottom: var(--space-sm);
}

.exercise-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-sm) 0;
  border-bottom: 1px solid var(--divider-color);
}

.exercise-item:last-child {
  border-bottom: none;
}

.exercise-name {
  font-size: var(--font-size-md);
  margin-bottom: var(--space-xs);
}

.exercise-detail {
  font-size: var(--font-size-xs);
  color: var(--text-color-secondary);
}

.play-icon {
  font-size: 24px;
  color: var(--primary-color);
}

.action-buttons {
  padding: var(--space-xl) var(--space-lg);
}

.mt-md {
  margin-top: var(--space-md);
}
</style>
