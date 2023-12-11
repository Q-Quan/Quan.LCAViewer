<script setup lang="ts">
import { ref, computed, type Ref } from 'vue'
import { capitalize } from 'lodash';

import pattern from 'patternomaly';

import TheHeader from './TheHeader.vue'
import TheFooter from './TheFooter.vue'
import CharacterisationChart from './CharacterisationChart.vue'
import ChartPatch from './ChartPatch.vue'

const metadata = (await import(`../data/metadata.json`)).default;

const scenarios = metadata.scenarios;
const allScenarioKeys = Object.keys(scenarios);
const currentScenarioKey = ref(metadata.defaultScenario);

const sortCharts: Ref<"byYear" | "byAlternative"> = ref("byYear");
const isNormalized = ref(false);
const isNormalizedZoomed = ref(false);

function getFriendlyTitle(x: string) {
  return (metadata.shortLabels as any)[x] || capitalize(x.split(" | ")[1]);
}

function getFriendlyAxisLabel(x: string) {
  return (metadata.axisLabels as any)[x];
}

function getFriendlyAxisLim(x: string) {
  if (isNormalized.value) {
    return isNormalizedZoomed.value ? metadata.axisLimitNormalizedZoomed : metadata.axisLimitNormalized;
  }
  return -1;
}

