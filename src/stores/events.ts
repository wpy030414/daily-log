import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

export const useEventStore = defineStore("events", () => {
  const events: Ref<
    {
      state: "worried" | "non-worried" | "confused" | "ok";
      body: string;
    }[]
  > = ref([
  ]);

  return { events };
});
