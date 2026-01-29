<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "StarView",
  setup() {
    const router = useRouter();
    const favoritedPosts = ref([]);
    const loading = ref(true);

    // 模拟收藏的贴文 ID（在实际应用中会从 localStorage 或后端获取）
    const favoritePostIds = [1, 3, 5, 7, 9];

    const goDetail = (post) => {
      router.push({ name: "Detail", params: { id: post.id } });
    };

    const removeFavorite = (postId) => {
      favoritedPosts.value = favoritedPosts.value.filter(
        (p) => p.id !== postId,
      );
    };

    // 从 JSONPlaceholder 获取收藏的贴文
    onMounted(async () => {
      try {
        loading.value = true;
        // 同时获取所有收藏贴文的详情
        const promises = favoritePostIds.map((id) =>
          fetch(`https://jsonplaceholder.typicode.com/posts/${id}`).then(
            (res) => res.json(),
          ),
        );
        const posts = await Promise.all(promises);
        favoritedPosts.value = posts.map((post) => ({
          id: post.id,
          userId: post.userId,
          title: post.title,
          content: post.body.substring(0, 50) + "...",
        }));
      } catch (error) {
        console.error("获取收藏贴文失败：", error);
      } finally {
        loading.value = false;
      }
    });

    return {
      favoritedPosts,
      goDetail,
      removeFavorite,
      loading,
    };
  },
};
</script>

<template>
  <div class="star-container">
    <h2>我的收藏</h2>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else>
      <div class="posts-list">
        <div class="post-card" v-for="post in favoritedPosts" :key="post.id">
          <h3>{{ post.title }}</h3>
          <p>{{ post.content }}</p>
          <div class="post-actions">
            <button class="btn-detail" @click="goDetail(post)">查看详情</button>
            <button class="btn-unfavorite" @click="removeFavorite(post.id)">
              取消收藏
            </button>
          </div>
        </div>
      </div>
      <div v-if="favoritedPosts.length === 0" class="no-favorites">
        暂无收藏的贴文
      </div>
    </div>
  </div>
</template>

<style scoped>
.star-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.star-container h2 {
  color: #333;
  margin-bottom: 20px;
  font-size: 24px;
}

.loading {
  text-align: center;
  color: #999;
  padding: 60px 20px;
  font-size: 16px;
}

.posts-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.post-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.post-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.post-card h3 {
  margin-top: 0;
  color: #333;
  font-size: 18px;
}

.post-card p {
  color: #666;
  margin: 10px 0 20px 0;
  line-height: 1.6;
}

.post-actions {
  display: flex;
  gap: 10px;
}

.btn-detail,
.btn-unfavorite {
  flex: 1;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.3s ease;
}

.btn-detail {
  background-color: #4caf50;
  color: white;
}

.btn-detail:hover {
  background-color: #45a049;
  transform: scale(1.02);
}

.btn-unfavorite {
  background-color: #ff6b9d;
  color: white;
}

.btn-unfavorite:hover {
  background-color: #ff5a8a;
  transform: scale(1.02);
}

.no-favorites {
  text-align: center;
  color: #999;
  padding: 60px 20px;
  font-size: 16px;
}
</style>
