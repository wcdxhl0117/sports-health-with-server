<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { trainingAPI } from '@/services/api'

const router = useRouter()

// 状态变量
const trainingPlans = ref([])
const popularExercises = ref([])
const loading = ref(true)
const tabActive = ref(0)
const errorMsg = ref('')

// 获取训练计划数据
const fetchTrainingData = async () => {
  try {
    loading.value = true
    errorMsg.value = ''

    console.log('开始获取训练数据...')

    // 分开获取数据，避免一个请求失败影响所有数据
    try {
      const plansRes = await trainingAPI.getAllTrainingPlans()
      console.log('训练计划数据:', plansRes)
      trainingPlans.value = plansRes || []
    } catch (plansError) {
      console.error('获取训练计划数据失败:', plansError)
      trainingPlans.value = []
    }

    try {
      // 改用getAllExercises获取全部训练动作，然后在前端进行筛选
      const allExercises = await trainingAPI.getAllExercises()
      console.log('所有训练动作数据:', allExercises)

      // 随机选择6个训练动作作为热门训练
      if (allExercises && allExercises.length > 0) {
        const shuffled = [...allExercises].sort(() => 0.5 - Math.random())
        popularExercises.value = shuffled.slice(0, 6)
      } else {
        popularExercises.value = []
      }
    } catch (exercisesError) {
      console.error('获取训练动作数据失败:', exercisesError)
      popularExercises.value = []
    }

    loading.value = false
  } catch (error) {
    console.error('获取训练数据失败:', error)
    errorMsg.value = '获取训练数据失败，请重试'
    loading.value = false

    // 默认初始化空数组，防止页面出错
    trainingPlans.value = []
    popularExercises.value = []
  }
}

// 跳转到训练详情页
const goToTrainingDetail = (planId) => {
  router.push(`/training-detail/${planId}`)
}

// 跳转到训练动作详情
const goToExerciseDetail = (exerciseId) => {
  router.push(`/exercise-detail/${exerciseId}`)
}

// 初始化
onMounted(() => {
  fetchTrainingData()
})
</script>

<template>
  <div class="training-container">
    <van-nav-bar title="训练" />

    <van-tabs v-model="tabActive" sticky swipeable animated>
      <van-tab title="训练计划">
        <div class="tab-content">
          <!-- 加载状态 -->
          <van-loading v-if="loading" class="loading-indicator" type="spinner" color="#1989fa" />

          <!-- 错误消息 -->
          <van-empty v-else-if="errorMsg" description="数据加载失败" image="error">
            <template #description>
              <p>{{ errorMsg }}</p>
              <van-button type="primary" size="small" @click="fetchTrainingData">重试</van-button>
            </template>
          </van-empty>

          <template v-else>
            <!-- 我的训练计划 -->
            <section class="section-container">
              <div class="section-header">
                <h2 class="section-title">我的训练计划</h2>
                <van-button class="section-more" size="small" type="primary" plain
                  >查看全部</van-button
                >
              </div>

              <div class="plans-grid">
                <van-empty v-if="!trainingPlans.length" description="暂无训练计划" />

                <div
                  v-for="plan in trainingPlans"
                  :key="plan.id"
                  class="plan-card card"
                  @click="goToTrainingDetail(plan.id)"
                >
                  <div class="plan-card-content">
                    <h3 class="plan-title">{{ plan.title }}</h3>
                    <div class="plan-meta" v-if="plan.exercises">
                      <span>{{ plan.exercises.length }} 个动作</span>
                      <span>{{ plan.duration || '20' }} 分钟</span>
                    </div>
                    <div class="plan-meta" v-else>
                      <span>{{ plan.weeklyPlans ? plan.weeklyPlans.length : 0 }} 个训练日</span>
                      <span>{{ plan.duration || '20' }} 分钟</span>
                    </div>
                    <p class="plan-description">{{ plan.description || plan.notes }}</p>
                    <van-tag v-if="plan.targetArea" plain type="primary">{{
                      plan.targetArea
                    }}</van-tag>
                    <van-tag v-if="plan.difficulty || plan.level" plain type="success">{{
                      plan.difficulty ||
                      (plan.level === 'beginner'
                        ? '初级'
                        : plan.level === 'intermediate'
                          ? '中级'
                          : plan.level === 'advanced'
                            ? '高级'
                            : plan.level)
                    }}</van-tag>
                  </div>
                  <div class="plan-card-image">
                    <img
                      :src="plan.coverImg || 'https://placehold.co/200x200?text=训练'"
                      :alt="plan.title"
                    />
                  </div>
                </div>
              </div>
            </section>
          </template>
        </div>
      </van-tab>

      <van-tab title="训练动作库">
        <div class="tab-content">
          <!-- 加载状态 -->
          <van-loading v-if="loading" class="loading-indicator" type="spinner" color="#1989fa" />

          <!-- 错误消息 -->
          <van-empty v-else-if="errorMsg" description="数据加载失败" image="error">
            <template #description>
              <p>{{ errorMsg }}</p>
              <van-button type="primary" size="small" @click="fetchTrainingData">重试</van-button>
            </template>
          </van-empty>

          <template v-else>
            <!-- 热门训练动作 -->
            <section class="section-container">
              <div class="section-header">
                <h2 class="section-title">热门训练动作</h2>
              </div>

              <div class="exercises-grid">
                <van-empty v-if="!popularExercises.length" description="暂无训练动作" />

                <div
                  v-for="exercise in popularExercises"
                  :key="exercise.id"
                  class="exercise-card card"
                  @click="goToExerciseDetail(exercise.id)"
                >
                  <div class="exercise-image">
                    <img
                      :src="
                        exercise.coverImg ||
                        exercise.coverImage ||
                        exercise.imageUrl ||
                        'https://placehold.co/200x200?text=动作'
                      "
                      :alt="exercise.name"
                    />
                  </div>
                  <div class="exercise-info">
                    <h3 class="exercise-name">{{ exercise.name }}</h3>
                    <p class="exercise-target">
                      {{
                        Array.isArray(exercise.targetArea)
                          ? exercise.targetArea.join(', ')
                          : exercise.targetArea
                      }}
                    </p>
                    <div class="exercise-tags">
                      <van-tag v-if="exercise.difficulty" plain type="primary">{{
                        exercise.difficulty === 'beginner' || exercise.difficulty === '初级'
                          ? '初级'
                          : exercise.difficulty === 'intermediate' || exercise.difficulty === '中等'
                            ? '中级'
                            : exercise.difficulty === 'advanced' || exercise.difficulty === '高级'
                              ? '高级'
                              : exercise.difficulty
                      }}</van-tag>
                      <van-tag v-if="exercise.equipment" plain type="success">{{
                        exercise.equipment
                      }}</van-tag>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- 按部位分类 -->
            <section class="section-container">
              <div class="section-header">
                <h2 class="section-title">按部位分类</h2>
              </div>

              <div class="category-grid">
                <div class="category-card" @click="router.push('/exercises/category/腿部')">
                  <div class="category-icon">🦵</div>
                  <div class="category-name">腿部</div>
                </div>
                <div class="category-card" @click="router.push('/exercises/category/胸部')">
                  <div class="category-icon">💪</div>
                  <div class="category-name">胸部</div>
                </div>
                <div class="category-card" @click="router.push('/exercises/category/背部')">
                  <div class="category-icon">🔙</div>
                  <div class="category-name">背部</div>
                </div>
                <div class="category-card" @click="router.push('/exercises/category/肩部')">
                  <div class="category-icon">🏋️</div>
                  <div class="category-name">肩部</div>
                </div>
                <div class="category-card" @click="router.push('/exercises/category/手臂')">
                  <div class="category-icon">💪</div>
                  <div class="category-name">手臂</div>
                </div>
                <div class="category-card" @click="router.push('/exercises/category/核心')">
                  <div class="category-icon">🧘</div>
                  <div class="category-name">核心</div>
                </div>
              </div>
            </section>
          </template>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<style scoped>
