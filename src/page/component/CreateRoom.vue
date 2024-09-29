<template>
  <div class="create-room-content">
    <div class="text-6 font-bold">创建房间</div>
    <div class="text-4 text-#666 dark:text-#ccc">创建新房间，邀请朋友加入开黑</div>
    <div class="flex flex-col gap-30px py-26px">
      <FormInput placeholder="房间名称" :error="inputErr.name" :input-rule="inputRules.name" v-model="inputValues.name"
        @input="() => onInput('name')">
      </FormInput>
      <FormInput placeholder="房间密码(可选)" :error="inputErr.password" :input-rule="inputRules.password"
        v-model="inputValues.password" @input="() => onInput('password')"></FormInput>
      <FormInput placeholder="房间ID" :error="inputErr.id" :input-rule="inputRules.id" v-model="inputValues.id"
        @input="() => onInput('id')">
      </FormInput>
    </div>
  </div>
</template>

<script setup lang="ts">
import FormInput, { type InputRule } from '@/components/FormInput.vue';

type FormData = {
  name: string
  password: string
  id: string
}


const inputValues: FormData = reactive({
  name: "",
  password: "",
  id: ""
})
const inputErr: Record<keyof FormData, string> = reactive({
  name: "",
  password: "",
  id: ""
})


const inputRules: Record<Partial<keyof FormData>, InputRule> = {
  name: {
    min: 1,
    max: 12
  },
  password: {
    min: 6,
    max: 6,
    format: (value: string) => {
      return value.replace(/[^0-9]/g, '')
    }
  },
  id: {
    min: 6,
    max: 6,
    format: (value: string) => {
      return value.replace(/[^0-9]/g, '')
    }
  }
}


const onInput = (key: keyof typeof inputValues) => {
  const rule = inputRules[key]
  if (!rule) return

  if (rule.format) {
    inputValues[key] = rule.format(inputValues[key].trim())
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

  //[todo) 
  console.log(inputValues)
  return inputValues

}

defineExpose({
  submitData
})

</script>

<style lang="scss" scoped></style>