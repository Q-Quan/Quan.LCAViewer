<script setup lang="ts">
import { ref, computed, type Ref, toRefs, watch, onMounted, type ComputedRef } from 'vue'
import { capitalize } from 'lodash';
import { type LcaMetadata } from "@/LcaMetadata";

import Chart from 'chart.js/auto';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, type ChartOptions, type Plugin } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
Chart.defaults.font.family = "'CMU Bright', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";
Chart.defaults.color = "black";

import pattern from 'patternomaly';
import { Bar } from 'vue-chartjs';


const props = defineProps<{
  metadata: LcaMetadata,
  title: string,
  ylabel: string,
  ylim: number,
  data: [],
  sort: "byAlternative" | "byYear",
  chartKey: string
}>()

const { metadata, title, ylabel, ylim, data, sort } = toRefs(props);

const chartDataTest = ref({
  labels: ['January', 'February', 'March'],
  datasets: [{ data: [40, 20, 12], label: "Dataset1" }, { data: [20, 10, 6], label: "Dataset1" }]
});

const getColorOrPatternWithOpacity = (hex: string, alpha: number) => {
  const hasPattern = hex.endsWith("*");
  const colorWithOpacity = `${hex.split("*")[0]}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
  if (hasPattern) {
    return pattern.draw('diagonal-right-left', colorWithOpacity);

  } else {
    return colorWithOpacity;
  }
}

function getFriendlyTitle(x: string) {
  return (metadata.value.shortLabels as any)[x] || capitalize(x.split(" | ")[1]);
}

const chartData = computed(() => {
  let result: any = {};
  let years = [... new Set(data.value.filter(x => x["visible"]).map(x => x["year"]))];
  let alternativeKeys = [... new Set(data.value.filter(x => x["visible"]).map(x => x["key"]))];
  let alternativeTitles = [... new Set(data.value.filter(x => x["visible"]).map(x => x["title"]))];
  let alternativeColors = alternativeKeys.map(x => metadata.value.colors[x] || "#FFB81C");
  if (sort.value == "byAlternative") {
    result = {
      labels: alternativeTitles,
      datasets: years.map((year, yearIndex) => {
        const opacity = 1 - 0.5 * (yearIndex / (years.length - 1));
        return {
          data: data.value.filter(x => x["visible"]).filter(theData => theData["year"] == year).map(theData => theData["value"]),
          label: year,
          legendBackgroundColor: getColorOrPatternWithOpacity(metadata.value.colors.yearLegend, opacity),
          backgroundColor: function (context: any) {
            const color = alternativeColors[context.dataIndex];
            return getColorOrPatternWithOpacity(color, opacity);
          }
        }
      })
    };
  } else {
    result = {
      labels: years,
      datasets: alternativeKeys.map((alternativeKey, alternativeIndex) => {
        return {
          data: data.value.filter(x => x["visible"]).filter(theData => theData["key"] == alternativeKey).map(theData => theData["value"]),
          label: getFriendlyTitle(alternativeKey),
          backgroundColor: function (context: any) {
            const color = alternativeColors[alternativeIndex];
            return getColorOrPatternWithOpacity(color, 1);
          }
        }
      })
    }
  }
  return result;
});

function getChartOptions(forInModal: boolean): ChartOptions<"bar"> {
  let labelKey = (sort.value == "byAlternative") ? "title" : "year";
  let chartLabels = [... new Set(data.value.filter(x => x["visible"]).map(x => x[labelKey]))];
  return {
    responsive: true,
    aspectRatio: 1.5,
    animation: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    /* animations: {
      colors: false,
      x: false
    },
    transitions: {
      active: {
        animation: {
          duration: 0
        }
      }
    }, */
    scales: {
      x: {
        type: 'category',
        position: 'bottom',
        labels: chartLabels,
        ticks: {
          //display: false,,
          font: {
            size: forInModal ? 16 : undefined
          }
        },
      },
      y: {
        ticks: {
          callback: (val: number | string) => ((val as number).toExponential()),
          font: {
            size: forInModal ? 16 : undefined
          }
        },
        title: {
          text: ylabel.value,
          display: true,
          font: {
            size: forInModal ? 16 : undefined
          }
        },
        max: ylim.value > 0 ? ylim.value : undefined
      }
    }
  }
}


const chartElement = ref(null);

// Set legend colors
const chartPlugins: ComputedRef<Plugin<"bar">[]> = computed(() => {
  if (sort.value == "byAlternative") {
    return [{
      id: "0",
      beforeDraw: function (chart: Chart) {
        chart.config.data.datasets.forEach((dataset, i) => {
          // @ts-ignore
          let legendBackgroundColor = dataset["legendBackgroundColor"]
          if (chart.legend && chart.legend.legendItems && legendBackgroundColor) {
            chart.legend.legendItems[i].fillStyle = legendBackgroundColor;
          }
        });
      }
    }]
  } else {
    return []
  }
}) as ComputedRef<Plugin<"bar">[]>;

// Update chart on font load
document.fonts.addEventListener("loadingdone", () => {
    if (chartElement.value) {
      const theChart = (chartElement.value["chart"] as Chart);
      theChart.update();
    }
});

</script>

<template>
  <div class="characterisation-chart">
    <div class="row gx-1">
      <div class="col">
        <h6>
          {{ title }}
        </h6>
      </div>
      <div class="col-auto">
        <div class="btn-group">
          <div class="btn btn-link btn-sm" title="Enlarge" data-bs-toggle="modal" :data-bs-target="'#chart-modal-' + chartKey">
            <i class="fa-sharp fa-solid fa-up-right-and-down-left-from-center"></i>
          </div>
        </div>
      </div>
    </div>
    <Bar ref="chartElement" :options="getChartOptions(false)" :data="chartData" :plugins="chartPlugins" />
    <div class="modal modal-lg" tabindex="-1" :id="'chart-modal-' + chartKey">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <Bar ref="modalChartElement" :options="getChartOptions(true)" :data="chartData" :plugins="chartPlugins" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-link {
  padding-top: 0;
  padding-bottom: 0;
  padding-right: 0;
  margin-top: -3px;
}

.row {
  align-items: top;
}
</style>
