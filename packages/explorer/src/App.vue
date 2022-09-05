<script setup lang="ts">
import { Peer, Stack, StackOptions } from '@dstack-js/lib'
import { ref, watch } from 'vue'

import StackOptionsForm from './components/StackOptionsForm.vue'

const stack = ref<Stack | null>(null)
const connectTo = ref<string | null>(null)

watch(connectTo, async (value) => {
  if (stack.value && value) {
    await stack.value.network.connect(value).catch(console.error)
  }

  connectTo.value = null
})

const connected = ref<Set<string>>(new Set([]))
const options = ref<StackOptions>({
  network: {
    listen: [
      '/ip4/127.0.0.1/tcp/9090/ws/p2p-webrtc-star/'
    ],
    discovery: {
      autoConnect: true
    }
  },
})

const createStack = async (options: StackOptions) => {
  try {
    stack.value = await Stack.start(options)
    stack.value.network.on('connected', (peer: Peer) => {
      console.log('Connected to peer', peer)
      connected.value.add(peer.id)
    })

    stack.value.network.on('disconnected', (peer: Peer) => {
      console.log('Peer disconnected', peer)
      connected.value.delete(peer.id)
    })

    stack.value.network.on('discovered', (peer: Peer) => {
      console.log('Peer discovered', peer)
    })

    // @ts-expect-error: no stack in global scope has been declared
    window.stack = stack.value
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <v-app id="explorer">
    <v-container v-if="!stack" fluid pa-0>
      <v-row
        align="center"
        justify="center"
        style="height: 100vh"
        dense
      >
        <v-col
          cols="12"
          lg="12"
          md="12"
          class="grey lighten-2 fill-height d-flex flex-column justify-center align-center"
        >
          <StackOptionsForm v-model="options" @create="createStack" />
        </v-col>
      </v-row>
    </v-container>
    <v-container v-else>
      ID: {{stack.network.identity.id}}
      <br>
      Addresses:
      <div v-for="address in stack.network.addresses" :key="address">
        {{address}}
      </div>
      <br>
      You can interact with stack using browser console:
      <code>
        window.stack
      </code>
      <br>
      <v-text-field variant="underlined" v-model="connectTo" label="Connect To" />
      <br>
      Connected To:
      <div v-for="id in connected" :key="id">
        {{id}}
      </div>
    </v-container>
  </v-app>
</template>
