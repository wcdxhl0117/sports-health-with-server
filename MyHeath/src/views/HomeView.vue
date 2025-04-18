<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { trainingAPI, postAPI } from '../services/api'
import { showToast, showLoadingToast, closeToast } from 'vant'

const router = useRouter()

// 数据状态
const loading = ref(true)
const trainingPlans = ref([])
const recommendedExercises = ref([])
const communityPosts = ref([])

// 获取数据
const fetchData = async () => {
  try {
    const loadingToast = showLoadingToast({
      message: '加载中...',
      forbidClick: true,
    })

    // 并行请求数据
    const [plansResponse, exercisesResponse, postsResponse] = await Promise.all([
      trainingAPI.getAllTrainingPlans(),
      trainingAPI.getAllExercises(),
      postAPI.getAllPosts(),
    ])

    // 训练计划数据处理
    trainingPlans.value = plansResponse.slice(0, 2) // 取前2个

    // 推荐训练动作（随机选择6个）
    const shuffled = [...exercisesResponse].sort(() => 0.5 - Math.random())
    recommendedExercises.value = shuffled.slice(0, 6)

    // 社区帖子（按点赞数排序，取前3个）
    communityPosts.value = [...postsResponse].sort((a, b) => b.likes - a.likes).slice(0, 3)

    closeToast(loadingToast)
  } catch (error) {
    console.error('获取数据失败:', error)
    showToast({
      message: '加载数据失败，请稍后重试',
      type: 'fail',
    })
  } finally {
    loading.value = false
  }
}

// 组件挂载时获取数据
onMounted(fetchData)

// 前往训练计划详情
const goToPlanDetail = (planId) => {
  router.push(`/training-detail/${planId}`)
}

// 前往动作详情
const goToExerciseDetail = (exerciseId) => {
  router.push(`/exercise/${exerciseId}`)
}

// 前往帖子详情
const goToPostDetail = (postId) => {
  router.push(`/post-detail/${postId}`)
}
</script>

<template>
  <div class="home-container">
    <!-- 顶部搜索栏 -->
    <div class="search-bar">
      <van-search placeholder="搜索训练动作或康复知识" disabled @click="router.push('/search')" />
    </div>

    <!-- 轮播图 -->
    <van-swipe class="banner" :autoplay="3000" indicator-color="#1989fa">
      <van-swipe-item v-for="(item, index) in 3" :key="index">
        <div class="banner-item" :class="`banner-item-${index + 1}`">
          <h3 class="banner-title">
            {{
              index === 0
                ? '专业康复训练指导'
                : index === 1
                  ? '科学训练方案定制'
                  : '康复社区互动分享'
            }}
          </h3>
        </div>
      </van-swipe-item>
    </van-swipe>

    <!-- 训练计划推荐 -->
    <div class="section">
      <div class="section-header">
        <h2 class="section-title">推荐训练计划</h2>
        <router-link to="/training" class="section-more">更多</router-link>
      </div>

      <div v-if="loading" class="loading-placeholder">
        <van-skeleton title :row="3" />
      </div>

      <div v-else class="training-plan-list">
        <div
          v-for="plan in trainingPlans"
          :key="plan.id"
          class="training-plan-card"
          @click="goToPlanDetail(plan.id)"
        >
          <div class="plan-info">
            <h3 class="plan-title">{{ plan.title }}</h3>
            <div class="plan-meta">
              <van-tag type="primary" size="medium">{{ plan.difficulty }}</van-tag>
              <span class="plan-duration">{{ plan.duration }}周</span>
            </div>
            <div class="plan-days">{{ plan.weeklyPlans.length }}天/周训练</div>
          </div>
        </div>

        <!-- 自定义训练方案卡片 -->
        <div class="training-plan-card custom-plan" @click="router.push('/plan-custom')">
          <div class="plan-info">
            <h3 class="plan-title">定制专属训练方案</h3>
            <p class="plan-desc">根据您的情况，制定个性化康复训练计划</p>
            <van-button plain type="primary" size="small" class="custom-btn">立即定制</van-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 推荐训练动作 -->
    <div class="section">
      <div class="section-header">
        <h2 class="section-title">推荐训练动作</h2>
        <router-link to="/training" class="section-more">更多</router-link>
      </div>

      <div v-if="loading" class="loading-placeholder">
        <van-skeleton title :row="3" />
      </div>

      <div v-else class="exercise-grid">
        <div
          v-for="exercise in recommendedExercises"
          :key="exercise.id"
          class="exercise-card"
          @click="goToExerciseDetail(exercise.id)"
        >
          <div class="exercise-image" :style="`background-image: url(${exercise.imageUrl})`"></div>
          <div class="exercise-info">
            <h3 class="exercise-name">{{ exercise.name }}</h3>
            <span class="exercise-area">{{ exercise.targetArea }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 社区精选 -->
    <div class="section">
      <div class="section-header">
        <h2 class="section-title">社区精选</h2>
        <router-link to="/community" class="section-more">更多</router-link>
      </div>

      <div v-if="loading" class="loading-placeholder">
        <van-skeleton title :row="3" />
      </div>

      <div v-else class="community-posts">
        <div
          v-for="post in communityPosts"
          :key="post.id"
          class="post-card"
          @click="goToPostDetail(post.id)"
        >
          <div class="post-user">
            <img :src="post.user.avatar" alt="头像" class="user-avatar" />
            <div class="user-info">
              <span class="user-name">{{ post.user.name }}</span>
              <van-tag v-if="post.user.isExpert" type="success" size="small">专家</van-tag>
            </div>
          </div>

          <p class="post-content">
            {{ post.content.substring(0, 50) }}{{ post.content.length > 50 ? '...' : '' }}
          </p>

          <div class="post-footer">
            <span class="post-likes">
              <van-icon name="like-o" />
              {{ post.likes }}
            </span>
            <span class="post-date">{{ new Date(post.createdAt).toLocaleDateString() }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  background-color: var(--background-color);
  min-height: 100vh;
  padding-bottom: 50px;
}

.search-bar {
  position: sticky;
  top: 0;
  z-index: 1000;
}

.banner {
  height: 160px;
  margin-bottom: var(--space-md);
}

.banner-item {
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  padding: var(--space-md);
  background-size: cover;
  background-position: center;
  border-radius: var(--radius-md);
}

.banner-item-1 {
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5)),
    url('https://placehold.co/600x200?text=康复训练');
}

