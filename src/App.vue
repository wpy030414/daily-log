<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useEventStore } from './stores/events'
import { useProjectStore } from './stores/projects'
import EventItem from './components/EventItem.vue'
import ProjectItem from './components/ProjectItem.vue'
import { downloadInBrowser, shotElement, uploadInBrowser } from './utils'
import { ElMessage } from 'element-plus'
import { useTheme } from './stores/theme'

const activeName = ref('home')

const projects = ref(useProjectStore().projects)
const events = ref(useEventStore().events)

function handleAdd(objType: 'p' | 'e') {
  if (objType === 'p') {
    projects.value.push({
      exception: undefined,
      org: '罗德岛',
      project: '源石计划',
      progress: 0,
    })
    return
  } else if (objType === 'e') {
    events.value.push({
      state: 'ok',
      body: '关闭全舰防御系统。',
    })
    return
  }
}

function handleMoveUp(objType: 'p' | 'e', index: number) {
  let objList
  if (objType === 'p') {
    objList = projects.value
  } else if (objType === 'e') {
    objList = events.value
  } else {
    return
  }
  if (index > 0) {
    const temp = objList[index]
    objList[index] = objList[index - 1]
    objList[index - 1] = temp
  }
}

function handleMoveDown(objType: 'p' | 'e', index: number) {
  let objList
  if (objType === 'p') {
    objList = projects.value
  } else if (objType === 'e') {
    objList = events.value
  } else {
    return
  }
  if (index < objList.length - 1) {
    const temp = objList[index]
    objList[index] = objList[index + 1]
    objList[index + 1] = temp
  }
}

function handleDelete(objType: 'p' | 'e', index: number) {
  let objList
  if (objType === 'p') {
    objList = projects.value
  } else if (objType === 'e') {
    objList = events.value
  } else {
    return
  }
  objList.splice(index, 1)
}

function handleOutputOption() {
  downloadInBrowser(
    'data:text/json;charset=utf-8,' +
      encodeURIComponent(
        JSON.stringify({
          projects: projects.value,
          events: events.value,
        }),
      ),
    `日志快照-${Date.now()}.json`,
  )
}

async function handleInputOption() {
  const result = (await uploadInBrowser()) as any
  if (result) {
    projects.value = result.projects
    useProjectStore().projects = result.projects
    events.value = result.events
    useEventStore().events = result.events
    ElMessage.success('导入成功！')
  } else {
    ElMessage.info('您取消了操作。')
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleUpdateScrollState)
  window.addEventListener('resize', handleUpdateScrollState)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleUpdateScrollState)
  window.removeEventListener('resize', handleUpdateScrollState)
})

function handleUpdateScrollState() {
  const scrollHeight = Math.max(
    document.body.clientHeight,
    document.body.offsetHeight,
    document.body.scrollHeight,
    document.documentElement.clientHeight,
    document.documentElement.offsetHeight,
    document.documentElement.scrollHeight,
  )
  const scrollableHeight = scrollHeight - window.innerHeight
  pageYRatio.value = scrollableHeight > 0 ? (window.pageYOffset / scrollableHeight) * 100 : 0
}

const pageYRatio = ref(0)

function handleRingClicked() {}
</script>

