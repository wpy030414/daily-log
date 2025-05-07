<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useEventStore } from './stores/events'
import { useProjectStore } from './stores/projects'
import VEventCard from './components/VEventCard.vue'
import VProjectCard from './components/VProjectCard.vue'
import { downloadInBrowser, shotElement, uploadInBrowser } from './utils'
import { useCustomTheme } from './stores/theme'
import { useMessage } from './stores/messages'
import type { Store } from 'pinia'

declare global {
  interface Window {
    msg: Store
  }
}
window.msg = useMessage()

const activeName = ref('render')

const projects = ref(useProjectStore().projects)
const events = ref(useEventStore().events)

onMounted(() => {
  window.addEventListener(
    'resize',
    () => (widthRate.value = window.innerWidth / window.screen.width),
  )
})
const widthRate = ref(0)

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
    useMessage().success('导入成功！')
  } else {
    useMessage().info('您取消了操作。')
  }
}

function visit(url: string) {
  const a = document.createElement('a')
  a.href = url
  a.target = '_blank'
  a.click()
  a.remove()
}
</script>

<template>
  <v-responsive class="border rounded">
    <v-app>
      <v-main>
        <template v-if="activeName == 'render'">
          <div id="preview" class="px-10 py-10 mb-4">
            <h1>项目</h1>

            <article v-if="projects.length">
              <v-project-card v-for="p in projects" :p="p" />
            </article>
            <v-empty-state v-else headline="¯\_(ツ)_/¯"></v-empty-state>

            <h1>事件</h1>

            <article v-if="events.length">
              <v-event-card v-for="e in events" :e="e" />
            </article>
            <v-empty-state v-else headline="¯\_(ツ)_/¯"></v-empty-state>
          </div>
          <div class="px-10 pb-10">
            <v-btn title="下载" class="mr-4" @click="shotElement('#preview', 'download')"
              ><v-icon icon="mdi-download"></v-icon
            ></v-btn>

            <v-btn title="复制" @click="shotElement('#preview', 'copy')"
              ><v-icon icon="mdi-content-copy"></v-icon
            ></v-btn>

            <canvas v-show="false" id="screenshot-container"></canvas>
          </div>
        </template>

        <template v-if="activeName == 'options'">
          <div class="px-10 py-10">
            <template v-if="widthRate >= 0.9">
              <v-card class="px-4 py-4 mb-4">
                <v-card-title
                  >项目
                  <v-btn class="ml-3" @click="handleAdd('p')"
                    ><v-icon icon="mdi-plus"></v-icon
                  ></v-btn>
                </v-card-title>

                <v-table height="35vh" fixed-header>
                  <thead>
                    <tr>
                      <th class="text-left" width="300">异常</th>
                      <th class="text-left" width="300">所属组织</th>
                      <th class="text-left" width="300">项目名</th>
                      <th class="text-left" width="300">进度</th>
                      <th class="text-right" width="300">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(p, i) of projects">
                      <td class="py-5">
                        <v-select
                          v-model="p.exception"
                          :items="[
                            { label: '无', value: undefined },
                            { label: '失败/放弃', value: 'failed' },
                            { label: '搁置/卡住/暂停', value: 'stucked' },
                          ]"
                          item-title="label"
                          item-value="value"
                          single-line
                          :hide-details="true"
                        ></v-select>
                      </td>
                      <td>
                        <v-text-field v-model="p.org" :hide-details="true"></v-text-field>
                      </td>
                      <td>
                        <v-text-field v-model="p.project" :hide-details="true"></v-text-field>
                      </td>
                      <td>
                        <v-slider
                          v-model="p.progress"
                          :max="1"
                          :min="0"
                          :step="0.01"
                          thumb-label
                          :hide-details="true"
                        ></v-slider>
                      </td>
                      <td class="text-right">
                        <v-btn
                          icon="mdi-menu-up-outline"
                          size="small"
                          class="mr-3"
                          @click="handleMoveUp('p', i)"
                        ></v-btn>
                        <v-btn
                          icon="mdi-menu-down-outline"
                          size="small"
                          class="mr-3"
                          @click="handleMoveDown('p', i)"
                        ></v-btn>
                        <v-btn
                          icon="mdi-delete-outline"
                          size="small"
                          color="red"
                          @click="handleDelete('p', i)"
                        ></v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card>

              <v-card class="px-4 py-4 mb-4">
                <v-card-title
                  >事件
                  <v-btn class="ml-3" @click="handleAdd('e')"
                    ><v-icon icon="mdi-plus"></v-icon
                  ></v-btn>
                </v-card-title>

                <v-table height="35vh" fixed-header>
                  <thead>
                    <tr>
                      <th class="text-left" width="300">状态</th>
                      <th class="text-left" width="500">事件概要</th>
                      <th class="text-right" width="300">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(e, i) of events">
                      <td class="py-5">
                        <v-select
                          v-model="e.state"
                          :items="[
                            { label: '紧急', value: 'worried' },
                            { label: '不太紧急', value: 'non-worried' },
                            { label: '有疑惑', value: 'confused' },
                            { label: '完成', value: 'ok' },
                          ]"
                          item-title="label"
                          item-value="value"
                          single-line
                          :hide-details="true"
                        ></v-select>
                      </td>
                      <td>
                        <v-textarea v-model="e.body" auto-grow :hide-details="true"></v-textarea>
                      </td>
                      <td class="text-right">
                        <v-btn
                          icon="mdi-menu-up-outline"
                          size="small"
                          class="mr-3"
                          @click="handleMoveUp('e', i)"
                        ></v-btn>
                        <v-btn
                          icon="mdi-menu-down-outline"
                          size="small"
                          class="mr-3"
                          @click="handleMoveDown('e', i)"
                        ></v-btn>
                        <v-btn
                          icon="mdi-delete-outline"
                          size="small"
                          color="red"
                          @click="handleDelete('e', i)"
                        ></v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card>

              <v-card class="px-4 py-4 mb-4">
                <v-card-title>主题</v-card-title>
                <v-btn-toggle
                  v-model="useCustomTheme().value"
                  :color="useCustomTheme().now('bg-main-reverse')"
                  mandatory
                  divided
                >
                  <v-btn v-for="o of useCustomTheme().options" :value="o">
                    {{ o }}
                  </v-btn>
                </v-btn-toggle>
              </v-card>

              <v-btn title="导出" class="mr-4" @click="handleOutputOption"
                ><v-icon icon="mdi-export"></v-icon
              ></v-btn>

              <v-btn title="导入" @click="handleInputOption"
                ><v-icon icon="mdi-import"></v-icon
              ></v-btn>
            </template>
            <template v-else> 请您先全屏化窗口再操作！ </template>
          </div>
        </template>

        <template v-if="activeName == 'about'">
          <div class="px-10 py-10">
            <v-card class="mb-4">
              <v-img
                src="https://i1.hdslb.com/bfs/activity-plat/static/0977767b2e79d8ad0a36a731068a83d7/1sz3p8w2Sk.png"
                height="300"
                cover
              ></v-img>

              <div class="px-4 py-4">
                <v-card-title>工作日志美化器</v-card-title>
                <v-card-subtitle>v1.2.0 | 2025-05-08</v-card-subtitle>
                <v-card-text>
                  <p>一个 <b>Penyo/杏仁鹿</b> 的作品。</p>
                  <p><i>“这个世界，果然还是没有形式主义更好呢~“</i></p>
                </v-card-text>
              </div>
            </v-card>

            <v-list>
              <v-list-subheader>与开发者联系</v-list-subheader>

              <v-list-item
                v-for="i of [
                  {
                    text: 'GitHub',
                    icon: 'mdi-github',
                    action: () => visit('https://github.com/wpy030414'),
                  },
                  {
                    text: '电子邮件',
                    icon: 'mdi-email',
                    action: () => visit('mailto:penyoofficial@outlook.com'),
                  },
                ]"
                color="primary"
                @click="i.action"
              >
                <template v-slot:prepend>
                  <v-icon :icon="i.icon"></v-icon>
                </template>

                <v-list-item-title v-text="i.text"></v-list-item-title>
              </v-list-item>
            </v-list>
          </div>
        </template>
      </v-main>

      <v-bottom-navigation
        v-model="activeName"
        :bg-color="useCustomTheme().now('bg-main')"
        :color="useCustomTheme().now('t-main')"
        mode="shift"
        mandatory="force"
      >
        <v-btn value="render">
          <v-icon icon="mdi-television"></v-icon>

          <span>渲染</span>
        </v-btn>

        <v-btn value="options">
          <v-icon icon="mdi-cog"></v-icon>

          <span>配置</span>
        </v-btn>

        <v-btn value="about">
          <v-icon icon="mdi-information-outline"></v-icon>

          <span>关于</span>
        </v-btn>
      </v-bottom-navigation>
    </v-app>
  </v-responsive>

  <v-snackbar-queue v-model="useMessage().value"></v-snackbar-queue>
</template>

<style scoped>
#preview {
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
</style>
