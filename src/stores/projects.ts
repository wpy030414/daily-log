import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

export const useProjectStore = defineStore("projects", () => {
  const projects: Ref<
    {
      state?: "failed" | "stucked" | "done";
      org: string;
      project: string;
      /** [0, 1] */
      progress: number;
    }[]
  > = ref([
  ]);

  return { projects };
});
