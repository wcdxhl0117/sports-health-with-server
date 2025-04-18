<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 话题标签
const topics = ref([
  { id: 1, name: '全部', active: true },
  { id: 2, name: '膝关节康复', active: false },
  { id: 3, name: '腰椎护理', active: false },
  { id: 4, name: '肩部康复', active: false },
  { id: 5, name: '踝关节扭伤', active: false },
  { id: 6, name: '颈椎保养', active: false },
  { id: 7, name: '康复经验', active: false },
])

// 切换话题标签
const toggleTopic = (topic) => {
  topics.value.forEach((t) => {
    t.active = t.id === topic.id
  })
  // 实际应用中这里需要根据所选话题加载相应的帖子列表
}

// 帖子列表数据
const posts = ref([
  {
    id: 1,
    user: {
      id: 101,
      name: '康复小达人',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      isFollowed: false,
    },
    content:
      '今天完成第10天的膝关节康复训练，感觉关节灵活度明显提高了！分享一下我的心得：1. 坚持比什么都重要；2. 循序渐进，不要急于求成；3. 配合适当的热敷效果更好。',
    images: [
      'https://img.freepik.com/free-photo/physiotherapist-giving-knee-therapy-patient_107420-65326.jpg',
    ],
    likes: 28,
    comments: 5,
    publishTime: '30分钟前',
    topics: ['膝关节康复', '康复经验'],
  },
  {
    id: 2,
    user: {
      id: 102,
      name: '运动医学专家',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      isFollowed: true,
    },
    content:
      '分享一个快速缓解腰肌劳损的小技巧：保持良好坐姿，每小时起身活动5分钟，做简单的伸展运动。长期久坐的朋友一定要注意腰部保养！',
    images: [
      'https://img.freepik.com/free-photo/masseur-doing-massage-spine-man-body-spa-salon_1150-13163.jpg',
      'https://img.freepik.com/free-photo/young-handsome-man-doing-stretching-exercises-home_1328-2758.jpg',
    ],
    likes: 45,
    comments: 12,
    publishTime: '2小时前',
    topics: ['腰椎护理'],
  },
  {
    id: 3,
    user: {
      id: 103,
      name: '恢复训练师',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      isFollowed: false,
    },
    content:
      '很多人在踝关节扭伤后恢复训练时容易忽视平衡能力的训练，这是一个大错误！平衡训练对预防再次扭伤至关重要。这是我为大家整理的几个简单的平衡训练动作，每天坚持做，效果显著。',
    images: [
      'https://img.freepik.com/free-photo/woman-exercising-with-resistance-band_23-2148284760.jpg',
      'https://img.freepik.com/free-photo/woman-stretching-near-window_23-2148778673.jpg',
      'https://img.freepik.com/free-photo/rehabilitation-concept-with-wooden-alphabet-blocks_23-2148748150.jpg',
    ],
    likes: 56,
    comments: 8,
    publishTime: '昨天',
    topics: ['踝关节扭伤', '康复经验'],
  },
])

// 切换关注状态
const toggleFollow = (user) => {
  user.isFollowed = !user.isFollowed
}

// 查看帖子详情
const viewPostDetail = (id) => {
  router.push(`/post-detail/${id}`)
}

// 发布帖子
const createPost = () => {
  router.push('/post-create')
}

// 图片预览
const showImagePreview = (images, index) => {
  // 使用Vant的ImagePreview组件预览图片
  // 实际应用中需引入vant的ImagePreview组件
}
</script>

