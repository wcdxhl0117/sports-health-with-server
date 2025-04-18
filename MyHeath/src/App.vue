<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import LanguageSwitcher from './components/LanguageSwitcher.vue'

const route = useRoute()
const active = ref(0)

// 判断当前路由是否需要显示Tabbar
const showTabbar = computed(() => {
  // 这些路由不显示Tabbar
  const hideTabbarRoutes = ['/login', '/register', '/training-detail']
  return !hideTabbarRoutes.some((path) => route.path.includes(path))
})
</script>

<template>
  <div class="app-container">
    <!-- 语言切换器 -->
    <div class="language-switcher-container">
      <LanguageSwitcher />
    </div>

    <!-- 路由视图 -->
    <router-view />

    <!-- 底部标签栏 -->
    <van-tabbar v-if="showTabbar" v-model="active" route safe-area-inset-bottom>
      <van-tabbar-item to="/" icon="home-o">{{ $t('home') }}</van-tabbar-item>
      <van-tabbar-item to="/training" icon="guide-o">{{ $t('training') }}</van-tabbar-item>
      <van-tabbar-item to="/community" icon="friends-o">{{ $t('community') }}</van-tabbar-item>
      <van-tabbar-item to="/mine" icon="user-o">{{ $t('mine') }}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style>
.app-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.language-switcher-container {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 100;
}
</style>