const getColorOrPatternWithOpacity = (hex: string, alpha: number) => {
  const hasPattern = hex.endsWith("*");
  const colorWithOpacity = `${hex.split("*")[0]}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
  if (hasPattern) {
    return pattern.draw('diagonal-right-left', colorWithOpacity);

  } else {
    return colorWithOpacity;
  }
}


// CSV data is an array of objects representing the rows of the CSV, so that each row corresponds to an alternative.
let csvDatas: {[key: string]: any} = {};
for (const scenarioKey of allScenarioKeys) {
  const filename = (scenarios as any)[scenarioKey].filename;
  csvDatas[scenarioKey] = (await import(`../data/${filename}.csv`)).default;
}

const csvData = computed(() => csvDatas[currentScenarioKey.value] );

const allImpactCategoryKeys = Object.keys((csvData.value)[0]).filter((x: string) => x.includes("|"));
const shownImpactCategoryKeys = ref(allImpactCategoryKeys);

let allAlternativeKeys: string[] = [];
let shownAlternativeKeys: Ref<string[]> = ref([]);

let allYears: string[] = [];
let shownYears: Ref<string[]> = ref([]);

const chartData = computed(() => {
  let result: { [key: string]: any } = {}
  for (const impactCategoryKey of allImpactCategoryKeys) {
    result[impactCategoryKey] = {
      "key": impactCategoryKey,
      "title": getFriendlyTitle(impactCategoryKey),
      "ylabel": getFriendlyAxisLabel(impactCategoryKey),
      "ylim": getFriendlyAxisLim(impactCategoryKey),
      "visible": shownImpactCategoryKeys.value.includes(impactCategoryKey),
      "data": csvData.value.map((x: any) => {
        const alternativeKey = x["name"];
        const year = x["database"].split("_")[1];
        return {
          "value": isNormalized.value ? x[impactCategoryKey]/(metadata.normalizationFactors as any)[impactCategoryKey] : x[impactCategoryKey],
          "key": alternativeKey,
          "title": getFriendlyTitle(alternativeKey),
          "year": year,
          "visible": shownAlternativeKeys.value.includes(alternativeKey) && shownYears.value.includes(year)
        }
      })
    }
  }
  return result;
});

allAlternativeKeys = [...new Set(chartData.value[allImpactCategoryKeys[0]]["data"].map((x: { key: string }) => x.key))] as string[];
shownAlternativeKeys.value = allAlternativeKeys;

const allAlternativePatches = allAlternativeKeys.map(x => {
  const color = (metadata.colors as any)[x] || "#FFB81C";
  return getColorOrPatternWithOpacity(color, 1);
});

allYears = [...new Set(chartData.value[allImpactCategoryKeys[0]]["data"].map((x: { year: string }) => x.year))] as string[];
shownYears.value = allYears;

const allYearPatches = allYears.map((x, index) => {
  const color = metadata.colors.yearLegend || "#FFB81C";
  const opacity = 1 - 0.5 * (index / (allYears.length - 1));
  return getColorOrPatternWithOpacity(color, opacity);
});

</script>

<template>
  <TheHeader />
  <main>
    <div class="container">
      <div class="row">
        <div class="col-12 col-lg-4 col-xl-3 col-xxl-2">
          <div class="offcanvas-lg offcanvas-start" tabindex="-1" id="settingsOffcanvas"
            aria-labelledby="settingsOffcanvasLabel">
            <div class="offcanvas-header">
              <h5 class="offcanvas-title" id="settingsOffcanvasLabel">Chart settings</h5>
              <button type="button" class="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#settingsOffcanvas"
                aria-label="Close"></button>
            </div>
            <div class="offcanvas-body" style="flex-direction: column;">
              <h5 class="d-none d-lg-block mt-4 mb-3">Chart settings</h5>
              <h6>Scenario</h6>
              <select class="form-select mb-3" aria-label="Scenario" v-model="currentScenarioKey">
                <option v-for="scenarioKey in allScenarioKeys" :value="scenarioKey" :key="scenarioKey">
                  {{ (scenarios as any)[scenarioKey].title }}
                </option>
              </select>
              <ul class="checkbox-list">
                <li class="form-check form-switch">
                  <input class="form-check-input" :id="'checkbox-normalize'" name="sortCharts" type="checkbox" v-model="isNormalized" />
                  <label class="form-check-label" :for="'checkbox-normalize'"><span>Normalise</span></label>
                </li>
                <li class="form-check form-switch">
                  <input class="form-check-input" :id="'checkbox-normalize-zoom'" name="sortCharts" type="checkbox" v-model="isNormalizedZoomed" :disabled="!isNormalized" />
                  <label class="form-check-label" :for="'checkbox-normalize-zoom'"><span>Zoom in</span></label>
                </li>
              </ul>
              <h6 class="mt-3">Sort</h6>
              <ul class="checkbox-list">
                <li class="form-check">
                  <input class="form-check-input" :id="'checkbox-sortCharts-byYear'" value="byYear" name="sortCharts" type="radio"
                    v-model="sortCharts" />
                  <label class="form-check-label" :for="'checkbox-sortCharts-byYear'"><span>By year</span></label>
                </li>
                <li class="form-check">
                  <input class="form-check-input" :id="'checkbox-sortCharts-byAlternative'" value="byAlternative" name="sortCharts" type="radio"
                    v-model="sortCharts" />
                  <label class="form-check-label" :for="'checkbox-sortCharts-byAlternative'"><span>By alternative</span></label>
                </li>
              </ul>
              <h6 class="mt-3">Impact categories</h6>
              <ul class="checkbox-list">
                <li v-for="(key) in allImpactCategoryKeys" :key="key" class="form-check">
                  <input class="form-check-input" :id="'checkbox-' + key" :value="key" name="impactCategories" type="checkbox"
                    v-model="shownImpactCategoryKeys" />
                  <label class="form-check-label" :for="'checkbox-' + key" :title="key"><span>{{ chartData[key].title
                  }}</span></label>
                </li>
              </ul>
              <h6 class="mt-3">Years</h6>
              <ul class="checkbox-list">
                <li v-for="(year, index) in allYears" :key="year" class="form-check">
                  <input class="form-check-input" :id="'checkbox-' + year" :value="year" name="years" type="checkbox"
                    v-model="shownYears" />
                  <label class="form-check-label" :for="'checkbox-' + year" :title="year">
                    <ChartPatch :patch="allYearPatches[index]" />
                    <span>{{ year }}</span>
                  </label>
                </li>
              </ul>
              <h6 class="mt-3">Alternatives</h6>
              <ul class="checkbox-list">
                <li v-for="(key, index) in allAlternativeKeys" :key="key" class="form-check">
                  <input class="form-check-input" :id="'checkbox-' + key" :value="key" name="alternatives" type="checkbox" v-model="shownAlternativeKeys" />
                  <label class="form-check-label" :for="'checkbox-' + key" :title="key">
                    <ChartPatch :patch="allAlternativePatches[index]" />
                    <span>{{ getFriendlyTitle(key) }}</span>
                  </label>
                </li>
              </ul>

            </div>
          </div>
        </div>
        <div class="col-12 col-lg">
          <button class="btn btn-light d-lg-none mt-3" style="margin-bottom: -0.5rem" type="button" data-bs-toggle="offcanvas" data-bs-target="#settingsOffcanvas" aria-controls="settingsOffcanvas">
            <i class="fa-solid fa-sharp fa-gear me-1"></i>
            Settings
          </button>
          <div class="mt-4">
            <h2 class="fs-5 mb-3">
              Characterisation results
            </h2>
            <div class="row gy-4">
              <template v-for="(theChartData, chartKey) in chartData" :key="chartKey">
                <div v-if="theChartData.visible" class="col-12 col-sm-6 col-lg-4 col-xxl-4 col-xxxl-3">
                  <CharacterisationChart :title="theChartData.title"
                    :ylabel="theChartData.ylabel" :ylim="theChartData.ylim" :data="theChartData.data"
                    :sort="sortCharts" />
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <TheFooter />
</template>

<style scoped lang="scss">
.checkbox-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

</style>
