<script>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "Home",
  setup() {
    const route = useRoute();
    const users = ref([
      { id: 1, name: "用户一" },
      { id: 2, name: "用户二" },
      { id: 3, name: "用户三" },
      { id: 4, name: "用户四" },
      { id: 5, name: "用户五" },
    ]);

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

    const posts = ref([
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
    ]);

    //选中用户
    const selectUser = (user) => {
      selectedUser.value = user;
    };

    // 根据选中用户显示对应贴文
    const displayedPosts = computed(() => {
      if (!selectedUser.value) return [];
      // 假设每个用户都有相应的贴文，这里可以根据实际需求进行过滤
      return posts.value.filter(
        (post) => post.userId === selectedUser.value.id,
      );
    });

    const togglFavorite = (post) => {
      post.isFavorite = !post.isFavorite;
    };

    const goDetail = (postId) => {
      const post = posts.value.find((p) => p.id === postId);
      //左侧高亮对应用户
      if (post) {
        selectedUser.value = users.value.find(
          (user) => user.id === post.userId,
        );
      }
      router.push({ name: "Postdetail", params: { id: postId } });
    };
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
      <div class="user-grid">
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
    <div class="main-content">
      <h2>{{ selectedUser ? selectedUser.name + "的贴文" : "请选择用户" }}</h2>
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
  overflow-y: auto;
}
.sidebar h2 {
  margin-top: 0;
  color: #333;
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
