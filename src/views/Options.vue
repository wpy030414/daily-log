<script setup lang="ts">
import { useEvent } from '@/stores/events'
import { useMessage } from '@/stores/messages'
import { useProject } from '@/stores/projects'
import { useCustomTheme } from '@/stores/custom-theme'
import { downloadInBrowser, uploadInBrowser } from '@/utils'
import { useWidthRate } from '@/stores/width-rate'

function handleAdd(objType: 'p' | 'e') {
  if (objType === 'p') {
    useProject().value.push({
      exception: undefined,
      org: '罗德岛',
      project: '源石计划',
      progress: 0,
    })
    return
  } else if (objType === 'e') {
    useEvent().value.push({
      state: 'ok',
      body: '关闭全舰防御系统。',
    })
    return
  }
}

function handleMoveUp(objType: 'p' | 'e', index: number) {
  let objList
  if (objType === 'p') {
    objList = useProject().value
  } else if (objType === 'e') {
    objList = useEvent().value
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
    objList = useProject().value
  } else if (objType === 'e') {
    objList = useEvent().value
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
    objList = useProject().value
  } else if (objType === 'e') {
    objList = useEvent().value
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
          projects: useProject().value,
          events: useEvent().value,
        }),
      ),
    `日志快照-${Date.now()}.json`,
  )
}

async function handleInputOption() {
  const result = (await uploadInBrowser()) as any
  if (result) {
    useProject().value = result.projects
    useEvent().value = result.events
    useMessage().success('导入成功！')
  } else {
    useMessage().info('您取消了操作。')
  }
}
</script>

<template>
  <div class="px-10 py-10">
    <template v-if="useWidthRate().value > 0.9">
      <v-card class="px-4 py-4 mb-4">
        <v-card-title
          >项目
          <v-btn class="ml-3" @click="handleAdd('p')"><v-icon icon="mdi-plus"></v-icon></v-btn>
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
            <tr v-for="(p, i) of useProject().value">
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
          <v-btn class="ml-3" @click="handleAdd('e')"><v-icon icon="mdi-plus"></v-icon></v-btn>
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
            <tr v-for="(e, i) of useEvent().value">
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

      <v-btn title="导入" @click="handleInputOption"><v-icon icon="mdi-import"></v-icon></v-btn>
    </template>
    <template v-else> 请您先全屏化窗口再操作！ </template>
  </div>
</template>

<style scoped></style>
