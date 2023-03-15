<template>
  <el-dropdown>
    <span class="el-dropdown-link">
      <el-avatar
        size="small"
        src="https://www.bing.com/th/id/OGC.18330712f71fdd19f1368574a6a20d26?pid=1.7&rurl=https%3a%2f%2fimg.zcool.cn%2fcommunity%2f01c85b5b5700e2a801215c8fbea8d5.gif&ehk=uf%2f%2b%2fAhTD7vBdynPB%2fCVjvTizLbqkTULdRaAmSbXNps%3d"
      />
      <span>{{ name }}</span>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="handleExitClick">退出登录</el-dropdown-item>
        <el-dropdown-item divided>用户信息</el-dropdown-item>
        <el-dropdown-item>系统管理</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from '@/store'
import { useRouter } from 'vue-router'

import localCache from '@/utils/cache'

export default defineComponent({
  components: {},
  setup() {
    const store = useStore()
    // 动态获取name值
    const name = computed(() => store.state.login.userInfo.name)

    const router = useRouter()
    const handleExitClick = () => {
      localCache.deleteCache('token')
      router.push('/main')
    }

    return {
      name,
      handleExitClick
    }
  }
})
</script>
<style>
.el-dropdown-link {
  /* cursor：pointer 效果是悬浮在头像上时，鼠标变成小手 */
  cursor: pointer;
  display: flex;
  align-items: center;
}
</style>
