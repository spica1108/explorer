<script>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
export default {
  name: "Home",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const users = ref([]);
    const posts = ref([]);
    const loading = ref(true);

    const selectedUser = ref(null);
    const searchKeyword = ref("");
    //防抖函数
    let timer = null;
    const debouncedFilter = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        console.log("搜索关键词：", searchKeyword.value);
      }, 300);
    };

    //根据搜索关键词过滤用户
    const filteredUsers = computed(() => {
      const keyword = searchKeyword.value.toLowerCase();
      return users.value.filter((user) =>
        user.name.toLowerCase().includes(keyword),
      );
    });

    //选中用户
    const selectUser = (user) => {
      selectedUser.value = user;
    };

    // 根据选中用户显示对应贴文
    const displayedPosts = computed(() => {
      if (!selectedUser.value) return [];
      return posts.value.filter(
        (post) => post.userId === selectedUser.value.id,
      );
    });

    const togglFavorite = (post) => {
      post.isFavorite = !post.isFavorite;
    };

    // 计算已收藏贴文数量
    const favoritedCount = computed(() => {
      return posts.value.filter((post) => post.isFavorite).length;
    });

    const goDetail = (post) => {
      //左侧高亮对应用户
      if (post) {
        selectedUser.value = users.value.find(
          (user) => user.id === post.userId,
        );
      }
      router.push({ name: "Detail", params: { id: post.id } });
    };

    const goFavorites = () => {
      selectedUser.value = null;
      router.push({ name: "Favorites" });
    };

    // 从 JSONPlaceholder 获取数据
    onMounted(async () => {
      try {
        loading.value = true;
        // 获取用户列表
        const usersResponse = await fetch(
          "https://jsonplaceholder.typicode.com/users",
        );
        const usersData = await usersResponse.json();
        users.value = usersData.slice(0, 5).map((user) => ({
          id: user.id,
          name: user.name,
        }));

        // 获取贴文列表
        const postsResponse = await fetch(
          "https://jsonplaceholder.typicode.com/posts",
        );
        const postsData = await postsResponse.json();
        posts.value = postsData.slice(0, 10).map((post) => ({
          id: post.id,
          userId: post.userId,
          title: post.title,
          content: post.body.substring(0, 50) + "...",
        }));
      } catch (error) {
        console.error("获取数据失败：", error);
      } finally {
        loading.value = false;
      }
    });

    return {
      users,
      searchKeyword,
      debouncedFilter,
      filteredUsers,
      posts,
      selectedUser,
      selectUser,
      displayedPosts,
      togglFavorite,
      goDetail,
      favoritedCount,
      goFavorites,
      loading,
    };
  },
};
</script>

<template>
  <div class="container">
    <div class="sidebar">
      <h2>用户列表</h2>
      <input
        type="text"
        placeholder="搜索用户..."
        v-model="searchKeyword"
        @input="debouncedFilter"
        class="search-input"
      />
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else class="user-grid">
        <div
          v-for="user in filteredUsers"
          :key="user.id"
          @click="selectUser(user)"
          :class="{ active: user.id === selectedUser?.id }"
          class="user-card"
        >
          {{ user.name }}
        </div>
      </div>
    </div>
  </div>
  <div class="main-content">
    <div class="main-header">
      <h2>
        {{ selectedUser ? selectedUser.name + "的贴文" : "请选择用户" }}
      </h2>
      <button class="favorited-btn" @click="goFavorites">
        已收藏 ({{ favoritedCount }})
      </button>
    </div>
    <div v-if="selectedUser" class="post-grid">
      <div class="post-card" v-for="post in displayedPosts" :key="post.id">
        <h3>{{ post.title }}</h3>
        <p>{{ post.content }}</p>
        <button @click="togglFavorite(post)">
          {{ post.isFavorite ? "取消收藏" : "收藏" }}
        </button>
        <button @click="goDetail(post)">查看详情</button>
      </div>
    </div>
    <div v-else class="placeholder">请选择左侧用户</div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  height: 100vh;
}
.sidebar {
  width: 33.33%;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
.sidebar h2 {
  margin-top: 0;
  color: #333;
}
.loading {
  text-align: center;
  color: #999;
  padding: 20px;
  font-size: 14px;
}
.search-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 20px;
  box-sizing: border-box;
  transition: all 0.3s ease;
}
.search-input:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
}
.search-input::placeholder {
  color: #999;
}
.user-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}
.user-card {
  padding: 20px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s ease;
}
.user-card:hover {
  background-color: #f9f9f9;
}
.user-card.active {
  background-color: #4caf50;
  color: white;
  border-color: #45a049;
}
.main-content {
  width: 66.67%;
  padding: 20px;
  overflow-y: auto;
}
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.main-header h2 {
  margin: 0;
  color: #333;
  flex: 1;
}
.favorited-btn {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.3s ease;
  white-space: nowrap;
}
.favorited-btn:hover {
  background-color: #4caf50;
  transform: scale(1.05);
}
.post-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-top: 20px;
}
.post-card {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}
.post-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
.post-card h3 {
  margin-top: 0;
  color: #333;
}
.post-card p {
  color: #666;
  margin: 10px 0;
}
.post-card button {
  margin-right: 10px;
  padding: 8px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  background-color: #f5f5f5;
  transition: all 0.3s ease;
}
.post-card button:hover {
  background-color: #4caf50;
  color: white;
  border-color: #45a049;
}
.placeholder {
  color: #888;
  font-size: 18px;
  text-align: center;
  padding: 40px 20px;
}
</style>
