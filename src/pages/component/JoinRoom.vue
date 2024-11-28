<template>
  <div class="create-room-content">
    <div class="text-6 font-bold">加入房间</div>
    <div class="text-4 text-#666 dark:text-#ccc">加入朋友的房间</div>
    <div class="flex flex-col gap-30px py-26px">
      <FormInput placeholder="房间ID" :error="inputErr.id" :input-rule="inputRules.id" v-model="inputValues.id"
        @input="() => onInput('id')">
      </FormInput>
      <FormInput placeholder="房间密码(可选)" :error="inputErr.password" :input-rule="inputRules.password"
        v-model="inputValues.password" @input="() => onInput('password')"></FormInput>
    </div>
  </div>
</template>

<script setup lang="ts">
import FormInput, { type InputRule } from "@/components/FormInput.vue"

type FormData = {
  id: string
  password: string
}

const inputValues = reactive<FormData>({
  id: "",
  password: "",
})

const inputErr = reactive<FormData>({
  id: "",
  password: "",
})

const inputRules: Record<keyof FormData, InputRule> = {
  id: {
    min: 6,
    max: 6,
    format: (value: string) => {
      return value.replace(/[^0-9]/g, '')
    }
  },
  password: {
    min: 6,
    max: 6,
    format: (value: string) => {
      return value.replace(/[^0-9]/g, '')
    }
  }
}


const onInput = (key: keyof FormData) => {
  const rule = inputRules[key]
  if (!rule) return

  if (rule.format) {
    inputValues[key] = rule.format(inputValues[key])
  }
}

const verifyData = () => {
  let valid = true
  Object.keys(inputValues).forEach((key) => {
    const rule = inputRules[key as keyof FormData]
    if (!rule) return
    const val = inputValues[key as keyof FormData]
    if (val.length < Number(rule.min) || val.length > Number(rule.max)) {
      inputErr[key as keyof FormData] = `请输入${rule.min}-${rule.max}位字符`
      valid = false
    } else {
      inputErr[key as keyof FormData] = ""
    }
    if (rule.format) {
      inputValues[key as keyof FormData] = rule.format(inputValues[key as keyof FormData])
    }
  })
  return valid
}

const submitData = () => {
  const isValid = verifyData()
  if (!isValid) throw new Error("数据校验失败")
  return inputValues
}

defineExpose({
  submitData
})

</script>

<style lang="scss" scoped></style>