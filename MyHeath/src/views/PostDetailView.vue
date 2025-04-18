<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 帖子数据（模拟数据）
const postData = ref({
  id: route.params.id,
  user: {
    id: 1,
    name: '康复小达人',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    isExpert: true,
  },
  content:
    '今天完成第10天的膝关节康复训练，感觉关节灵活度明显提高了！分享一些我的心得：\n\n1. 坚持每天做训练，哪怕只有10分钟\n2. 注意训练姿势，宁可少做，也要做对\n3. 训练后适当热敷，有助于缓解不适\n4. 记录每天的进步，保持积极心态',
  images: [
    'https://placehold.co/600x400?text=康复训练图片1',
    'https://placehold.co/600x400?text=康复训练图片2',
  ],
  date: '2023-05-20 14:30',
  likes: 28,
  comments: [
    {
      id: 1,
      user: {
        id: 2,
        name: '运动医学专家',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
        isExpert: true,
      },
      content:
        '非常好的分享！热敷确实有助于缓解训练后的肌肉紧张和关节不适。建议热敷15-20分钟为宜，温度不要太高，以免烫伤皮肤。',
      date: '2023-05-20 15:12',
      likes: 8,
    },
    {
      id: 2,
      user: {
        id: 3,
        name: '康复之路',
        avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
        isExpert: false,
      },
      content: '我也在做膝关节康复，请问你每天大概训练多久？感觉进步很快啊！',
      date: '2023-05-20 16:05',
      likes: 3,
    },
    {
      id: 3,
      user: {
        id: 1,
        name: '康复小达人',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        isExpert: false,
      },
      content:
        '回复 @康复之路：我一般每天训练两次，早晚各半小时左右。刚开始会有点不适，坚持一周后就好多了！',
      date: '2023-05-20 16:30',
      likes: 5,
    },
  ],
  tags: ['膝关节康复', '训练心得', '康复分享'],
})

// 是否已点赞
const hasLiked = ref(false)

// 评论内容
const commentContent = ref('')

// 点赞
const toggleLike = () => {
  if (hasLiked.value) {
    postData.value.likes--
  } else {
    postData.value.likes++
  }
  hasLiked.value = !hasLiked.value
}

// 发表评论
const submitComment = () => {
  if (!commentContent.value.trim()) return

  // 模拟添加评论
  const newComment = {
    id: postData.value.comments.length + 1,
    user: {
      id: 999,
      name: '当前用户',
      avatar: 'https://randomuser.me/api/portraits/men/99.jpg',
      isExpert: false,
    },
    content: commentContent.value,
    date: '刚刚',
    likes: 0,
  }

  postData.value.comments.push(newComment)
  commentContent.value = ''
}

// 分享帖子
const sharePost = () => {
  // 实际项目中调用分享API或显示分享弹窗
  console.log('Share post:', postData.value.id)
}

// 初始化
onMounted(() => {
  // 实际项目中根据帖子ID从API获取数据
  console.log('Post detail for ID:', route.params.id)
})
</script>

