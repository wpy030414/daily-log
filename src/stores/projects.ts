import type { ProjectItem } from "@/types/projectItem";
import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

export const useProjectStore = defineStore("projects", () => {
  const projects: Ref<ProjectItem[]> = ref([]);

  return { projects };
});
