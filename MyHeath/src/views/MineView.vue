<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

// 用户信息
const userInfo = ref({
  id: 10001,
  name: t('key_c0rr4tgt'),
  avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
  memberType: 'premium', // premium, standard, null
  memberExpireDate: '2023-12-31',
  totalTrainingDays: 28,
  followingCount: 12,
  fansCount: 5,
})

// 功能菜单
const menuGroups = ref([
  {
    title: t('key_jr9fk8y6'),
    items: [
      { id: 1, name: t('key_ghp2vztb'), icon: 'records', path: '/my-plans' },
      { id: 2, name: t('key_utulixcv'), icon: 'clock-o', path: '/training-records' },
      { id: 3, name: t('key_wrf4g38t'), icon: 'chart-trending-o', path: '/data-statistics' },
    ],
  },
  {
    title: t('key_rkw8c4oj'),
    items: [
      { id: 4, name: t('key_mdpanq6j'), icon: 'star-o', path: '/my-collections' },
      { id: 5, name: t('key_2tfaimcp'), icon: 'notes-o', path: '/my-posts' },
      { id: 6, name: t('key_cyi29ltz'), icon: 'friends-o', path: '/following-doctors' },
    ],
  },
  {
    title: t('key_vch68t5x'),
    items: [
      { id: 7, name: t('key_m8uc8jib'), icon: 'setting-o', path: '/account-settings' },
      { id: 8, name: t('key_xlikipki'), icon: 'eye-o', path: '/privacy-settings' },
      { id: 9, name: t('key_nxc9tfjq'), icon: 'bell', path: '/notifications' },
      { id: 10, name: t('key_wgo7ep2y'), icon: 'info-o', path: '/about-us' },
    ],
  },
])

// 退出登录
const logout = () => {
  // 实际应用中需要清除token等登录信息
  router.push('/login')
}

// 编辑个人信息
const editProfile = () => {
  router.push('/edit-profile')
}

// 跳转到会员中心
const goToMemberCenter = () => {
  router.push('/member-center')
}

// 点击菜单项
const handleMenuClick = (item) => {
  router.push(item.path)
}
</script>

<template>
  <div class="mine-container">
    <!-- 用户信息区域 -->
    <div class="user-info-section">
      <div class="user-header">
        <div class="avatar-container">
          <van-image round width="80" height="80" :src="userInfo.avatar" />
          <div v-if="userInfo.memberType" class="member-badge">
            <van-icon name="gem-o" />
          </div>
        </div>

        <div class="user-details">
          <div class="username">{{ userInfo.name }}</div>
          <div v-if="userInfo.memberType" class="member-info" @click="goToMemberCenter">
            <van-tag color="var(--warning-color)" text-color="#fff">
              {{ userInfo.memberType === 'premium' ? $t('key_ebkooj0b') : $t('key_ytv6o3cb') }}
            </van-tag>
            <span class="expire-date"
              >{{ userInfo.memberExpireDate }} {{ $t('key_wqjx7y87') }}</span
            >
          </div>
        </div>

        <div class="edit-btn" @click="editProfile">
          <van-button size="small" plain icon="edit" round>{{ $t('key_lmyu5790') }}</van-button>
        </div>
      </div>

      <div class="user-stats">
        <div class="stat-item">
          <div class="stat-value">{{ userInfo.totalTrainingDays }}</div>
          <div class="stat-label">{{ $t('key_io47ueuh') }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ userInfo.followingCount }}</div>
          <div class="stat-label">{{ $t('key_iuve09rl') }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ userInfo.fansCount }}</div>
          <div class="stat-label">{{ $t('key_2j4kh8zm') }}</div>
        </div>
      </div>
    </div>

    <!-- 菜单列表 -->
    <div class="menu-section">
      <div v-for="(group, groupIndex) in menuGroups" :key="groupIndex" class="menu-group card">
        <div class="group-title">{{ group.title }}</div>

        <div class="menu-items">
          <div
            v-for="item in group.items"
            :key="item.id"
            class="menu-item"
            @click="handleMenuClick(item)"
          >
            <div class="item-left">
              <van-icon :name="item.icon" class="menu-icon" />
              <span class="menu-name">{{ item.name }}</span>
            </div>
            <van-icon name="arrow" class="arrow-icon" />
          </div>
        </div>
      </div>
    </div>

    <!-- 退出登录 -->
    <div class="logout-section">
      <van-button class="logout-btn" block @click="logout">{{ $t('logout') }}</van-button>
    </div>
  </div>
</template>

<style scoped>
.mine-container {
  min-height: 100vh;
  background-color: var(--background-color);
  padding-bottom: var(--space-5xl);
}

.user-info-section {
  background-color: var(--primary-color);
  padding: var(--space-xl) var(--space-lg);
  color: var(--white);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
}

.user-header {
  display: flex;
  align-items: center;
  margin-bottom: var(--space-lg);
}

.avatar-container {
  position: relative;
  margin-right: var(--space-md);
}

.member-badge {
  position: absolute;
  right: 0;
  bottom: 0;
  background-color: var(--warning-color);
  color: var(--white);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--white);
}

.user-details {
  flex: 1;
}

.username {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--space-xs);
}

.member-info {
  display: flex;
  align-items: center;
}

.expire-date {
  font-size: var(--font-size-xs);
  margin-left: var(--space-xs);
}

.user-stats {
  display: flex;
  justify-content: space-around;
  text-align: center;
}

.stat-item {
  flex: 1;
}

.stat-value {
  font-size: var(--font-size-xl);
  font-weight: 600;
}

.stat-label {
  font-size: var(--font-size-xs);
  opacity: 0.8;
}

.menu-section {
  padding: var(--space-lg);
}

.menu-group {
  margin-bottom: var(--space-lg);
}

.group-title {
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
  padding: var(--space-sm) var(--space-md);
  border-bottom: 1px solid var(--divider-color);
}

.menu-items {
  padding: 0 var(--space-md);
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md) 0;
  border-bottom: 1px solid var(--divider-color);
}

.menu-item:last-child {
  border-bottom: none;
}

.item-left {
  display: flex;
  align-items: center;
}

.menu-icon {
  font-size: 20px;
  color: var(--primary-color);
  margin-right: var(--space-sm);
}

.menu-name {
  font-size: var(--font-size-md);
  color: var(--text-color);
}

.arrow-icon {
  color: var(--text-color-secondary);
}

.logout-section {
  padding: 0 var(--space-lg);
  margin-top: var(--space-2xl);
}

.logout-btn {
  --van-button-default-color: var(--error-color);
  --van-button-default-background: transparent;
  --van-button-default-border-color: var(--error-color);
}
</style>
