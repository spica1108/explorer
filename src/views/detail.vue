<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "DetailView",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const postId = ref(route.params.id);

    const posts = [
      { id: 1, userId: 1, title: "贴文一", content: "这是贴文一的内容。" },
      { id: 2, userId: 1, title: "贴文二", content: "这是贴文二的内容。" },
      { id: 3, userId: 2, title: "贴文三", content: "这是贴文三的内容。" },
      { id: 4, userId: 3, title: "贴文四", content: "这是贴文四的内容。" },
      { id: 5, userId: 2, title: "贴文五", content: "这是贴文五的内容。" },
      { id: 6, userId: 4, title: "贴文六", content: "这是贴文六的内容。" },
      { id: 7, userId: 5, title: "贴文七", content: "这是贴文七的内容。" },
      { id: 8, userId: 3, title: "贴文八", content: "这是贴文八的内容。" },
      { id: 9, userId: 4, title: "贴文九", content: "这是贴文九的内容。" },
      { id: 10, userId: 5, title: "贴文十", content: "这是贴文十的内容。" },
    ];
    const comments = [
      { id: 1, postId: 1, author: "用户二", content: "这是一个很好的贴文！" },
      { id: 2, postId: 1, author: "用户三", content: "非常同意，写得很不错。" },
      { id: 3, postId: 2, author: "用户三", content: "这是贴文二的评论。" },
      { id: 4, postId: 2, author: "用户四", content: "我也赞同这个观点。" },
      { id: 5, postId: 3, author: "用户一", content: "这是贴文三的评论。" },
      { id: 6, postId: 4, author: "用户五", content: "这是贴文四的评论。" },
      { id: 7, postId: 5, author: "用户一", content: "很有启发。" },
      { id: 8, postId: 5, author: "用户二", content: "完全同意！" },
      { id: 9, postId: 6, author: "用户三", content: "这是贴文六的评论。" },
      { id: 10, postId: 6, author: "用户四", content: "非常有趣。" },
    ];

    const post = ref(null);
    const postComments = ref([]);

    onMounted(() => {
      post.value = posts.find((p) => p.id === parseInt(postId.value));
      postComments.value = comments.filter(
        (c) => c.postId === parseInt(postId.value),
      );
    });
    const goBack = () => {
      router.push({ name: "Home" });
    };

    return {
      postId,
      post,
      postComments,
      goBack,
    };
  },
};
</script>
<template>
  <div class="detail-container">
    <button class="back-button" @click="goBack">← 返回主页面</button>

    <div class="post-detail" v-if="post">
      <div class="post-header">
        <h1>{{ post.title }}</h1>
      </div>
      <div class="post-content">
        <p>{{ post.content }}</p>
      </div>
    </div>

    <div class="comments-section">
      <h2>评论 ({{ postComments.length }}条)</h2>
      <div v-if="postComments.length > 0" class="comments-list">
        <div
          class="comment-card"
          v-for="comment in postComments"
          :key="comment.id"
        >
          <div class="comment-header">
            <span class="comment-author">{{ comment.author }}</span>
          </div>
          <div class="comment-content">
            {{ comment.content }}
          </div>
        </div>
      </div>
      <div v-else class="no-comments">暂无评论</div>
    </div>
  </div>
</template>
<style scoped>
.detail-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.back-button {
  display: inline-block;
  margin-bottom: 20px;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.back-button:hover {
  background-color: #45a049;
  transform: translateX(-3px);
}

.post-detail {
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.post-header {
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.post-header h1 {
  margin: 0;
  color: #333;
  font-size: 28px;
  line-height: 1.4;
}

.post-content {
  font-size: 16px;
  line-height: 1.8;
  color: #555;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.post-content p {
  margin: 0;
}

.comments-section {
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.comments-section h2 {
  margin-top: 0;
  color: #333;
  font-size: 20px;
  margin-bottom: 20px;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.comment-card {
  background-color: #f9f9f9;
  padding: 15px;
  border-left: 3px solid #4caf50;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.comment-card:hover {
  background-color: #f0f0f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.comment-header {
  margin-bottom: 10px;
}

.comment-author {
  color: #4caf50;
  font-weight: bold;
  font-size: 14px;
}

.comment-content {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

.no-comments {
  text-align: center;
  color: #999;
  padding: 40px 20px;
  font-size: 16px;
}
</style>
