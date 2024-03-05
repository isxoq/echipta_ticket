<template>
    <div class="loading-container">

        <div class="loading-overlay" v-show="isLoading">
            <div class="loading-spinner"></div>
            <div class="loading-text">Yuklanmoqda...</div>
        </div>

        <div class="navigation-header">
            <button v-if="sectorTitle" class="back-button" @click="back">Orqaga</button>
            <div class="sector-title">Sektor: {{ sectorTitle }}</div>
        </div>

        <br>
        <!-- Your content goes here -->
        <div class="main-content">
            <div style="width: 70vw" v-html="svgContent" @click="handleSVGClick"></div>
        </div>
    </div>
</template>


<script>


import stadiumSvgHtml from '@/assets/images/stadium.svg'

export default {
    // Component logic

    data() {
        return {
            sectorTitle: null,
            svgContent: null,
            isLoading: false
        };
    },
    mounted() {
        this.loadSVG(stadiumSvgHtml);
    },
    methods: {
        loadSVG(svgData) {

            this.isLoading = true
            self = this
            fetch(svgData)
                .then(response => response.text())
                .then(svgText => {
                    this.svgContent = svgText;
                    // console.log(svgText)
                })
                .catch(error => {
                    console.error('Error loading SVG:', error);
                })
                .finally(function () {
                    self.isLoading = false
                });
        },
        async handleSVGClick(event) {
            // Handle SVG click events

            let eventID = event.target.id;

            if (eventID.includes("sector-")) {

                let sectorID = eventID.replace("sector-", "");
                this.sectorTitle = sectorID
                if (sectorID === "1a" || sectorID === "1b" || sectorID === "vip") {
                    console.log(sectorID)
                } else {
                    console.log(sectorID)

                    this.isLoading = true

                    try {
                        const {default: sectorData} = await import(`@/assets/images/sectors/sector-${sectorID}.svg`);
                        this.loadSVG(sectorData)
                    } catch (error) {
                        this.isLoading = false
                        console.error('Error loading SVG:', error);
                    }
                }


            } else {

                // Extract the id attribute value of the clicked element
                let seatID = event.target.closest('g').getAttribute('id');
                // Do something with the id value
                if (seatID && seatID.includes("seat")){
                    alert("Tanlangam: "+seatID)
                }
            }
        },

        back(){
            this.sectorTitle = null;
            this.loadSVG(stadiumSvgHtml);

        }
    }

};
</script>
