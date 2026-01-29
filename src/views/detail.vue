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
      { id: 1, title: "贴文一", content: "这是贴文一的内容。" },
      { id: 2, title: "贴文二", content: "这是贴文二的内容。" },
      { id: 3, title: "贴文三", content: "这是贴文三的内容。" },
      { id: 4, title: "贴文四", content: "这是贴文四的内容。" },
      { id: 5, title: "贴文五", content: "这是贴文五的内容。" },
    ];
    const comments = [
      { id: 1, postId: 1, content: "这是贴文一的评论。" },
      { id: 2, postId: 2, content: "这是贴文二的评论。" },
      { id: 3, postId: 3, content: "这是贴文三的评论。" },
      { id: 4, postId: 4, content: "这是贴文四的评论。" },
      { id: 5, postId: 5, content: "这是贴文五的评论。" },
    ];

    const post = ref(null);
    const postComments = ref([]);

    onMounted(() => {
      post.value = posts.find((p) => p.id === postId);
      postComments.value = comments.filter((c) => c.postId === postId);
    });
    const goBack = () => {
      router.push({ name: "Home" });
    };

    return {
      postId,
      goBack,
    };
  },
};
</script>
<template>
  <div class="detail-container">
    <button @click="goBack">返回主页面</button>
    <h2>{{ post?.title }}</h2>
    <p>{{ post?.content }}</p>
    <h3>评论：</h3>
    <ul>
      <li v-for="comment in postComments" :key="comment.id">
        {{ comment.content }}
      </li>
    </ul>
  </div>
</template>
<style>
.detail-container {
  padding: 20px;
}
button {
  margin-bottom: 20px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  background-color: #f9f9f9;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
}
</style>
