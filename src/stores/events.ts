import type { EventItem } from "@/types/eventItem";
import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

export const useEventStore = defineStore("events", () => {
  const events: Ref<EventItem[]> = ref([]);

  return { events };
});
