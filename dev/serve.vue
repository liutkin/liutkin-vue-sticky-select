<template>
  <div id="app">
    <div class="content">
      <sticky-select
        :options="options"
        v-model="selectedOptionIndex"
        placeholder="Select option"
      />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import StickySelect from "@/StickySelect.vue";

export default Vue.extend({
  name: "ServeDev",
  components: {
    StickySelect,
  },
  data: () => ({
    options: [
      "Banana",
      "Avocado",
      "Durian",
      "Grapefruit",
      "Orange",
      "Pear",
      "Watermelon",
      "Blackberry",
      "Cherries",
      "Mango",
    ],
    selectedOptionIndex: null,
  }),
});
</script>

<style>
html {
  font-size: 16px;
}

#app {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

body {
  font-family: Helvetica, sans-serif;
  color: rgba(0, 0, 0, 0.9);
  font-size: 1rem;
  line-height: 1.5;
  background-color: white;
}

.content {
  width: 20rem;
}
</style>
