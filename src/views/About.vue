<script setup lang="ts">
import { useCustomTheme } from '@/stores/custom-theme'
import { useMessage } from '@/stores/messages'
import { marked } from 'marked'
import { ref, watch } from 'vue'

const showLog = ref(false)

const logs = [
  {
    isBreakthrough: false,
    date: '2025-05-08',
    v: '1.2.3',
    description: `- 新增“彩蛋”，快来寻找吧！
- 新增“麦秆黄”主题
- 调整配置表格渲染方式`,
  },
  {
    isBreakthrough: false,
    date: '2025-05-08',
    v: '1.2.2',
    description: `- 优化了状态中心设计
- 使用路由代替组件插槽
- 内置了更新日志`,
  },
  {
    isBreakthrough: false,
    date: '2025-05-08',
    v: '1.2.1',
    description: `- 优化了界面布局`,
  },
  {
    isBreakthrough: true,
    date: '2025-05-08',
    v: '1.2.0',
    description: `- 使用 Vuetify 重构项目`,
  },
  {
    isBreakthrough: true,
    date: '2025-05-07',
    v: '1.1.0',
    description: `- 新增主题系统`,
  },
  {
    isBreakthrough: false,
    date: '2025-04-09',
    v: '1.0.8',
    description: `- 支持 TLS 加密通讯`,
  },
  {
    isBreakthrough: false,
    date: '2025-04-09',
    v: '1.0.7',
    description: `- 修改不安全上下文提醒的出现方式`,
  },
  {
    isBreakthrough: false,
    date: '2025-04-07',
    v: '1.0.6',
    description: `- 支持在事件中直接编写 Markdown`,
  },
  {
    isBreakthrough: false,
    date: '2025-04-07',
    v: '1.0.5',
    description: `- 允许用户导出日志为 JSON、导入 JSON 日志`,
  },
  {
    isBreakthrough: false,
    date: '2025-04-01',
    v: '1.0.4',
    description: `- 支持在事件中直接编写 Markdown`,
  },
  {
    isBreakthrough: false,
    date: '2025-04-01',
    v: '1.0.3',
    description: `- 支持直接在应用内编辑日志`,
  },
  {
    isBreakthrough: false,
    date: '2025-03-28',
    v: '1.0.2',
    description: `- 支持将日志图片复制到剪切板`,
  },
  {
    isBreakthrough: false,
    date: '2025-03-28',
    v: '1.0.1',
    description: `- 支持保存日志为图片`,
  },
  {
    isBreakthrough: true,
    date: '2025-03-12',
    v: '1.0.0',
    description: `- 正式版发布，欢迎使用！
- 抽取了类型定义`,
  },
  {
    isBreakthrough: false,
    date: '2025-03-12',
    v: 'INDEV-0.0.1',
    description: `- 现在项目/事件可以被手动高亮了
- 抽取了主题定义`,
  },
  {
    isBreakthrough: true,
    date: '2025-03-05',
    v: 'INDEV-0.0.0',
    description: `- 首次带来工作日志美化器，欢迎体验！`,
  },
]

function visit(url: string) {
  const a = document.createElement('a')
  a.href = url
  a.target = '_blank'
  a.click()
  a.remove()
}

const knockCounter = ref(0)
const showEasterEgg = ref(false)

watch(knockCounter, (nv) => {
  if (nv > 8) {
    useMessage().warning('（笼子已经打开过了）')
  } else if (nv == 8) {
    useMessage().success('“嗷呜！”（猛猫出笼）')
    showEasterEgg.value = true
  } else if (nv >= 5) {
    useMessage().info(`再点击${8 - nv}次说不定会发生奇妙的事情呢？`)
  }
})

const flirtCounter = ref(0)

function flirt() {
  if (flirtCounter.value > 6) {
    useMessage().error('（猫猫已经不在这里了）')
    return
  } else if (flirtCounter.value > 5) {
    useMessage().warning('（猫猫飞也似地逃走了！）')
  } else {
    const l = [
      '（猫猫拨弄了你一下）',
      '（猫猫愣住了！）',
      '（猫猫朝你哈气了！）',
      '（猫猫扭头看了你一眼）',
    ]
    useMessage().info(l[Math.floor(Math.random() * l.length)])
  }
  flirtCounter.value++
}
</script>

<template>
  <div class="px-10 py-10">
    <v-card class="mb-4">
      <v-img src="background.png" height="300" cover @click="knockCounter++"></v-img>

      <div class="px-4 py-4">
        <v-card-title>工作日志美化器</v-card-title>
        <v-card-subtitle>v{{ logs[0].v }} | {{ logs[0].date }}</v-card-subtitle>
        <v-card-text>
          <p>一个 <b>Penyo/杏仁鹿</b> 的作品。</p>
          <p><i>“这个世界，果然还是没有形式主义更好呢~“</i></p>
        </v-card-text>
      </div>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn @click="showLog = !showLog">{{ showLog ? '收起' : '展开更新日志' }}</v-btn>
      </v-card-actions>

      <v-expand-transition>
        <div v-show="showLog">
          <v-divider></v-divider>

          <v-timeline side="end">
            <v-timeline-item
              v-for="(log, i) of logs"
              :dot-color="
                !i
                  ? useCustomTheme().now('bg-main-reverse')
                  : log.isBreakthrough
                    ? useCustomTheme().now('bg-sub')
                    : useCustomTheme().now('bg-main')
              "
              size="small"
            >
              <template v-slot:opposite>
                <p class="mr-4 text-grey">{{ log.date }}</p>
              </template>
              <div>
                <strong>{{ log.v }}</strong>
                <div class="text-caption" v-html="marked.parse(log.description)"></div>
              </div>
            </v-timeline-item>
          </v-timeline>
        </div>
      </v-expand-transition>
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

    <v-list v-if="showEasterEgg">
      <v-list-subheader>彩蛋</v-list-subheader>

      <v-list-item
        v-for="i of [
          {
            text: '调戏小猫',
            icon: 'mdi-cat',
            action: () => flirt(),
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

<style scoped></style>
