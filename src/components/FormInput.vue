<template>
  <div class="input" :placeholder="props.placeholder" :error="props.error">
    <input type="text" :minlength="props.inputRule?.min" :maxlength="props.inputRule?.max" v-model="modelValue"
      :class="{ inputed: modelValue !== '' }" @input="() => emit('input', modelValue)" />
  </div>
</template>


<script setup lang="ts">

export type InputRule = {
  min?: string | number
  max?: string | number
  format?: (value: string) => string
}

const modelValue = defineModel<string>()

const props = defineProps<{
  placeholder: string
  error: string
  inputRule?: InputRule
}>()


const emit = defineEmits<{
  (e: 'input', value?: string): void
}>()


</script>

<style lang="scss" scoped>
.input {
  --placeholder-size: 1.2rem;
  width: 100%;
  height: 40px;
  border-radius: 5px;
  background: none;
  font-size: 16px;
  position: relative;

  input {
    width: inherit;
    height: inherit;
    border: none;
    outline: none;
    border: 1px solid;
    box-sizing: border-box;
    font-size: 1.2rem;
    padding: 0px 10px;
    border-radius: 5px;
    transition: background-color 0.8s;
    @apply dark:bg-#000/10 bg-#fff border-#ddd dark:border-#666 text-#333 dark:text-#ccc;
  }

  &::before {
    content: attr(placeholder);
    position: absolute;
    font-size: 1rem;
    top: 10px;
    left: 10px;
    color: #999;
    transition: all 0.3s;
    pointer-events: none;
  }

  &::after {
    content: attr(error);
    position: absolute;
    font-size: 12px;
    bottom: -14px;
    left: 0px;
    color: red;
    transition: all 0.3s;
    pointer-events: none;
  }

  &:has(input:focus),
  &:has(input.inputed) {
    &::before {
      top: -22px;
      left: 0;
      @apply dark:text-#ccc text-#666;
    }
  }
}
</style>