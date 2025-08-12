<template>
  <div class="loading-container">
    <div class="loading-overlay" v-show="isLoading">
      <div class="loading-spinner"></div>
      <div class="loading-text">Yuklanmoqda...</div>
    </div>

    <!-- Your content goes here -->
    <div class="main-content">
      <div class="main-content__title" v-show="!isPanoramaOpen">
        <button class="back-button" v-if="sectorTitle" @click="back">
          Orqaga
        </button>

        {{ "BOBUR ARENA STADIONI" }}
      </div>
      <div id="iframe-container" v-show="isPanoramaOpen">
        <div id="close-btn" @click="closeIFrame">Yopish</div>
      </div>
      <div
          v-show="!isPanoramaOpen"
          style="width: 100vw; margin: 0 auto"
          v-html="svgContent"
          @click="handleSVGClick"
      ></div>
      <template v-show="!isPanoramaOpen">
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
      </template>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from "vue";
import stadiumSvgHtml from "@/assets/images/sectors/stadium.svg";

let selectedSector = ""
let selectedRow = ""
let selectedSeat = ""
let isPanoramaOpen = ref(false)

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


// Function to close the iframe when the close button is clicked
function closeIFrame() {
  isPanoramaOpen.value = false
}

// Function to load the iframe when the button is clicked
function loadIFrame(url) {
  let tempIframeDiv = document.getElementById("temp-iframe");
  if (tempIframeDiv !== null) {
    tempIframeDiv.remove()
  }
  isPanoramaOpen.value = true
  // Get the iframe container element
  let iframeContainer = document.getElementById("iframe-container");

  // Create an iframe element
  let iframe = document.createElement("iframe");

  // Set attributes for the iframe
  iframe.src = url; // Set the URL you want to load
  iframe.width = "100%";
  iframe.id = "temp-iframe"
  iframe.height = "100%";
  iframe.frameBorder = "0"; // Remove iframe border

  iframeContainer.appendChild(iframe);
}


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

        fetch("https://echipta.uz/check/seats-states?match_id=" + selectedMatchId + "&sector=" + selectedSector)
            .then(response => response.json()) // Parse the JSON response
            .then(data => {
              console.log(data)

              data.forEach(function (seatData) {
                let idSeat = "seat-" + seatData.row + "-" + seatData.seat
                // console.log(idSeat)

                let parentElement = document.getElementById(idSeat)

                if (parentElement) {

                  var pathElements = parentElement.querySelectorAll("path");

                  // Loop through all selected path elements
                  pathElements.forEach(function (path) {
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

    if (sectorID == "18") {
      alert("Bu sektor faqat FAN CLUB muhlislari uchun!")
      return 1;
    }

    if (sectorID == "1" || sectorID == "1a" || sectorID == "vip" || sectorID == "21" || sectorID == "23") {
      alert("Bu joylar administrator tomonidan o'chirilgan!")
      return 1;
    }

    if (sectorID == "22") {
      alert("Bu joylar mehmonlar uchun!")
      return 1;
    }

    const blockedSectors = ['24','25','26'];

    const normalizedSectorID = sectorID.toLowerCase();

    if (blockedSectors.includes(normalizedSectorID)) {
      alert("Bu joylarni sotish administrator tomonidan o'chirilgan!");
      return 1;
    }

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
      selectedRow = parts[1]
      selectedSeat = parts[2]
      if (selectedSector == "vip" && (selectedRow == "8" || selectedRow == "9")) {
        alert("Bu joylarni sotib olish mumkin emas!")
        return 1;
      }

      const sector = selectedSector.toLowerCase();
      const row = parseInt(selectedRow);

      // if ((sector === '1' || sector === '1a') && row >= 1 && row <= 10) {
      //   alert("Ushbu joylarni sotib bo'lmaydi!")
      //   return
      // }


      alert("Siz tanladingiz: " + sectorTitle.value + " sektor, " + parts[1] + " qator, " + parts[2] + " joy. " + "Sotib olish uchun pastdagi sotib olish tugmasini bosing)");


      loadIFrame("https://cdn.pannellum.org/2.5/pannellum.htm#panorama=https://api.echipta.uz/360/" + sectorTitle.value.toUpperCase() + "/" + selectedRow + "/" + selectedSeat + ".jpg&title=" + sectorTitle.value.toUpperCase() + "-" + selectedRow + "-" + selectedSeat + "&author=Joydan vizual ko'rinish&autoLoad=true")

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