.banner-item-2 {
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5)),
    url('https://placehold.co/600x200?text=训练方案');
}

.banner-item-3 {
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5)),
    url('https://placehold.co/600x200?text=康复社区');
}

.banner-title {
  color: white;
  font-size: var(--font-size-lg);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.section {
  margin: var(--space-xl) var(--space-md);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}

.section-title {
  font-size: var(--font-size-md);
  color: var(--title-color);
  margin: 0;
  position: relative;
  padding-left: var(--space-sm);
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 2px;
  height: 80%;
  width: 3px;
  background-color: var(--primary-color);
  border-radius: var(--radius-sm);
}

.section-more {
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
  text-decoration: none;
}

.loading-placeholder {
  padding: var(--space-md);
  background-color: white;
  border-radius: var(--radius-md);
}

.training-plan-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

.training-plan-card {
  background-color: white;
  border-radius: var(--radius-md);
  padding: var(--space-md);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  min-height: 120px;
}

.plan-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.plan-title {
  font-size: var(--font-size-md);
  color: var(--title-color);
  margin: 0 0 var(--space-sm);
}

.plan-meta {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-xs);
}

.plan-duration {
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
}

.plan-days {
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
  margin-top: auto;
}

.custom-plan {
  background-color: #f5f9ff;
  border: 1px dashed var(--primary-color);
}

.plan-desc {
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
  margin: 0 0 var(--space-md);
}

.custom-btn {
  margin-top: auto;
  align-self: flex-start;
}

.exercise-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-sm);
}

.exercise-card {
  background-color: white;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.exercise-image {
  height: 80px;
  background-size: cover;
  background-position: center;
}

.exercise-info {
  padding: var(--space-xs);
}

.exercise-name {
  font-size: var(--font-size-sm);
  color: var(--title-color);
  margin: 0 0 var(--space-xs);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.exercise-area {
  font-size: var(--font-size-xs);
  color: var(--text-color-secondary);
}

.community-posts {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.post-card {
  background-color: white;
  border-radius: var(--radius-md);
  padding: var(--space-md);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.post-user {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.user-name {
  font-size: var(--font-size-sm);
  color: var(--title-color);
  font-weight: 500;
}

.post-content {
  font-size: var(--font-size-sm);
  color: var(--text-color);
  margin: 0 0 var(--space-sm);
  line-height: 1.5;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-xs);
  color: var(--text-color-secondary);
}

.post-likes {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}
</style>