<template>
  <div class="page-container">
    <!-- 导航栏 -->
    <van-nav-bar title="康复社区" left-arrow />

    <!-- 话题标签 -->
    <div class="topics-container">
      <div class="topics-scroll">
        <div
          v-for="topic in topics"
          :key="topic.id"
          class="topic-tag"
          :class="{ active: topic.active }"
          @click="toggleTopic(topic)"
        >
          {{ topic.name }}
        </div>
      </div>
    </div>

    <!-- 帖子列表 -->
    <div class="post-list">
      <div v-for="post in posts" :key="post.id" class="post-item card">
        <!-- 用户信息 -->
        <div class="post-header flex-between mb-sm">
          <div class="flex" @click="router.push(`/user/${post.user.id}`)">
            <van-image round width="40" height="40" :src="post.user.avatar" />
            <div class="user-info ml-sm">
              <div class="user-name">{{ post.user.name }}</div>
              <div class="publish-time">{{ post.publishTime }}</div>
            </div>
          </div>
          <van-button
            size="mini"
            :type="post.user.isFollowed ? 'primary' : 'default'"
            :plain="!post.user.isFollowed"
            @click.stop="toggleFollow(post.user)"
          >
            {{ post.user.isFollowed ? '已关注' : '关注' }}
          </van-button>
        </div>

        <!-- 帖子内容 -->
        <div class="post-content mb-sm" @click="viewPostDetail(post.id)">{{ post.content }}</div>

        <!-- 帖子话题 -->
        <div class="post-topics mb-sm" v-if="post.topics && post.topics.length">
          <span v-for="(topic, i) in post.topics" :key="i" class="post-topic-tag">
            # {{ topic }}
          </span>
        </div>

        <!-- 帖子图片 -->
        <div
          v-if="post.images && post.images.length"
          class="post-images mb-sm"
          :class="`images-count-${post.images.length}`"
        >
          <div
            v-for="(img, i) in post.images"
            :key="i"
            class="post-image"
            @click.stop="showImagePreview(post.images, i)"
          >
            <van-image fit="cover" :src="img" />
          </div>
        </div>

        <!-- 帖子操作 -->
        <div class="post-actions flex">
          <div class="action-item flex-center">
            <van-icon name="like-o" />
            <span class="ml-xs">{{ post.likes }}</span>
          </div>
          <div class="action-item flex-center ml-md">
            <van-icon name="chat-o" />
            <span class="ml-xs">{{ post.comments }}</span>
          </div>
          <div class="action-item flex-center ml-md">
            <van-icon name="share-o" />
          </div>
        </div>
      </div>
    </div>

    <!-- 发布按钮 -->
    <van-fab class="post-fab" icon="edit" color="var(--primary-color)" @click="createPost" />
  </div>
</template>

<style scoped>
.page-container {
  padding-bottom: var(--space-5xl);
}

.topics-container {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: var(--white);
  padding: var(--space-sm) 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.topics-scroll {
  display: flex;
  overflow-x: auto;
  padding: 0 var(--space-lg);
  white-space: nowrap;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.topics-scroll::-webkit-scrollbar {
  display: none;
}

.topic-tag {
  padding: var(--space-xs) var(--space-md);
  margin-right: var(--space-sm);
  background-color: var(--background-color);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  color: var(--text-color);
}

.topic-tag.active {
  background-color: var(--primary-color);
  color: var(--white);
}

.post-item {
  padding: var(--space-md) var(--space-lg);
  margin-bottom: var(--space-md);
}

.ml-xs {
  margin-left: var(--space-xs);
}

.ml-sm {
  margin-left: var(--space-sm);
}

.ml-md {
  margin-left: var(--space-md);
}

.mb-sm {
  margin-bottom: var(--space-sm);
}

.user-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.user-name {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--title-color);
}

.publish-time {
  font-size: var(--font-size-xs);
  color: var(--text-color-secondary);
}

.post-content {
  font-size: var(--font-size-sm);
  line-height: 1.6;
  color: var(--text-color);
}

.post-topic-tag {
  display: inline-block;
  font-size: var(--font-size-xs);
  color: var(--primary-color);
  margin-right: var(--space-sm);
}

.post-images {
  display: grid;
  grid-gap: var(--space-xs);
}

.images-count-1 {
  grid-template-columns: 1fr;
}

.images-count-2 {
  grid-template-columns: 1fr 1fr;
}

.images-count-3 {
  grid-template-columns: 1fr 1fr 1fr;
}

.post-image {
  border-radius: var(--radius-sm);
  overflow: hidden;
  aspect-ratio: 1;
}

.action-item {
  color: var(--text-color-secondary);
  font-size: var(--font-size-sm);
}

.post-fab {
  position: fixed;
  right: var(--space-lg);
  bottom: calc(var(--space-lg) + 49px);
}
</style>
