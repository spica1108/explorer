<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "DetailView",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const postId = ref(route.params.id);

    const post = ref(null);
    const postComments = ref([]);
    const loading = ref(true);

    onMounted(async () => {
      try {
        loading.value = true;
        // 获取特定贴文
        const postResponse = await fetch(
          `https://jsonplaceholder.typicode.com/posts/${postId.value}`,
        );
        const postData = await postResponse.json();
        post.value = {
          id: postData.id,
          userId: postData.userId,
          title: postData.title,
          content: postData.body,
        };

        // 获取该贴文的评论
        const commentsResponse = await fetch(
          `https://jsonplaceholder.typicode.com/posts/${postId.value}/comments`,
        );
        const commentsData = await commentsResponse.json();
        postComments.value = commentsData.map((comment) => ({
          id: comment.id,
          postId: comment.postId,
          author: comment.name,
          content: comment.body,
        }));
      } catch (error) {
        console.error("获取数据失败：", error);
      } finally {
        loading.value = false;
      }
    });

    const goBack = () => {
      router.push({ name: "Home" });
    };

    return {
      post,
      postComments,
      goBack,
      loading,
    };
  },
};
</script>
<template>
  <div class="detail-container">
    <button class="back-button" @click="goBack">← 返回主页面</button>

    <div v-if="loading" class="loading">加载中...</div>
    <div v-else>
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

.loading {
  text-align: center;
  color: #999;
  padding: 60px 20px;
  font-size: 16px;
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
