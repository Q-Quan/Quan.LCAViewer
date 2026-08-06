<script setup lang="ts">
import { ref, computed, watch, type Ref } from 'vue'

import TheHeader from './TheHeader.vue'
import TheFooter from './TheFooter.vue'
import TooltipIcon from './TooltipIcon.vue'

import RecommendationCard from './RecommendationCard.vue'

const primaryColor = "#001158";
const title = "Sustainable Laboratory Recommendations";
const description = "";

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return '';
  }
  const resultSplit = {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  }
  return resultSplit.r + ", " + resultSplit.g + ", " + resultSplit.b
}

// Data
const answeredAreas: Ref<string[]> = ref([]);
const currentArea = ref("");
//// Questions
let currentQuestion = ref("Q.welcome");
const questions: Ref<any> = ref({
    "Q.welcome": {
      "question": "My laboratory wants to become more sustainable. What do I do?",
      "answers": [
        {
          "label": "START",
          "value": "",
          "action": () => setQuestion("Q.area"),
          "disabled": false
        }
      ],
      "response": null
    },
    "Q.area": {
      "question": "Which area do you want to improve?",
      "answers": [
        {
          "label": "Consumables and supplies",
          "value": "consumables",
          "action": () => { currentArea.value = "consumables"; setQuestion("Q.C.1") },
          get disabled() { return answeredAreas.value.includes("consumables") }
        },
        {
          "label": "Packaging",
          "value": "devices",
          "action": () => { currentArea.value = "packaging"; setQuestion("Q.P.1") },
          get disabled() { return answeredAreas.value.includes("packaging") }
        },
        {
          "label": "Devices",
          "value": "devices",
          "action": () => { currentArea.value = "devices"; setQuestion("Q.D.1") },
          get disabled() { return answeredAreas.value.includes("devices") }
        }
      ],
      "response": null
    },
    "Q.C.1": {
      "question": "Do you place a lot of (last-minute) orders?",
      "answers": [
        {
          "label": "Yes",
          "value": true,
          "action": () => setQuestion("Q.C.2"),
          "disabled": false
        },
        {
          "label": "No",
          "value": false,
          "action": () => setQuestion("Q.C.2"),
          "disabled": false
        }
      ],
      "response": null,
    },
    "Q.C.2": {
      "question": "Do you use a lot of single-use items?",
      "answers": [
        {
          "label": "Yes",
          "value": true,
          "action": () => setQuestion("Q.C.3"),
          "disabled": false
        },
        {
          "label": "No",
          "value": false,
          "action": () => setQuestion("Q.C.3"),
          "disabled": false
        }
      ],
      "response": null
    },
    "Q.C.3": {
      "question": "Do you frequently dispose of consumables because they pass their use-by date?",
      "answers": [
        {
          "label": "Yes",
          "value": true,
          "action": () => {
            if (questions.value["Q.C.4"]["response"] === null) {
              setQuestion("Q.C.4")
            } else if (answeredAreas.value.length < 2) {
              answeredAreas.value.push(currentArea.value);
              setQuestion("Q.another")
            } else {
              setQuestion("Q.stakeholders")
            }
          },
          "disabled": false
        },
        {
          "label": "No",
          "value": false,
          "action": () => {
            if (questions.value["Q.C.4"]["response"] === null) {
              setQuestion("Q.C.4")
            } else if (answeredAreas.value.length < 2) {
              answeredAreas.value.push(currentArea.value);
              setQuestion("Q.another")
            } else {
              setQuestion("Q.stakeholders")
            }
          },
          "disabled": false
        }
      ],
      "response": null
    },
    "Q.C.4": {
      "question": "Do you sort (non-hazardous) waste (e.g. paper vs. plastic)?",
      "answers": [
        {
          "label": "Yes",
          "value": true,
          "action": () => {
            if (answeredAreas.value.length < 2) {
              answeredAreas.value.push(currentArea.value);
              setQuestion("Q.another")
            } else {
              setQuestion("Q.stakeholders")
            }
          },
          "disabled": false
        },
        {
          "label": "No",
          "value": false,
          "action": () => {
            if (answeredAreas.value.length < 2) {
              answeredAreas.value.push(currentArea.value);
              setQuestion("Q.another")
            } else {
              setQuestion("Q.stakeholders")
            }
          },
          "disabled": false
        }
      ],
      "response": null
    },
    "Q.P.1": {
      "question": "Do you think your supplier sends you needless packaging?",
      "answers": [
        {
          "label": "Yes",
          "value": true,
          "action": () => setQuestion("Q.P.2"),
          "disabled": false
        },
        {
          "label": "No",
          "value": false,
          "action": () => setQuestion("Q.P.2"),
          "disabled": false
        }
      ],
      "response": null
    },
    "Q.P.2": {
      "question": "Could a lot of the packaging be replaced (with, e.g., cardboard, bio-plastic, or recycled plastic)?",
      "answers": [
        {
          "label": "Yes",
          "value": true,
          "action": () => setQuestion("Q.P.3"),
          "disabled": false
        },
        {
          "label": "No",
          "value": false,
          "action": () => setQuestion("Q.P.3"),
          "disabled": false
        }
      ],
      "response": null
    },
    "Q.P.3": {
      "question": "Do have the space to collect used packaging for reverse logistics?",
      "answers": [
        {
          "label": "Yes",
          "value": true,
          "action": () => {
            if (questions.value["Q.C.4"]["response"] === null) {
              setQuestion("Q.C.4")
            } else if (answeredAreas.value.length < 2) {
              answeredAreas.value.push(currentArea.value);
              setQuestion("Q.another")
            } else {
              setQuestion("Q.stakeholders")
            }
          },
          "disabled": false
        },
        {
          "label": "No",
          "value": false,
          "action": () => {
            if (questions.value["Q.C.4"]["response"] === null) {
              setQuestion("Q.C.4")
            } else if (answeredAreas.value.length < 2) {
              answeredAreas.value.push(currentArea.value);
              setQuestion("Q.another")
            } else {
              setQuestion("Q.stakeholders")
            }
          },
          "disabled": false
        }
      ],
      "response": null
    },
    "Q.D.1": {
      "question": "Do you have any energy or water-intensive devices?",
      "answers": [
        {
          "label": "Yes",
          "value": true,
          "action": () => setQuestion("Q.D.2"),
          "disabled": false
        },
        {
          "label": "No",
          "value": false,
          "action": () => setQuestion("Q.D.2"),
          "disabled": false
        }
      ],
      "response": null
    },
    "Q.D.2": {
      "question": "Are you planning on getting rid of old devices and/or getting any new ones?",
      "answers": [
        {
          "label": "Yes",
          "value": true,
          "action": () => {
            if (answeredAreas.value.length < 2) {
              answeredAreas.value.push(currentArea.value);
              setQuestion("Q.another")
            } else {
              setQuestion("Q.stakeholders")
            }
          },
          "disabled": false
        },
        {
          "label": "No",
          "value": false,
          "action": () => {
            if (answeredAreas.value.length < 2) {
              answeredAreas.value.push(currentArea.value);
              setQuestion("Q.another")
            } else {
              setQuestion("Q.stakeholders")
            }
          },
          "disabled": false
        }
      ],
      "response": null
    },
    "Q.another": {
      "question": "Are there other areas you still want to look into?",
      "answers": [
        {
          "label": "Yes",
          "value": true,
          "action": () => setQuestion("Q.area"),
          "disabled": false
        },
        {
          "label": "No",
          "value": false,
          "action": () => setQuestion("Q.stakeholders"),
          "disabled": false
        }
      ],
      "response": null
    },
    "Q.stakeholders": {
      "question": "For the selected recommendations, are the required internal stakeholders on board?",
      "answers": [
        {
          "label": "Yes",
          "value": true,
          "action": () => setQuestion("Q.end.1"),
          "disabled": false
        },
        {
          "label": "No",
          "value": false,
          "action": () => setQuestion("Q.end.2"),
          "disabled": false
        }
      ],
      "response": null
    },
    "Q.end.1": {
      "question": "Great! Write down your ambitions in a vision (see R.U1) and get to work (see R.U2)",
      "answers": [
      ],
      "response": null
    },
    "Q.end.2": {
      "question": "Great! Write down your ambitions in a vision (see R.U1) and start by getting your internal stakeholders on board. Follow the VCI recommendations on internal stakeholders.",
      "answers": [
      ],
      "response": null
    },
  }
);

