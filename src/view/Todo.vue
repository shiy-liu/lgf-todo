<template>
  <TodoList msg="Todo Or Not Todo"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TodoList from '../components/TodoList.vue';

export default defineComponent({
  name: 'App',
  components: {
    TodoList
  }
});
</script>