<template>
  <el-tabs v-model="activeName" :stretch="true">
    <el-tab-pane label="首页" name="home">
      <div v-if="activeName == 'home'" id="c-root" class="padding">
        <h1>项目</h1>
        <article v-if="projects.length">
          <ProjectItem v-for="p in projects" :p="p" />
        </article>
        <el-empty v-else description="空空如也" />
        <h1>事件</h1>
        <article v-if="events.length">
          <EventItem v-for="e in events" :e="e" />
        </article>
        <el-empty v-else description="空空如也" />
      </div>
      <div class="padding">
        <el-button title="下载" @click="shotElement('#c-root', 'download')"
          ><el-icon><Download /></el-icon
        ></el-button>
        <el-button title="复制" @click="shotElement('#c-root', 'copy')"
          ><el-icon><CopyDocument /></el-icon
        ></el-button>
        &nbsp;
        <el-segmented v-model="useTheme().value" :options="useTheme().options" color="red" />
        <canvas v-show="false" id="screenshot-container"></canvas>
      </div>
    </el-tab-pane>
    <el-tab-pane label="配置页" name="option">
      <div class="padding">
        <h2>
          项目
          <el-button @click="handleAdd('p')"
            ><el-icon><Plus /></el-icon
          ></el-button>
        </h2>
        <el-table :data="projects" stripe style="width: 100%">
          <el-table-column prop="exception" label="异常" width="200">
            <template #default="scope">
              <el-select v-model="scope.row.exception" placeholder="无">
                <el-option
                  v-for="item in [
                    { label: '无', value: undefined },
                    { label: '失败/放弃', value: 'failed' },
                    { label: '搁置/卡住/暂停', value: 'stucked' },
                  ]"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="org" label="所属组织" width="200">
            <template #default="scope">
              <el-input v-model="scope.row.org" />
            </template>
          </el-table-column>
          <el-table-column prop="project" label="项目名" width="200">
            <template #default="scope">
              <el-input v-model="scope.row.project" />
            </template>
          </el-table-column>
          <el-table-column prop="progress" label="进度" width="200">
            <template #default="scope">
              <el-input-number v-model="scope.row.progress" :min="0" :max="1" :step="0.01" />
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="160" fixed="right" align="right">
            <template #default="scope">
              <el-button size="small" @click="handleMoveUp('p', scope.$index)"
                ><el-icon><ArrowUp /></el-icon
              ></el-button>
              <el-button size="small" @click="handleMoveDown('p', scope.$index)"
                ><el-icon><ArrowDown /></el-icon
              ></el-button>
              <el-button size="small" type="danger" @click="handleDelete('p', scope.$index)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-divider />

        <h2>
          事件
          <el-button @click="handleAdd('e')"
            ><el-icon><Plus /></el-icon
          ></el-button>
        </h2>
        <el-table :data="events" stripe style="width: 100%">
          <el-table-column prop="state" label="状态" width="200">
            <template #default="scope">
              <el-select v-model="scope.row.state" placeholder="无">
                <el-option
                  v-for="item in [
                    { label: '紧急', value: 'worried' },
                    { label: '不太紧急', value: 'non-worried' },
                    { label: '有疑惑', value: 'confused' },
                    { label: '完成', value: 'ok' },
                  ]"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="body" label="事件概要" width="300">
            <template #default="scope">
              <el-input
                v-model="scope.row.body"
                type="textarea"
                :rows="Math.min(Math.ceil(scope.row.body.length / 18) + 2, 10)"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="160" fixed="right" align="right">
            <template #default="scope">
              <el-button size="small" @click="handleMoveUp('e', scope.$index)"
                ><el-icon><ArrowUp /></el-icon
              ></el-button>
              <el-button size="small" @click="handleMoveDown('e', scope.$index)"
                ><el-icon><ArrowDown /></el-icon
              ></el-button>
              <el-button size="small" type="danger" @click="handleDelete('e', scope.$index)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-divider />

        <el-button title="导出" @click="handleOutputOption"
          ><el-icon><Download /></el-icon
        ></el-button>
        <el-button title="导入" @click="handleInputOption"
          ><el-icon><Upload /></el-icon
        ></el-button>
      </div>
    </el-tab-pane>
  </el-tabs>
  <el-progress
    id="scroll-progress"
    type="circle"
    :percentage="pageYRatio"
    :show-text="false"
    :stroke-width="18"
    :status="pageYRatio > 99 ? 'exception' : ''"
    @click="handleRingClicked"
  />
</template>

<style scoped>
#c-root {
  background: var(--color-bg-main);
  perspective: 100px;

  & h1 {
    color: var(--color-bg-main-reverse);
  }

  & h4 {
    color: var(--color-bg-sub-reverse);
  }

  & > * {
    margin-bottom: 1rem;
    transform-style: preserve-3d;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.el-segmented {
  --el-segmented-item-selected-bg-color: var(--color-bg-main-reverse);
}

#scroll-progress {
  position: fixed;
  z-index: 999;
  right: 6rem;
  bottom: 6rem;
  zoom: 0.3;
}
</style>
