<template>
  <div class="top-wrapper">
    <h1>{{ msg }}</h1>
    <div class="input-wrapper">
      <a-button v-if="realList.length > 0" @click="selectAll(!allSelected)">
        <template #icon>
          <DownOutlined />
        </template>
      </a-button>
      <a-input v-model:value="titleVal" placeholder="input todos" @keydown.enter="addTodo" />
    </div>
    <template v-if="realList.length > 0">
      <Draggable :list="realList" :animation="800" item-key="title">
        <template #item="{ element, index }">
          <div class="item-wrapper">
            <div class="item-container">
              <a-checkbox v-model:checked="element.done" />
              <span :class="{ done: element.done }" class="todo-item">{{ element.title }}</span>
            </div>
            <div>
              <DragOutlined class="opt-icon" />
              <CloseOutlined class="opt-icon" @click="deleteTodo(index)" />
            </div>
          </div>
        </template>
      </Draggable>
    </template>
    <div class="bottom-wrapper">
      <div>{{ `${activeCount} ${activeCount > 1 ? 'items' : 'item'} left` }}</div>
      <a-tabs v-model:activeKey="activeKey" @change="changeType">
        <a-tab-pane key="all" tab="All" />
        <a-tab-pane key="active" tab="Active" />
        <a-tab-pane key="done" tab="Completed" />
      </a-tabs>
      <a-button v-if="activeCount < list.length" type="text" @click="clearTodoBefore">Clear done</a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, reactive, toRefs, computed, createVNode, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { DownOutlined, ExclamationCircleOutlined, DragOutlined, CloseOutlined } from '@ant-design/icons-vue'
import { Modal } from 'ant-design-vue'
import Draggable from 'vuedraggable'

type Props = {
  msg: string
}
defineProps<Props>()

onMounted(() => {
  const storeList: List = { list: JSON.parse(localStorage.getItem('todoList') || '[]') }
  list.value = storeList.list
})

window.addEventListener('beforeunload', () => {
  localStorage.setItem('todoList', JSON.stringify(list.value))
})
let titleVal = ref('')
interface List {
  list: Array<DataItem>
}
interface DataItem {
  title: string,
  done: boolean
}
const origin = reactive<List>({ list: [] })
let { list } = toRefs(origin)
let currentOrigin = reactive<List>({ list: [] })
let { list: realList } = toRefs(currentOrigin)
const router = useRouter()

let activeKey = computed({
  get: () => router.currentRoute.value.fullPath.substring(1),
  set: () => { },
})
const activeCount = computed(() => list.value.filter(v => !v.done).length)
const allSelected = computed(() => activeCount.value === 0)

watch([activeKey, list], () => {
  if (activeKey.value === 'all') {
    realList.value = list.value
    return
  }
  if (activeKey.value === 'done') {
    realList.value = list.value.filter(v => v.done)
    return
  }
  realList.value = list.value.filter(v => !v.done)
}, { deep: true })

const changeType = (val: string) => {
  router.push(`/${val}`)
}
const addTodo = () => {
  if (!titleVal.value.trim()) return
  list.value.push({
    title: titleVal.value,
    done: false,
  })
  titleVal.value = ''
}
const selectAll = (selected: boolean) => {
  list.value.forEach(todo => { todo.done = selected })
}
const clearTodo = () => {
  list.value = list.value.filter(v => !v.done)
}
const deleteTodo = (index: number) => {
  list.value.splice(index, 1)
}
const clearTodoBefore = () => {
  Modal.confirm({
    title: 'Tip',
    icon: createVNode(ExclamationCircleOutlined),
    content: 'Clear completed ?',
    okText: 'yes',
    cancelText: 'no',
    onOk: clearTodo,
  })
}
const color = {
  del: 'gray',
}
</script>

<style scoped>
.top-wrapper {
  max-width: 520px;
  margin: 0 auto;
}
.input-wrapper,
.bottom-wrapper,
.item-wrapper,
.item-container {
  display: flex;
  align-items: center;
  padding: 16px;
}
.bottom-wrapper,
.item-wrapper {
  justify-content: space-between;
}
.item-wrapper {
  flex-wrap: nowrap;
  padding: 0;
  margin: 0 16px;
  border-bottom: 1px solid #eee;
}
.item-container {
  justify-content: flex-start;
  padding: 16px 0;
}
.done {
  color: v-bind("color.del");
  text-decoration: line-through;
}
.todo-item {
  max-width: 380px;
  margin-left: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre-wrap;
  text-align: left;
}
.opt-icon {
  cursor: pointer;
  margin-left: 10px;
}
.top-wrapper :deep(.ant-list-item) {
  text-align: left;
}
.top-wrapper :deep(.ant-list-item) {
  margin: 6px 18px;
}
</style>
