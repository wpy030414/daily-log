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
    <div v-if="projects.length">
      <h1>项目</h1>
      <article>
        <ProjectItem
          v-for="p in projects"
          :state="p.state"
          :org="p.org"
          :project="p.project"
          :progress="p.progress"
        />
      </article>
    </div>
    <div v-if="events.length">
      <h1>事件</h1>
      <article>
        <EventItem v-for="e in events" :state="e.state">
          {{ e.body }}
        </EventItem>
      </article>
    </div>
  </div>
</template>

<style scoped>
.root {
  padding: 2.4rem;
  background: #e0e9f9;

  & h1 {
    color: #24569f;
  }

  & h4 {
    color: #24559f77;
  }

  & > * {
    margin-bottom: 1rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
