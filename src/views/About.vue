<script setup lang="ts">
import { useCustomTheme } from '@/stores/custom-theme'
import { useMessage } from '@/stores/messages'
import { marked } from 'marked'
import { ref, watch } from 'vue'

const showLog = ref(true)

const logs = [
  {
    isBreakthrough: false,
    date: '2025-05-15',
    v: '1.3.2',
    description: `- 支持 Mermaid 和 KaTex 渲染`,
  },
  {
    isBreakthrough: false,
    date: '2025-05-13',
    v: '1.3.1',
    description: `- 允许用户自定义页脚图片`,
  },
  {
    isBreakthrough: true,
    date: '2025-05-09',
    v: '1.3.0',
    description: `- 日志增加自定义页脚，“项目”新增“剩余日”维度`,
  },
  {
    isBreakthrough: false,
    date: '2025-05-08',
    v: '1.2.3',
    description: `- 新增“彩蛋”，快来寻找吧！`,
  },
  {
    isBreakthrough: false,
    date: '2025-05-08',
    v: '1.2.2',
    description: `- 使用路由代替组件插槽`,
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
    description: `- 正式版发布，欢迎使用！`,
  },
  {
    isBreakthrough: false,
    date: '2025-03-12',
    v: 'INDEV-0.0.1',
    description: `- 现在“项目/事件”可以被手动高亮了`,
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

const knockCounter = ref({
  value: 0,
  trigger: 8,
  preTrigger: 5,
})

const showEasterEgg = ref(false)

watch(knockCounter.value, (nv) => {
  if (nv.value == knockCounter.value.trigger) {
    showEasterEgg.value = true
    useMessage().success('“嗷呜！”（猛猫降临）')
  } else if (nv.value >= knockCounter.value.preTrigger) {
    useMessage().info(`再点击${knockCounter.value.trigger - nv.value}次说不定会发生奇妙的事情呢？`)
  }
})

const flirtCounter = ref({
  value: 0,
  trigger: 6,
  preTrigger: 5,
})

function flirt() {
  if (flirtCounter.value.value > flirtCounter.value.trigger) {
    useMessage().error('（猫猫已经不在这里了）')
    return
  } else if (flirtCounter.value.value > flirtCounter.value.preTrigger) {
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
  flirtCounter.value.value++
}

const showMysteriousDialog = ref(false)
const code = ref()

watch(showMysteriousDialog, (nv) => {
  if (!nv) {
    code.value = undefined
  }
})

function findMyCat() {
  if (code.value != 114514) {
    useMessage().error('啊哦，好像不对耶！再试试别的吧~')
    return
  }
  flirtCounter.value.value = 0
  showMysteriousDialog.value = false
  useMessage().success('“嗷呜！”（猛猫再次降临）')
}
</script>

<template>
  <v-navigation-drawer v-if="showLog" :width="500">
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
  </v-navigation-drawer>

  <div class="px-10 py-10">
    <v-card class="mb-4">
      <v-img ref="picture" src="background.png" height="300" cover>
        <v-toolbar color="transparent">
          <template v-slot:prepend>
            <v-btn icon="mdi-menu" @click="showLog = !showLog"></v-btn>
          </template>

          <template v-slot:append>
            <v-btn v-if="knockCounter.value < knockCounter.trigger" @click="knockCounter.value++"
              >召唤神兽</v-btn
            >
          </template>
        </v-toolbar>
      </v-img>

      <div class="px-4 py-4">
        <v-card-title>工作日志美化器</v-card-title>
        <v-card-subtitle>v{{ logs[0].v }} | {{ logs[0].date }}</v-card-subtitle>
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

    <v-list v-if="showEasterEgg">
      <v-list-subheader>彩蛋</v-list-subheader>

      <v-list-item
        v-for="i of [
          [
            {
              text: '调戏小猫',
              icon: 'mdi-cat',
              action: flirt,
            },
            {
              text: '寻找小猫',
              icon: 'mdi-magnify',
              action: () => (showMysteriousDialog = true),
            },
          ][Number(flirtCounter.value > flirtCounter.trigger)],
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

  <v-dialog v-model="showMysteriousDialog" max-width="600" persistent>
    <v-form validate-on="blur" @submit.prevent="findMyCat">
      <v-card title="据说只要输入神奇的代码就能找到丢失的猫猫？">
        <v-otp-input v-model="code" length="6"></v-otp-input>
        <template v-slot:actions>
          <v-spacer></v-spacer>

          <v-btn @click="showMysteriousDialog = false"> 先容我想想 </v-btn>

          <v-btn type="submit"> 验证 </v-btn>
        </template>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<style scoped></style>
