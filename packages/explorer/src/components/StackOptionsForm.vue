<script setup lang="ts">
import MonacoEditor from 'monaco-editor-vue3'
import { StackOptions } from '@dstack-js/lib'
import { PropType, ref, watch } from 'vue'
import { editor } from 'monaco-editor'

const debugLogging = ref(localStorage.getItem('debug') === '*')

watch(debugLogging, (value) => {
  localStorage.setItem('debug', value ? '*' : '')
  location.reload()
})

const editorMounted = (editor: editor.IEditor) => {
  window.addEventListener('resize', () => {
    editor.layout()
  })
}

const props = defineProps({
  modelValue: {
    type: Object as PropType<StackOptions>,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue', 'create'])

const rawOptions = ref(JSON.stringify(props.modelValue, null, 2))

watch(rawOptions, (value) => {
  try {
    const options = JSON.parse(value)
    emit('update:modelValue', options)
  } catch (error) {
    console.error(error)
  }
})

const create = () => {
  emit('create', JSON.parse(rawOptions.value))
}
</script>

<template>
  <v-card tile>
    <v-card-title>Stack Options</v-card-title>
    <v-card-text>
      <monaco-editor
        style="min-height: 50vh; min-width: 50vw"
        theme="vs-dark"
        :options="{ minimap: { autohide: true } }"
        @editorDidMount="editorMounted"
        v-model:value="rawOptions"
      />
      <v-switch
        color="white"
        v-model="debugLogging"
        label="Enable debug logging"
        >Enable debug logging</v-switch
      >
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn text @click="create">Create Stack</v-btn>
    </v-card-actions>
  </v-card>
</template>
