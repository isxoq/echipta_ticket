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
      <div
          style="width: 100vw; margin: 0 auto"
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

<script setup>
import {ref, onMounted} from "vue";
import stadiumSvgHtml from "@/assets/images/sectors/stadium.svg";

let selectedSector = ""
let selectedRow = ""
let selectedSeat = ""

const sectorTitle = ref(null);
const svgContent = ref(null);
const isLoading = ref(false);
const telegram = window.Telegram.WebApp
const telegramMainButton = window.Telegram.WebApp.MainButton
const selectedMatchId = new URLSearchParams(window.location.search).get('match_id')

telegramMainButton.onClick(function () {
  telegram.sendData(selectedMatchId + "-" + selectedSector + "-" + selectedRow + "-" + selectedSeat)
})

telegram.expand()

function loadSVG(svgData) {
  isLoading.value = true;
  fetch(svgData)
      .then((response) => response.text())
      .then((svgText) => {
        svgContent.value = svgText;
        // console.log(svgText)
      })
      .catch((error) => {
        console.error("Error loading SVG:", error);
      })
      .finally(function () {
        isLoading.value = false;
      });
}

function loadSVGSector(svgData) {
  isLoading.value = true;
  fetch(svgData)
      .then((response) => response.text())
      .then((svgText) => {
        svgContent.value = svgText;

        fetch("https://echipta.uz/check/seats-states?match_id="+selectedMatchId+"&sector="+selectedSector)
            .then(response => response.json()) // Parse the JSON response
            .then(data => {
              console.log(data)

              data.forEach(function (seatData) {
                let idSeat = "seat-"+seatData.row+"-"+seatData.seat
                // console.log(idSeat)

                let parentElement = document.getElementById(idSeat)

                if (parentElement){

                  var pathElements = parentElement.querySelectorAll("path");

                  // Loop through all selected path elements
                  pathElements.forEach(function(path) {
                    // Do something with each path element, for example, set its fill color
                    path.style.fill = "red"; // Change "red" to the desired fill color
                  });

                }


              })
              // Assuming data contains the required information
              // Change the background color of the element with id "seat-row-seat_number"
            })
            .catch(error => console.error('Error fetching data:', error));
        // console.log(svgText)
      })
      .catch((error) => {
        console.error("Error loading SVG:", error);
      })
      .finally(function () {
        isLoading.value = false;
      });
}

async function handleSVGClick(event) {
  // Handle SVG click events

  let target = event.target
  while (target !== null) {
    if (target.id && (target.id.includes('sector') || target.id.includes('seat'))) {
      console.log(target)
      break;
    }
    target = target.parentNode;
  }
  let eventID = target.id;

  if (eventID.includes("sector-")) {
    let sectorID = eventID.replace("sector-", "");
    sectorTitle.value = sectorID;
    selectedSector = sectorID
    console.log(sectorID);

    isLoading.value = true;

    try {
      const {default: sectorData} = await import(
          `@/assets/images/sectors/sector-${sectorID}.svg`
          );
      loadSVGSector(sectorData);




    } catch (error) {
      isLoading.value = false;
      console.error("Error loading SVG:", error);
    }
  } else {
    // Extract the id attribute value of the clicked element
    let seatID = target.getAttribute("id");
    // Do something with the id value
    if (seatID && seatID.includes("seat")) {


      const parts = seatID.split('-');

      alert("Siz tanladingiz: " + sectorTitle.value + " sektor, " + parts[1] + " qator, " + parts[2] + " joy. " + "Sotib olish uchun pastdagi sotib olish tugmasini bosing)");


      selectedRow = parts[1]
      selectedSeat = parts[2]

      telegramMainButton.isVisible = true
      telegramMainButton.text = "Sotib olish: " + sectorTitle.value + " sektor, " + parts[1] + " qator, " + parts[2] + " joy. "
    }
  }
}

function back() {
  sectorTitle.value = null;
  telegramMainButton.isVisible = false
  loadSVG(stadiumSvgHtml);
}

onMounted(() => {
  loadSVG(stadiumSvgHtml);
});
</script>
