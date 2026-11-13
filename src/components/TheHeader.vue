<script setup lang="ts">
import { toRefs } from 'vue'
import { type LcaMetadata } from "@/LcaMetadata";

const props = defineProps<{
  metadata: LcaMetadata,
}>()

const { metadata } = toRefs(props);

const appTitle = "Quan's LCA Viewer";
const projectTitle = metadata.value.projectName;

document.title = projectTitle + " · " + appTitle;
</script>

<template>
  <header>
    <nav class="navbar navbar-expand-md bg-primary navbar-dark">
      <div class="container">
        <!-- <button class="navbar-toggler border-0 px-2 me-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button> -->
        <a class="navbar-brand me-auto" href="#">
          <span class="fw-bold me-2">{{ appTitle }}</span> <br class="d-md-none" />
          <span class="">{{ projectTitle }}</span>
        </a>
        <span class="navbar-text ms-auto d-none d-sm-inline-block">
          :-)
        </span>
        <!--<div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-md-0">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Link</a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Dropdown
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#">Action</a></li>
                <li><a class="dropdown-item" href="#">Another action</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#">Something else here</a></li>
              </ul>
            </li>
            <li class="nav-item">
              <a class="nav-link disabled" aria-disabled="true">Disabled</a>
            </li>
          </ul>
          <form class="d-flex" role="search">
            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
            <button class="btn btn-outline-success" type="submit">Search</button>
          </form>
        </div> -->
      </div>
    </nav>
    <nav class="navbar navbar-expand-xs bg-light py-0" v-if="metadata.goalScopeDescription">
      <div class="container">
        <p class="my-3 text-dark">{{ metadata.goalScopeDescription }}</p>
      </div>
      <!--<div class="container">
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-md-0 py-2">
            <li class="nav-item ps-0">
              <a class="nav-link active ps-0" aria-current="page" href="#">Characterisation results</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" v-tooltip="'Not implemented yet'">Information</a>
            </li>
          </ul>
        </div> 
      </div>-->
    </nav>
  </header>
</template>

<style scoped>

</style>
