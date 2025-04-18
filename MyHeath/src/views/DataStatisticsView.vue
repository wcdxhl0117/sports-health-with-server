<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 训练统计数据（模拟数据）
const statistics = ref({
  totalTrainingDays: 15,
  currentStreak: 5,
  completionRate: 88,
  totalExercises: 187,
  totalDuration: 450, // 分钟
  weeklyData: [
    { date: '5/15', count: 3, duration: 45 },
    { date: '5/16', count: 0, duration: 0 },
    { date: '5/17', count: 4, duration: 60 },
    { date: '5/18', count: 0, duration: 0 },
    { date: '5/19', count: 3, duration: 30 },
    { date: '5/20', count: 2, duration: 25 },
    { date: '5/21', count: 3, duration: 40 },
  ],
  monthlyTrend: [65, 70, 75, 72, 80, 85, 88, 90],
})

// 身体数据记录（模拟数据）
const bodyData = ref([
  { date: '5/15', weight: 75.5, bmi: 24.8, bodyFat: 22.5 },
  { date: '5/18', weight: 75.2, bmi: 24.7, bodyFat: 22.3 },
  { date: '5/21', weight: 74.8, bmi: 24.5, bodyFat: 22.0 },
])

// 恢复进度评估（模拟数据）
const recoveryProgress = ref({
  painLevel: 3, // 1-10
  mobilityLevel: 7, // 1-10
  strengthLevel: 6, // 1-10
  overallProgress: 70, // 百分比
})

// 初始化
onMounted(() => {
  // 实际项目中可能需要从API获取数据
  console.log('Statistics view mounted')
})
</script>

<template>
  <div class="statistics-container">
    <van-nav-bar title="数据统计" left-arrow @click-left="router.go(-1)" />

    <!-- 总体统计卡片 -->
    <div class="statistics-card card">
      <h3 class="section-title">训练总览</h3>

      <div class="statistics-grid">
        <div class="stat-item">
          <div class="stat-value">{{ statistics.totalTrainingDays }}</div>
          <div class="stat-label">训练天数</div>
        </div>

        <div class="stat-item">
          <div class="stat-value">{{ statistics.currentStreak }}</div>
          <div class="stat-label">连续训练</div>
        </div>

        <div class="stat-item">
          <div class="stat-value">{{ statistics.completionRate }}%</div>
          <div class="stat-label">完成率</div>
        </div>

        <div class="stat-item">
          <div class="stat-value">{{ statistics.totalExercises }}</div>
          <div class="stat-label">总动作数</div>
        </div>
      </div>
    </div>

    <!-- 每周训练情况 -->
    <div class="weekly-stats card">
      <div class="flex-between">
        <h3 class="section-title">每周训练情况</h3>
        <van-dropdown-menu>
          <van-dropdown-item title="本周" />
        </van-dropdown-menu>
      </div>

      <!-- 图表区域 - 实际项目中可使用ECharts -->
      <div class="chart-container">
        <div class="placeholder-chart">
          <div
            v-for="(item, index) in statistics.weeklyData"
            :key="index"
            class="chart-bar"
            :style="{ height: item.count * 20 + 'px' }"
          ></div>
        </div>

        <div class="chart-labels">
          <div v-for="(item, index) in statistics.weeklyData" :key="index" class="chart-label">
            {{ item.date }}
          </div>
        </div>
      </div>

      <div class="week-summary">
        <div class="summary-item">
          <div class="summary-label">总训练次数</div>
          <div class="summary-value">
            {{ statistics.weeklyData.reduce((sum, item) => sum + item.count, 0) }}
          </div>
        </div>

        <div class="summary-item">
          <div class="summary-label">总训练时长</div>
          <div class="summary-value">
            {{ statistics.weeklyData.reduce((sum, item) => sum + item.duration, 0) }}分钟
          </div>
        </div>
      </div>
    </div>

    <!-- 恢复进度评估 -->
    <div class="recovery-progress card">
      <h3 class="section-title">恢复进度评估</h3>

      <div class="progress-section">
        <div class="progress-item">
          <div class="progress-label">疼痛程度</div>
          <van-rate
            :model-value="recoveryProgress.painLevel"
            readonly
            count="10"
            size="14"
            color="#ee0a24"
          />
          <div class="progress-note">较低分数表示疼痛减轻</div>
        </div>

        <div class="progress-item">
          <div class="progress-label">活动能力</div>
          <van-rate :model-value="recoveryProgress.mobilityLevel" readonly count="10" size="14" />
        </div>

        <div class="progress-item">
          <div class="progress-label">肌肉力量</div>
          <van-rate :model-value="recoveryProgress.strengthLevel" readonly count="10" size="14" />
        </div>

        <div class="overall-progress">
          <div class="progress-label">整体恢复进度</div>
          <van-progress :percentage="recoveryProgress.overallProgress" stroke-width="10" />
        </div>
      </div>
    </div>

    <!-- 身体数据记录 -->
    <div class="body-data card">
      <h3 class="section-title">身体数据记录</h3>

      <van-empty v-if="bodyData.length === 0" description="暂无数据记录" />

      <template v-else>
        <div class="body-data-header">
          <div class="header-item date">日期</div>
          <div class="header-item">体重(kg)</div>
          <div class="header-item">BMI</div>
          <div class="header-item">体脂率(%)</div>
        </div>

        <div v-for="(item, index) in bodyData" :key="index" class="body-data-row">
          <div class="data-item date">{{ item.date }}</div>
          <div class="data-item">{{ item.weight }}</div>
          <div class="data-item">{{ item.bmi }}</div>
          <div class="data-item">{{ item.bodyFat }}%</div>
        </div>

        <div class="add-record">
          <van-button plain type="primary" size="small" icon="plus">添加记录</van-button>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.statistics-container {
  min-height: 100vh;
  background-color: var(--background-color);
  padding-bottom: var(--space-xl);
}