.training-container {
  min-height: 100vh;
  background-color: var(--background-color);
  padding-bottom: var(--space-xl);
}

.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40vh;
}

.tab-content {
  padding: var(--space-md);
}

.section-container {
  margin-bottom: var(--space-xl);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: 500;
}

.section-more {
  padding: var(--space-xs) var(--space-sm);
}

.plans-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
}

.plan-card {
  width: calc(50% - var(--space-md) / 2);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--space-md);
  border-radius: var(--border-radius);
  background-color: var(--card-background-color);
  transition: transform 0.2s;
}

.plan-card:hover {
  transform: translateY(-5px);
}

.plan-card-content {
  flex: 1;
}

.plan-title {
  font-size: var(--font-size-md);
  font-weight: 500;
  margin-bottom: var(--space-sm);
}

.plan-meta {
  font-size: var(--font-size-xs);
  color: var(--text-color-secondary);
  margin-bottom: var(--space-sm);
}

.plan-description {
  font-size: var(--font-size-sm);
  color: var(--text-color);
}

.plan-card-image {
  width: 100%;
  height: 200px;
  border-radius: var(--border-radius);
  overflow: hidden;
  margin-top: var(--space-md);
}

.exercise-card {
  width: calc(50% - var(--space-md) / 2);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--space-md);
  border-radius: var(--border-radius);
  background-color: var(--card-background-color);
  transition: transform 0.2s;
}

.exercise-card:hover {
  transform: translateY(-5px);
}

.exercise-image {
  width: 100%;
  height: 200px;
  border-radius: var(--border-radius);
  overflow: hidden;
  margin-bottom: var(--space-md);
}

.exercise-info {
  flex: 1;
}

.exercise-name {
  font-size: var(--font-size-md);
  font-weight: 500;
  margin-bottom: var(--space-sm);
}

.exercise-target {
  font-size: var(--font-size-xs);
  color: var(--text-color-secondary);
}

.exercise-tags {
  margin-top: var(--space-sm);
}

.category-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
}

.category-card {
  width: calc(50% - var(--space-md) / 2);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--space-md);
  border-radius: var(--border-radius);
  background-color: var(--card-background-color);
  transition: transform 0.2s;
}

.category-card:hover {
  transform: translateY(-5px);
}

.category-icon {
  font-size: var(--font-size-2xl);
  margin-bottom: var(--space-sm);
}

.category-name {
  font-size: var(--font-size-sm);
  font-weight: 500;
}
</style>