<template>
  <div class="post-detail-container">
    <van-nav-bar title="帖子详情" left-arrow @click-left="router.go(-1)" />

    <!-- 帖子内容 -->
    <div class="post-content card">
      <!-- 用户信息 -->
      <div class="user-info">
        <div class="avatar-container">
          <van-image round width="50" height="50" :src="postData.user.avatar" />
          <div v-if="postData.user.isExpert" class="expert-badge">专家</div>
        </div>

        <div class="user-detail">
          <div class="user-name">{{ postData.user.name }}</div>
          <div class="post-date">{{ postData.date }}</div>
        </div>

        <van-button plain type="primary" size="small">关注</van-button>
      </div>

      <!-- 帖子正文 -->
      <div class="post-text">
        <p>{{ postData.content }}</p>
      </div>

      <!-- 帖子图片 -->
      <div v-if="postData.images && postData.images.length" class="post-images">
        <van-image
          v-for="(image, index) in postData.images"
          :key="index"
          width="100%"
          fit="cover"
          :src="image"
          radius="8"
          class="post-image"
        />
      </div>

      <!-- 标签 -->
      <div v-if="postData.tags && postData.tags.length" class="post-tags">
        <van-tag
          v-for="(tag, index) in postData.tags"
          :key="index"
          plain
          type="primary"
          class="tag"
        >
          {{ tag }}
        </van-tag>
      </div>

      <!-- 互动按钮 -->
      <div class="interaction-buttons">
        <div class="button-item" :class="{ liked: hasLiked }" @click="toggleLike">
          <van-icon :name="hasLiked ? 'like' : 'like-o'" />
          <span>{{ postData.likes }}</span>
        </div>

        <div class="button-item">
          <van-icon name="comment-o" />
          <span>{{ postData.comments.length }}</span>
        </div>

        <div class="button-item" @click="sharePost">
          <van-icon name="share-o" />
          <span>分享</span>
        </div>
      </div>
    </div>

    <!-- 评论区 -->
    <div class="comments-section card">
      <h3 class="section-title">评论 ({{ postData.comments.length }})</h3>

      <div v-for="comment in postData.comments" :key="comment.id" class="comment-item">
        <div class="comment-user">
          <div class="avatar-container">
            <van-image round width="40" height="40" :src="comment.user.avatar" />
            <div v-if="comment.user.isExpert" class="expert-badge small">专家</div>
          </div>

          <div class="comment-user-detail">
            <div class="user-name">{{ comment.user.name }}</div>
            <div class="comment-date">{{ comment.date }}</div>
          </div>
        </div>

        <div class="comment-content">
          <p>{{ comment.content }}</p>
        </div>

        <div class="comment-actions">
          <div class="action-item">
            <van-icon name="like-o" />
            <span>{{ comment.likes }}</span>
          </div>

          <div class="action-item">
            <van-icon name="comment-o" />
            <span>回复</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 评论输入框 -->
    <div class="comment-input-container">
      <van-field
        v-model="commentContent"
        placeholder="写下你的评论..."
        clearable
        maxlength="200"
        show-word-limit
      >
        <template #button>
          <van-button
            size="small"
            type="primary"
            @click="submitComment"
            :disabled="!commentContent.trim()"
          >
            发送
          </van-button>
        </template>
      </van-field>
    </div>
  </div>
</template>

<style scoped>
.post-detail-container {
  min-height: 100vh;
  background-color: var(--background-color);
  padding-bottom: 60px;
}

.section-title {
  font-size: var(--font-size-md);
  font-weight: 500;
  color: var(--title-color);
  margin-bottom: var(--space-md);
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: var(--space-md);
}

.avatar-container {
  position: relative;
  margin-right: var(--space-md);
}

.expert-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  background-color: var(--primary-color);
  color: #fff;
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 4px;
}

.expert-badge.small {
  font-size: 8px;
  padding: 0 2px;
}

.user-detail {
  flex: 1;
}

.user-name {
  font-size: var(--font-size-md);
  font-weight: 500;
  color: var(--title-color);
}

.post-date,
.comment-date {
  font-size: var(--font-size-xs);
  color: var(--text-color-secondary);
}

.post-text {
  margin-bottom: var(--space-md);
  font-size: var(--font-size-sm);
  line-height: 1.6;
  white-space: pre-line;
}

.post-images {
  margin-bottom: var(--space-md);
}

.post-image {
  margin-bottom: var(--space-sm);
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: var(--space-md);
}

.tag {
  margin-right: var(--space-sm);
  margin-bottom: var(--space-sm);
}

.interaction-buttons {
  display: flex;
  border-top: 1px solid var(--divider-color);
  padding-top: var(--space-md);
}

.button-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color-secondary);
  font-size: var(--font-size-sm);
}

.button-item.liked {
  color: var(--primary-color);
}

.button-item .van-icon {
  margin-right: var(--space-xs);
  font-size: var(--font-size-md);
}

.comments-section {
  margin-bottom: 60px;
}

.comment-item {
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--divider-color);
}

.comment-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.comment-user {
  display: flex;
  align-items: center;
  margin-bottom: var(--space-sm);
}

.comment-user-detail {
  flex: 1;
}

.comment-content {
  font-size: var(--font-size-sm);
  line-height: 1.5;
  margin-bottom: var(--space-sm);
  padding-left: 50px;
}

.comment-actions {
  display: flex;
  padding-left: 50px;
}

.action-item {
  display: flex;
  align-items: center;
  margin-right: var(--space-lg);
  color: var(--text-color-secondary);
  font-size: var(--font-size-xs);
}

.action-item .van-icon {
  margin-right: var(--space-xs);
}

.comment-input-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  padding: var(--space-sm);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}
</style>