.section-title {
  font-size: var(--font-size-md);
  font-weight: 500;
  color: var(--title-color);
  margin-bottom: var(--space-md);
}

.statistics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-lg);
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  color: var(--primary-color);
}

.stat-label {
  font-size: var(--font-size-xs);
  color: var(--text-color-secondary);
  margin-top: var(--space-xs);
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  margin: var(--space-lg) 0;
  height: 200px;
}

.placeholder-chart {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 160px;
  background-color: rgba(25, 137, 250, 0.05);
  border-radius: var(--radius-sm);
  padding: 0 var(--space-sm);
}

.chart-bar {
  width: 30px;
  background-color: var(--primary-color);
  border-radius: var(--radius-sm);
  transition: height 0.3s;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  margin-top: var(--space-xs);
}

.chart-label {
  width: 30px;
  text-align: center;
  font-size: var(--font-size-xs);
  color: var(--text-color-secondary);
}

.week-summary {
  display: flex;
  justify-content: space-around;
  margin-top: var(--space-lg);
}

.summary-item {
  text-align: center;
}

.summary-label {
  font-size: var(--font-size-xs);
  color: var(--text-color-secondary);
  margin-bottom: var(--space-xs);
}

.summary-value {
  font-size: var(--font-size-lg);
  font-weight: 500;
  color: var(--title-color);
}

.progress-section {
  margin-top: var(--space-md);
}

.progress-item {
  margin-bottom: var(--space-md);
}

.progress-label {
  font-size: var(--font-size-sm);
  color: var(--text-color);
  margin-bottom: var(--space-xs);
}

.progress-note {
  font-size: var(--font-size-xs);
  color: var(--text-color-secondary);
  margin-top: var(--space-xs);
}

.overall-progress {
  margin-top: var(--space-lg);
}

.body-data-header {
  display: flex;
  padding: var(--space-sm) 0;
  border-bottom: 1px solid var(--divider-color);
  font-weight: 500;
  color: var(--title-color);
}

.body-data-row {
  display: flex;
  padding: var(--space-md) 0;
  border-bottom: 1px solid var(--divider-color);
}

.header-item,
.data-item {
  flex: 1;
  text-align: center;
  font-size: var(--font-size-sm);
}

.header-item.date,
.data-item.date {
  flex: 0.8;
  text-align: left;
}

.add-record {
  margin-top: var(--space-md);
  text-align: center;
}
</style>
