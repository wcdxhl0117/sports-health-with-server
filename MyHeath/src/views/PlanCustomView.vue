<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 表单数据
const formData = ref({
  age: '',
  gender: '',
  height: '',
  weight: '',
  injuryType: '',
  injuryLevel: '',
  trainingDays: [],
  goal: '',
})

// 弹窗显示控制
const showInjuryTypePicker = ref(false)
const showInjuryLevelPicker = ref(false)
const showGoalPicker = ref(false)

// 受伤类型选项
const injuryTypeOptions = [
  { text: '膝关节损伤', value: 'knee' },
  { text: '腰部劳损', value: 'back' },
  { text: '踝关节扭伤', value: 'ankle' },
  { text: '肩周炎', value: 'shoulder' },
  { text: '其他', value: 'other' },
]

// 受伤程度选项
const injuryLevelOptions = [
  { text: '轻微', value: 'mild' },
  { text: '中度', value: 'moderate' },
  { text: '严重', value: 'severe' },
]

// 训练日选项
const dayOptions = [
  { text: '周一', value: 'monday' },
  { text: '周二', value: 'tuesday' },
  { text: '周三', value: 'wednesday' },
  { text: '周四', value: 'thursday' },
  { text: '周五', value: 'friday' },
  { text: '周六', value: 'saturday' },
  { text: '周日', value: 'sunday' },
]

// 训练目标选项
const goalOptions = [
  { text: '缓解疼痛', value: 'pain_relief' },
  { text: '恢复功能', value: 'functional_recovery' },
  { text: '增强肌力', value: 'strength' },
  { text: '提高灵活性', value: 'flexibility' },
]

// 选择受伤类型
const selectInjuryType = (value) => {
  formData.value.injuryType = value.value
  showInjuryTypePicker.value = false
}

// 选择受伤程度
const selectInjuryLevel = (value) => {
  formData.value.injuryLevel = value.value
  showInjuryLevelPicker.value = false
}

// 选择训练目标
const selectGoal = (value) => {
  formData.value.goal = value.value
  showGoalPicker.value = false
}

// 生成训练计划
const generatePlan = () => {
  // 基本表单验证
  if (
    !formData.value.age ||
    !formData.value.gender ||
    !formData.value.injuryType ||
    !formData.value.injuryLevel ||
    formData.value.trainingDays.length === 0
  ) {
    // 使用Vant Toast显示错误提示
    // 或者可以在表单中显示错误信息
    return
  }

  // 存储表单数据，实际项目中这里会发送到后端API
  localStorage.setItem('customPlanData', JSON.stringify(formData.value))

  // 跳转到结果页面
  router.push('/plan-result')
}
</script>

<template>
  <div class="plan-custom-container">
    <van-nav-bar title="定制训练方案" left-arrow @click-left="router.go(-1)" />

    <div class="form-container">
      <van-form @submit="generatePlan">
        <div class="form-section">
          <div class="section-title">基本信息</div>

          <van-field
            v-model="formData.age"
            name="age"
            label="年龄"
            type="number"
            placeholder="请输入您的年龄"
            :rules="[{ required: true, message: '请填写年龄' }]"
          />

          <van-field name="gender" label="性别">
            <template #input>
              <van-radio-group v-model="formData.gender" direction="horizontal">
                <van-radio name="male">男</van-radio>
                <van-radio name="female">女</van-radio>
              </van-radio-group>
            </template>
          </van-field>

          <van-field
            v-model="formData.height"
            name="height"
            label="身高(cm)"
            type="number"
            placeholder="请输入您的身高"
          />

          <van-field
            v-model="formData.weight"
            name="weight"
            label="体重(kg)"
            type="number"
            placeholder="请输入您的体重"
          />
        </div>

        <div class="form-section">
          <div class="section-title">受伤情况</div>

          <van-field
            name="injuryType"
            label="受伤类型"
            is-link
            readonly
            :value="injuryTypeOptions.find((item) => item.value === formData.injuryType)?.text"
            placeholder="请选择受伤类型"
            @click="showInjuryTypePicker = true"
          />

          <van-popup
            :show="showInjuryTypePicker"
            @update:show="showInjuryTypePicker = $event"
            position="bottom"
          >
            <van-picker
              :columns="injuryTypeOptions"
              @confirm="selectInjuryType"
              @cancel="showInjuryTypePicker = false"
            />
          </van-popup>

          <van-field
            name="injuryLevel"
            label="受伤程度"
            is-link
            readonly
            :value="injuryLevelOptions.find((item) => item.value === formData.injuryLevel)?.text"
            placeholder="请选择受伤程度"
            @click="showInjuryLevelPicker = true"
          />

          <van-popup
            :show="showInjuryLevelPicker"
            @update:show="showInjuryLevelPicker = $event"
            position="bottom"
          >
            <van-picker
              :columns="injuryLevelOptions"
              @confirm="selectInjuryLevel"
              @cancel="showInjuryLevelPicker = false"
            />
          </van-popup>
        </div>

        <div class="form-section">
          <div class="section-title">训练偏好</div>

          <van-field name="trainingDays" label="训练日">
            <template #input>
              <van-checkbox-group v-model="formData.trainingDays" direction="horizontal">
                <van-checkbox
                  v-for="day in dayOptions"
                  :key="day.value"
                  :name="day.value"
                  shape="square"
                >
                  {{ day.text }}
                </van-checkbox>
              </van-checkbox-group>
            </template>
          </van-field>

          <van-field
            name="goal"
            label="训练目标"
            is-link
            readonly
            :value="goalOptions.find((item) => item.value === formData.goal)?.text"
            placeholder="请选择训练目标"
            @click="showGoalPicker = true"
          />

          <van-popup
            :show="showGoalPicker"
            @update:show="showGoalPicker = $event"
            position="bottom"
          >
            <van-picker
              :columns="goalOptions"
              @confirm="selectGoal"
              @cancel="showGoalPicker = false"
            />
          </van-popup>
        </div>

        <div class="submit-btn">
          <van-button type="primary" block size="large" native-type="submit">
            生成训练方案
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<style scoped>
.plan-custom-container {
  min-height: 100vh;
  background-color: var(--background-color);
}

.form-container {
  padding: var(--space-md);
}

.form-section {
  margin-bottom: var(--space-lg);
  background-color: #fff;
  border-radius: var(--radius-md);
  padding: var(--space-md);
}

.section-title {
  font-size: var(--font-size-md);
  font-weight: 500;
  color: var(--title-color);
  margin-bottom: var(--space-md);
  border-left: 3px solid var(--primary-color);
  padding-left: var(--space-sm);
}

:deep(.van-checkbox-group) {
  display: flex;
  flex-wrap: wrap;
}

:deep(.van-checkbox) {
  margin-right: var(--space-sm);
  margin-bottom: var(--space-sm);
}

.submit-btn {
  margin-top: var(--space-xl);
  margin-bottom: var(--space-xl);
}
</style>
