<script setup lang="ts">
import { ref } from "vue";
import { useEventStore } from "./stores/events";
import { useProjectStore } from "./stores/projects";
import EventItem from "./components/EventItem.vue";
import ProjectItem from "./components/ProjectItem.vue";

const projects = ref(useProjectStore().projects);
const events = ref(useEventStore().events);
</script>

<template>
  <div class="root">
    <h1 v-if="projects.length">项目</h1>
    <article>
      <ProjectItem
        v-for="p in projects"
        :state="p.state"
        :org="p.org"
        :project="p.project"
        :progress="p.progress"
      />
    </article>
    <h1 v-if="events.length">事件</h1>
    <article>
      <EventItem v-for="e in events" :state="e.state">
        {{ e.body }}
      </EventItem>
    </article>
  </div>
</template>

<style scoped>
.root {
  padding: 2.4rem;
  background: var(--color-bg-main);

  & h1 {
    color: var(--color-bg-main-reverse);
  }

  & h4 {
    color: var(--color-bg-sub-reverse);
  }

  & > * {
    margin-bottom: 1rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
