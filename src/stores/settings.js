import axios from "@/plugins/api";
import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settings", {
  state: () => ({}),
  getters: {},
  actions: {
    async getCollectorList() {
      try {
        await axios.post("collector/v1/admin/collector/list").then((res) => {
          if (res.data.success) {
            this.collectorList = res.data.data.data;
          } else {
            alert("Ошибка api `collector/v1/admin/collector/list`");
          }
        });
      } catch (error) {
        alert("api collector/v1/admin/collector/list ", error);
        console.log(error);
      }
    },
  },
});
