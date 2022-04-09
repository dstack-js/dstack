<template>
  Generate PSK: <br>
  <textarea v-model="psk"></textarea>
  <br>
  <button @click="generate">Generate PSK</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Networking } from '@dstack-js/lib'

export default defineComponent({
  data() {
    return {
      psk: ""
    }
  },
  methods: {
    async generate() {
      this.psk = await Networking.generatePSK()
    }
  },
  async beforeMount() {
    this.generate()
  }
})
</script>
<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
