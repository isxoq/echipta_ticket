<template>
  <div class="loading-container">
    <div class="loading-overlay" v-show="isLoading">
      <div class="loading-spinner"></div>
      <div class="loading-text">Yuklanmoqda...</div>
    </div>

    <!-- Your content goes here -->
    <div class="main-content">
      <div class="main-content__title">
        <button class="back-button" v-if="sectorTitle" @click="back">
          Orqaga
        </button>

        {{ sectorTitle ? sectorTitle + "- SEKTOR" : "Bobur Arena" }}
      </div>
      <div class="ticket-cost" v-if="sectorTitle">
        <div class="ticket-cost__title">CHIPTALAR NARXI:</div>
        <div class="ticket-cost__count">50 000 SO'M</div>
      </div>
      <div
        style="width: 90vw; margin: 0 auto"
        v-html="svgContent"
        @click="handleSVGClick"
      ></div>
      <div v-if="sectorTitle" class="main-content__sector">
        <div class="sector-wrap">
          <div class="sector-square square-3"></div>
          <div class="sector-title">Bo'sh joylar</div>
        </div>
        <div class="sector-wrap">
          <div class="sector-square square-4"></div>
          <div class="sector-title">Band joylar</div>
        </div>
      </div>
      <div class="main-content__sector" v-else>
        <div class="sector-wrap">
          <div class="sector-square square-1"></div>
          <div class="sector-title">VIP sektor</div>
        </div>
        <div class="sector-wrap">
          <div class="sector-square square-2"></div>
          <div class="sector-title">CIP sektor</div>
        </div>
        <div class="sector-wrap">
          <div class="sector-square square-3"></div>
          <div class="sector-title">1-toifa</div>
        </div>
        <div class="sector-wrap">
          <div class="sector-square square-4"></div>
          <div class="sector-title">Raqib fan</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import stadiumSvgHtml from "@/assets/images/stadium.svg";

export default {
  // Component logic

  data() {
    return {
      sectorTitle: null,
      svgContent: null,
      isLoading: false,
    };
  },
  mounted() {
    this.loadSVG(stadiumSvgHtml);
  },
  methods: {
    loadSVG(svgData) {
      this.isLoading = true;
      self = this;
      fetch(svgData)
        .then((response) => response.text())
        .then((svgText) => {
          this.svgContent = svgText;
          // console.log(svgText)
        })
        .catch((error) => {
          console.error("Error loading SVG:", error);
        })
        .finally(function () {
          self.isLoading = false;
        });
    },
    async handleSVGClick(event) {
      // Handle SVG click events

      let eventID = event.target.id;

      if (eventID.includes("sector-")) {
        let sectorID = eventID.replace("sector-", "");
        this.sectorTitle = sectorID;
        if (sectorID === "1a" || sectorID === "1b" || sectorID === "vip") {
          console.log(sectorID);
        } else {
          console.log(sectorID);

          this.isLoading = true;

          try {
            const { default: sectorData } = await import(
              `@/assets/images/sectors/sector-${sectorID}.svg`
            );
            this.loadSVG(sectorData);
          } catch (error) {
            this.isLoading = false;
            console.error("Error loading SVG:", error);
          }
        }
      } else {
        // Extract the id attribute value of the clicked element
        let seatID = event.target.closest("g").getAttribute("id");
        // Do something with the id value
        if (seatID && seatID.includes("seat")) {
          alert("Tanlangam: " + seatID);
        }
      }
    },

    back() {
      this.sectorTitle = null;
      this.loadSVG(stadiumSvgHtml);
    },
  },
};
</script>
