import type { ProjectItem } from "@/types/projectItem";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useProjectStore = defineStore("projects", () => {
  const projects = ref<ProjectItem[]>([
  ]);

  return { projects };
});
