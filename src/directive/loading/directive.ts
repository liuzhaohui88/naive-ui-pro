import type { Directive, DirectiveBinding } from 'vue'
import type { LoadingInstance } from './loading'
import type { LoadingOptions } from './types'
import { isBoolean, isObject } from 'lodash-es'
import { isRef } from 'vue'
import { Loading } from './service'

const INSTANCE_KEY = Symbol(
  __DEV__
    ? 'loadingInstance'
    : ``,
)

interface LoadingEl extends HTMLElement {
  [INSTANCE_KEY]?: {
    instance: LoadingInstance
  }
}

type LoadingBinding = boolean | LoadingOptions

function updateOptions(el: LoadingEl, options: LoadingOptions) {
  const instance = el[INSTANCE_KEY]
  if (!instance) {
    return
  }
  for (const key in options) {
    const value = instance.instance[key as keyof LoadingInstance]
    if (isRef(value)) {
      value.value = options[key as keyof LoadingOptions]
    }
  }
}

function createInstance(el: LoadingEl, binding: DirectiveBinding<LoadingBinding>) {
  const getBindingProp = <K extends keyof LoadingOptions>(key: K): LoadingOptions[K] => {
    return isObject(binding.value) ? binding.value[key] : undefined
  }
  const lock = getBindingProp('lock') ?? binding.modifiers.lock
  const fullscreen = getBindingProp('fullscreen') ?? binding.modifiers.fullscreen
  const to = getBindingProp('to') ?? (fullscreen ? undefined : el)
  const instance = Loading({
    ...(
      isBoolean(binding.value)
        ? { show: binding.value }
        : (binding.value ?? {})
    ),
    to,
    lock,
    fullscreen,
  })
  el[INSTANCE_KEY] = {
    instance,
  }
}

export const vLoading: Directive<LoadingEl, LoadingBinding> = {
  mounted(el, binding) {
    if (binding.value) {
      createInstance(el, binding)
    }
  },
  updated(el, binding) {
    const instance = el[INSTANCE_KEY]
    if (!binding.value) {
      if (instance) {
        instance.instance.show.value = false
        el[INSTANCE_KEY] = undefined
      }
      return
    }
    if (!instance) {
      createInstance(el, binding)
      return
    }
    if (isBoolean(binding.value)) {
      instance.instance.show.value = binding.value
      return
    }
    updateOptions(el, binding.value)
  },
  unmounted(el) {
    if (el[INSTANCE_KEY]) {
      el[INSTANCE_KEY].instance.show.value = false
      el[INSTANCE_KEY] = undefined
    }
  },
}
