<script setup lang="ts">
import { ref } from "vue";
import { useEventStore } from "./stores/events";
import { useProjectStore } from "./stores/projects";
import EventItem from "./components/EventItem.vue";
import ProjectItem from "./components/ProjectItem.vue";
import html2canvas from "html2canvas";

const projects = ref(useProjectStore().projects);
const events = ref(useEventStore().events);

function shot() {
  html2canvas(document.querySelector("#c-root")!, { scale: 3 }).then(
    (canvas) => {
      const screenshotContainer = document.getElementById(
        "screenshotContainer",
      )!;
      screenshotContainer.innerHTML = "";
      screenshotContainer.appendChild(canvas);

      const dataURL = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "日志快照.png";

      link.click();
    },
  );
}
</script>

<template>
  <div id="c-root" class="root">
    <h1 v-if="projects.length">项目</h1>
    <article>
      <ProjectItem v-for="p in projects" :p="p" />
    </article>
    <h1 v-if="events.length">事件</h1>
    <article>
      <EventItem v-for="e in events" :e="e" />
    </article>
  </div>
  <button @click="shot">Shot</button>
  <canvas v-show="false" id="screenshotContainer"></canvas>
</template>

<style scoped>
.root {
  padding: 2.4rem;
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
