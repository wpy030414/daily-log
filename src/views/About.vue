<script setup lang="ts">
import { useMessage } from '@/stores/messages'
import { mdiCat, mdiEmail, mdiGithub, mdiMagnify, mdiMenu } from '@mdi/js'
import { ref, watch } from 'vue'

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
  <div class="px-10 py-10">
    <v-card class="mb-4">
      <v-img
        ref="picture"
        src="https://user-assets.sxlcdn.com/images/64283/FtogK7haNdITcMXanQNgWRj9bdbV.png"
        height="300"
        cover
      >
        <v-toolbar color="transparent">
          <template v-slot:prepend>
            <v-btn :icon="mdiMenu"></v-btn>
          </template>

          <template v-slot:append>
            <v-btn v-if="knockCounter.value < knockCounter.trigger" @click="knockCounter.value++"
              >召唤神兽</v-btn
            >
          </template>
        </v-toolbar>
      </v-img>

      <div class="px-4 py-4">
        <v-card-title>工作日报</v-card-title>

        <v-card-subtitle>v1.5.1</v-card-subtitle>

        <v-card-text>
          <p>一个 <b>Penyo</b> 的作品。</p>

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
            icon: mdiGithub,
            action: () => visit('https://github.com/wpy030414'),
          },
          {
            text: '电子邮件',
            icon: mdiEmail,
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
              icon: mdiCat,
              action: flirt,
            },
            {
              text: '寻找小猫',
              icon: mdiMagnify,
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

          <v-btn @click="showMysteriousDialog = false">先容我想想</v-btn>

          <v-btn color="primary" type="submit">验证</v-btn>
        </template>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<style scoped></style>
