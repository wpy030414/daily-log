<script setup lang="ts">
import { useEvent } from '@/stores/events'
import { useMessage } from '@/stores/messages'
import { useProject } from '@/stores/projects'
import { useCustomTheme } from '@/stores/custom-theme'
import { downloadInBrowser, uploadInBrowser } from '@/utils'
import {
  mdiDeleteOutline,
  mdiExport,
  mdiImport,
  mdiMenuDownOutline,
  mdiMenuUpOutline,
  mdiPlus,
} from '@mdi/js'
import { useTheme } from 'vuetify'

function handleAdd(objType: 'p' | 'e') {
  if (objType === 'p') {
    useProject().value.push({
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
    `工作日报快照-${Date.now()}.json`,
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

function handleUpdateImage(file: File | File[]) {
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    useCustomTheme().bgi = (e.target as FileReader).result
  }
  reader.readAsDataURL(file as Blob)
}
</script>

<template>
  <div class="px-10 py-10">
    <v-card class="px-4 py-4 mb-4">
      <v-card-title>外观</v-card-title>

      <v-row class="mx-4 mt-2 mb-4">
        <v-switch
          v-model="useCustomTheme().isDark"
          color="primary"
          class="mr-10"
          label="启用暗黑模式"
          hide-details
        ></v-switch>

        <v-switch
          v-model="useCustomTheme().enableGlassmorphism"
          color="primary"
          class="mr-10"
          label="启用毛玻璃效果"
          hide-details
        ></v-switch>

        <v-switch
          v-model="useCustomTheme().enableBackgroundImage"
          color="primary"
          label="启用背景图片"
          hide-details
        ></v-switch>

        <v-file-input
          v-if="useCustomTheme().enableBackgroundImage"
          v-on:update:model-value="handleUpdateImage"
          color="primary"
          accept="image/*"
          max-width="300"
          label="替换背景图片"
          hide-details
        ></v-file-input>
      </v-row>
    </v-card>

    <v-card class="px-4 py-4 mb-4">
      <v-card-title>
        项目

        <v-btn color="primary" class="ml-3" :icon="mdiPlus" @click="handleAdd('p')"></v-btn>
      </v-card-title>

      <v-table height="45vh" fixed-header>
        <thead>
          <tr>
            <th class="text-left" width="200">异常</th>

            <th class="text-left" width="200">项目名</th>

            <th class="text-left">所属组织</th>

            <th class="text-left" width="150">进度</th>

            <th class="text-left" width="100">推进</th>

            <th class="text-right" width="200">操作</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(p, i) of useProject().value">
            <td class="py-5">
              <v-select
                v-model="p.exception"
                color="primary"
                :items="[
                  { label: '失败/放弃', value: 'failed' },
                  { label: '搁置/卡住/暂停', value: 'stucked' },
                ]"
                item-title="label"
                item-value="value"
                :clearable="true"
                placeholder="无"
                single-line
                hide-details
              ></v-select>
            </td>

            <td>
              <v-text-field v-model="p.project" color="primary" hide-details></v-text-field>
            </td>

            <td>
              <v-text-field v-model="p.org" color="primary" hide-details></v-text-field>
            </td>

            <td>
              <v-slider
                v-model="p.progress"
                color="primary"
                :max="100"
                :min="0"
                :step="0.01"
                thumb-label
                hide-details
              >
                <template v-slot:thumb-label="{ modelValue }">
                  {{ modelValue.toFixed(0) }}%
                </template>
              </v-slider>
            </td>

            <td>
              <v-switch v-model="p.makeProgress" color="primary" hide-details> </v-switch>
            </td>

            <td class="text-right">
              <v-btn
                :icon="mdiMenuUpOutline"
                size="small"
                class="mr-3"
                @click="handleMoveUp('p', i)"
              ></v-btn>

              <v-btn
                :icon="mdiMenuDownOutline"
                size="small"
                class="mr-3"
                @click="handleMoveDown('p', i)"
              ></v-btn>

              <v-btn
                :icon="mdiDeleteOutline"
                color="red"
                size="small"
                @click="handleDelete('p', i)"
              ></v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <v-card class="px-4 py-4 mb-4">
      <v-card-title>
        事件

        <v-btn color="primary" class="ml-3" :icon="mdiPlus" @click="handleAdd('e')"></v-btn>
      </v-card-title>

      <v-table height="45vh" fixed-header>
        <thead>
          <tr>
            <th class="text-left" width="200">状态</th>

            <th class="text-left">事件概要</th>

            <th class="text-right" width="200">操作</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(e, i) of useEvent().value">
            <td class="py-5">
              <v-select
                v-model="e.state"
                color="primary"
                :items="[
                  { label: '推进', value: 'on' },
                  { label: '阻塞', value: 'blocked' },
                  { label: '完成', value: 'ok' },
                ]"
                item-title="label"
                item-value="value"
                single-line
                hide-details
              ></v-select>
            </td>

            <td>
              <v-textarea v-model="e.body" color="primary" auto-grow hide-details></v-textarea>
            </td>

            <td class="text-right">
              <v-btn
                :icon="mdiMenuUpOutline"
                size="small"
                class="mr-3"
                @click="handleMoveUp('e', i)"
              ></v-btn>

              <v-btn
                :icon="mdiMenuDownOutline"
                size="small"
                class="mr-3"
                @click="handleMoveDown('e', i)"
              ></v-btn>

              <v-btn
                :icon="mdiDeleteOutline"
                color="red"
                size="small"
                @click="handleDelete('e', i)"
              ></v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <div class="mb-4">
      <v-btn :icon="mdiExport" class="mr-4" title="导出数据" @click="handleOutputOption"></v-btn>

      <v-btn :icon="mdiImport" color="red" title="导入数据" @click="handleInputOption"></v-btn>
    </div>
  </div>
</template>

<style scoped></style>