function setQuestion(key: string) {
  currentQuestion.value = key;
}
function setResponse(questionKey: string, response: string | boolean) {
  questions.value[questionKey]["response"] = response;
}

//// Recommendations
const recommendations = computed(() => [
  {
    "key": "R.A1",
    "title": "Improve waste treatment",
    "description": "Improve in-house waste collection and separation. Collaborate with waste treatment providers to align waste separation. Further research is required to explore what the most sustainable options are for hazardous waste (see R.U3.2).",
    "showInMain": questions.value["Q.C.4"]["response"] === false,
    "showInAdditional": false
  },
  {
    "key": "R.B1",
    "title": "Reduce packaging material through tendering",
    "description": "Coordinate a reduction of packaging material with the supplier. Incorporate relevant criteria in the tendering process, relating to the mass or volume of packaging material (e.g. no sleeve over secondary packaging), in order to reduce (plastic) packaging waste (see R.U4). The mass/volume of packaging material should be tracked over time and used in contract management (see R.U3.1).",
    "showInMain": questions.value["Q.P.1"]["response"] === true,
    "showInAdditional": false
  },
  {
    "key": "R.B2",
    "title": "Substitute packaging material through tendering ",
    "description": "The tendering process can extend to substituting non-renewable with renewable packaging materials (see R.U4). The evaluation of any changes should be tracked based on the packaging received and used in contract management (see R.U3.1).",
    "showInMain": questions.value["Q.P.2"]["response"] === true,
    "showInAdditional": false
  },
  {
    "key": "R.B3",
    "title": "Reverse logistics of packaging ",
    "description": "Stimulate reverse logistics to reuse, refurbish, and recycle packaging materials. This is incorporated across the tendering process (see R.U4) and facilitated by a global overview and management of (packaging) waste streams. Do not only consider secondary and tertiary packaging, but also primary packaging (e.g. pipette tip trays). As with other changes to operations and procurement, set goals and track changes (see R.U3.1).",
    "showInMain": questions.value["Q.P.3"]["response"] === true,
    "showInAdditional": false
  },
  {
    "key": "R.C1",
    "title": "Coordinate inventory management",
    "description": "In several areas, environmental performance could be improved by increasing the coordination of inventory management. This means creating a communication network to bundle orders and - in the case a particular item runs out last-minute - coordinate whether a suitable replacement is already in-stock elsewhere within the network.\nSuch coordination makes sense for larger organizations, where inventory management is distributed across different groups. This could, for example, be grouped under one logistical group which internally receives and fulfils requests. For smaller organizations, coordination with nearby collaborators, such as hospitals or universities, is of higher interest. \n\nAdditionally, the supply framework used should be considered during tendering, in coordination with the market (see R.U4). This can help mitigate supply risks. Supply satisfaction and transportation movements are relevant metrics here (see R.U3.1). ",
    "showInMain": questions.value["Q.C.1"]["response"] === true,
    "showInAdditional": questions.value["Q.C.1"]["response"] !== true && questions.value["Q.C.3"]["response"] === true
  },
  {
    "key": "R.C2",
    "title": "Harmonize consumables to reduce variety ",
    "description": "The procurement objective of reducing variability among consumables is particularly relevant, as this can improve inventory management aspects: bundling orders, reducing transportation movements, and improving logistics with respect to research needs. This also means that the variety of suppliers can be reduced, facilitating actions which require coordination with the supplier (see R.B1, for example).",
    "showInMain": false,
    "showInAdditional": questions.value["Q.C.1"]["response"] === true || questions.value["Q.C.3"]["response"] === true
  },
  {
    "key": "R.C3",
    "title": "Replace disposables with reusables",
    "description": "Some waste could be avoided all together, by exploring the R-ladder for in-house treatment of products to facilitate reuse, e.g. of glass vials and pipette tips - when this is feasible also depends on the research objectives and thereby research management. Procurement touches on this, in exploration and orientation in the market (see R.U4). However, internal knowledge could also be mobilised here to determine which options are most feasible and environmentally beneficial (see R.U3.2). In any case, a shift away from disposables entails significant organizational commitment (see R.U2).",
    "showInMain": questions.value["Q.C.2"]["response"] === true,
    "showInAdditional": false
  },
  {
    "key": "R.C4",
    "title": "Reconsider use-by dates on consumables",
    "description": "Reconsider the (self-determined) use-by dates when quality assurance can guarantee valid use. This applies to inert chemicals and solvents which can be stored for long periods, as well as consumables with a shorter shelf life of which straightforward quality assurance tests are available. ",
    "showInMain": questions.value["Q.C.3"]["response"] === true,
    "showInAdditional": false
  },
  {
    "key": "R.D1",
    "title": "Ensure devices are efficient and used efficiently ",
    "description": "Operation efficiency - typically, consumption of energy and water - is key during the use of devices. Exploiting devices efficiently ties in with research management and facility management, as policies can be set up to promote efficient use (e.g. setting freezers to a certain temperature; keeping doors of freezers, ovens, fume hoods, etc. closed as much as possible) and to turn them off when not in use. Furthermore, facility management and the tendering process can be used to ensure that devices are timely replaced by more efficient ones as these become available (see U.4). Depending on the device, innovations in energy consumption can quickly make up for the manufacturing footprint. Measurements can be made at the level of the building but likely provide clearer insight when targeting a particular room or even individual devices (see R.U3.1 and R.U3.2). ",
    "showInMain": questions.value["Q.D.1"]["response"] === true,
    "showInAdditional": false
  },
  {
    "key": "R.D2",
    "title": "Circularise device components through tendering ",
    "description": "Through tendering, create transparency in the material composition of devices, to facilitate material recovery, and transparency in the destination of devices, when applying reverse logistics. When there is no opportunity for reuse or refurbishment, device components could be recovered for use elsewhere. Also, it is important that devices are indeed returned when no longer in use, rather than collecting dust in storage. ",
    "showInMain": questions.value["Q.D.2"]["response"] === true,
    "showInAdditional": false
  },
  {
    "key": "R.U1",
    "title": "Create a comprehensive sustainability vision at the organization Level",
    "description": "Developing a comprehensive sustainability vision is essential for guiding laboratory operations toward greater sustainability. This vision should extend beyond procurement and engage the entire organization. Each laboratory should have its vision tailored to its unique context, fostering ownership and adaptability. ",
    "showInMain": false,
    "showInAdditional": false
  },
  {
    "key": "R.U2",
    "title": "Prioritize and formalize responsibility for sustainability ",
    "description": "To overcome challenges in implementing sustainable practices, responsibility for sustainability should be formalized within the organization. This includes allocating resources and personnel dedicated to sustainability efforts. Sustainability should not be an ad hoc consideration but an ongoing, well-defined commitment. ",
    "showInMain": false,
    "showInAdditional": false
  },
  {
    "key": "R.U3",
    "title": "Collect and reflect on data to enable transition",
    "description": "Data plays a pivotal role in transitioning toward sustainable laboratory operations. Effective data collection and analysis are essential for informed decision-making. Two key aspects are tracking and reporting data and performing analyses on collected data. ",
    "showInMain": false,
    "showInAdditional": false
  },
  {
    "key": "R.U3.1",
    "title": "Track and report on data",
    "description": "To manage the transition effectively, laboratories must establish meaningful metrics to track and incentivize sustainability performance. Data acquisition processes should be improved and formalized, and metrics and reporting practices should be harmonized across laboratories. Tracking metrics such as packaging material mass, transportation movements, energy consumption, and waste generation provides insights into sustainability progress.",
    "showInMain": false,
    "showInAdditional": false
  },
  {
    "key": "R.U3.2",
    "title": "Perform analyses and reflect on collected data",
    "description": "Beyond data collection, thorough analyses of environmental impacts and supply limitations are crucial. Research into reverse logistics for hazardous waste, including packaging, disposables, and chemicals, is essential. Exploring the supply chain and alternatives for products with significant environmental impact informs procurement choices and encourages sustainable decisions.",
    "showInMain": false,
    "showInAdditional": false
  },
  {
    "key": "R.U4",
    "title": "Improve the tendering process",
    "description": "Procurement is a critical area for enhancing sustainability. Improving the understanding of the market landscape through market days and early identification of tendering needs are essential steps. Contract managers should actively define effective criteria during contracting and ensure their enforcement throughout the contract's duration. Building internal knowledge on relevant tendering criteria and forming a community of practice among stakeholders can further support sustainability goals.",
    "showInMain": false,
    "showInAdditional": false
  }
]);

const mainRecommendations = computed(() => recommendations.value.filter(x => x["showInMain"]));
const additionalRecommendations = computed(() => recommendations.value.filter(x => x["showInAdditional"]));
const allRecommendations = recommendations;

</script>

<template>
  <div class="lca-viewer"
    :style="{ '--bs-primary': primaryColor, '--bs-link-color': primaryColor, '--bs-primary-rgb': hexToRgb(primaryColor) }">
    <TheHeader :title="title" :description="description" />
    <main>
      <div class="container">
        <div class="row gx-5">
          <div class="col-12 col-lg-7 col-xxl-8">
            <button class="btn btn-light d-lg-none mt-3" style="margin-bottom: -0.5rem" type="button"
              data-bs-toggle="offcanvas" data-bs-target="#settingsOffcanvas" aria-controls="settingsOffcanvas">
              <i class="fa-solid fa-info-circle me-1"></i>
              Recommendations 
              <span class="badge badge-primary bg-primary">{{mainRecommendations.length + additionalRecommendations.length }}</span>
            </button>
            <div class="mt-4">
              <h2 class="fs-5 mb-3">
                Questions
              </h2>
              <div class="row gy-4">
                <h4 class="mb-3">{{ questions[currentQuestion].question }}</h4>
                <div class="row">
                  <div class="col" v-for="answer in questions[currentQuestion].answers">
                    <button type="button"
                      @click="() => { setResponse(currentQuestion, answer.value); answer.action(); }"
                      class="btn btn-light w-100" :disabled="answer.disabled">
                      <i class="fa-solid fa-check" v-if="answer.disabled"></i>
                      {{ answer.label }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-5 col-xxl-4">
            <div class="offcanvas-lg offcanvas-start" tabindex="-1" id="settingsOffcanvas"
              aria-labelledby="settingsOffcanvasLabel">
              <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="settingsOffcanvasLabel">Recommendations</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#settingsOffcanvas"
                  aria-label="Close"></button>
              </div>
              <div class="offcanvas-body" style="flex-direction: column;">
                <h5 class="d-none d-lg-block mt-4 mb-3">Recommendations</h5>
                <div class="mb-3">
                  <div class="row gx-1">
                    <div class="col">
                      <h6 class="mb-2">Main recommendations <span class="badge badge-primary bg-primary">{{
                          mainRecommendations.length }}</span></h6>
                    </div>
                    <div class="col-auto">
                      <div class="btn btn-link btn-sm px-0 py-0 collapse-btn collapsed" style="margin-top: -3px"
                        title="Toggle" data-bs-toggle="collapse" data-bs-target="#collapse-main" role="button">
                        <i class="fa-solid fa-plus fa-fw collapsed-icon"></i>
                        <i class="fa-solid fa-minus fa-fw collapse-icon"></i>
                      </div>
                    </div>
                  </div>
                  <div class="collapse" id="collapse-main">
                    <RecommendationCard v-if="mainRecommendations.length > 0"
                      v-for="recommendation in mainRecommendations" :theKey="recommendation.key"
                      :title="recommendation.title" :description="recommendation.description" :isMain="true" />
                    <p class="mb-0" v-else><small>Please answer the questions to receive your recommendations.</small>
                    </p>
                  </div>
                </div>
                <div class="mb-3">
                  <div class="row gx-1">
                    <div class="col">
                      <h6 class="mb-2">Additional recommendations <span class="badge text-dark bg-light">{{
                          additionalRecommendations.length }}</span></h6>
                    </div>
                    <div class="col-auto">
                      <div class="btn btn-link btn-sm px-0 py-0 collapse-btn collapsed" style="margin-top: -3px"
                        title="Toggle" data-bs-toggle="collapse" data-bs-target="#collapse-additional" role="button">
                        <i class="fa-solid fa-plus fa-fw collapsed-icon"></i>
                        <i class="fa-solid fa-minus fa-fw collapse-icon"></i>
                      </div>
                    </div>
                  </div>
                  <div class="collapse" id="collapse-additional">
                    <RecommendationCard v-if="additionalRecommendations.length > 0"
                      v-for="recommendation in additionalRecommendations" :theKey="recommendation.key"
                      :title="recommendation.title" :description="recommendation.description" :isMain="false" />
                    <p class="mb-0" v-else><small>Please answer the questions to receive your recommendations.</small>
                    </p>
                  </div>
                </div>
                <div class="mb-3">
                  <div class="row gx-1">
                    <div class="col">
                      <h6 class="mb-2">All recommendations for sustainable laboratories</h6>
                    </div>
                    <div class="col-auto">
                      <div class="btn btn-link btn-sm px-0 py-0 collapse-btn collapsed" style="margin-top: -3px"
                        title="Toggle" data-bs-toggle="collapse" data-bs-target="#collapse-all" role="button">
                        <i class="fa-solid fa-plus fa-fw collapsed-icon"></i>
                        <i class="fa-solid fa-minus fa-fw collapse-icon"></i>
                      </div>
                    </div>
                  </div>
                  <div class="collapse" id="collapse-all">
                    <RecommendationCard v-for="recommendation in allRecommendations" :theKey="recommendation.key"
                      :title="recommendation.title" :description="recommendation.description" :isMain="false" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <TheFooter />
  </div>
</template>

<style scoped lang="scss">
.checkbox-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.collapse-btn {
  .collapsed-icon {
    display: none;
  }

  &.collapsed {
    .collapsed-icon {
      display: inline-block;
    }

    .collapse-icon {
      display: none;
    }
  }
}
</style>
