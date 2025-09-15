<script setup lang="ts">
import type { IDomEditor } from '@wangeditor/editor'
import type { EditorProps, ToolbarProps } from './props'
import { Boot } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { merge } from 'lodash-es'
import { useThemeVars } from 'naive-ui'
import { call } from 'naive-ui/es/_utils'
import { computed, inject, mergeProps, onBeforeUnmount, shallowRef, watchEffect } from 'vue'
import { withEmptyHtmlPlugin } from './plugin/emptyHtmlPlugin'
import { wangEditorProps } from './props'
import '@wangeditor/editor/dist/css/style.css'

defineOptions({
  name: 'WangEditor',
})

const props = defineProps(wangEditorProps)
const vars = useThemeVars()
const editorInstRef = shallowRef<IDomEditor>()
const NFormItem = inject('n-form-item', null) as any

const mergedStatus = computed(() => {
  if (props.status) {
    return props.status
  }
  return NFormItem?.mergedValidationStatus.value
})

const mergedDisabled = computed(() => {
  if (props.disabled !== undefined) {
    return props.disabled
  }
  if (NFormItem) {
    return NFormItem.disabled.value
  }
  return false
})

const mergedEditorEvents = computed(() => {
  return mergeProps({
    onOnCreated: (editor: IDomEditor) => {
      editorInstRef.value = editor
    },
    onOnBlur: () => {
      if (NFormItem) {
        NFormItem.handleContentBlur()
      }
    },
  }, {
    onOnBlur: props.onOnBlur,
    onOnFocus: props.onOnFocus,
    onOnChange: props.onOnChange,
    onOnCreated: props.onOnCreated,
    onOnDestroyed: props.onOnDestroyed,
    onOnMaxLength: props.onOnMaxLength,
    onCustomAlert: props.onCustomAlert,
  })
})

const editorProps = computed<EditorProps>(() => {
  return {
    'defaultConfig': merge({
      autoFocus: false,
      placeholder: props.placeholder,
      MENU_CONF: {
        // 图片上传可在这里对接
        // uploadImage: {
        //   fieldName: 'file',
        //   customInsert: (res, insertFn) => {
        //     const url = res?.url ?? ''
        //     insertFn(url, '', url)
        //   },
        //   server: 'api/file/upload',
        // },
      },
    }, props.editorConfig ?? {}),
    ...mergedEditorEvents.value,
    'mode': 'simple',
    'modelValue': props.modelValue ?? '',
    'style': { height: props.height },
    'onUpdate:modelValue': doUpdateValue,
  }
})

const toolbarProps = computed<ToolbarProps>(() => {
  return {
    defaultConfig: merge({
      excludeKeys: [
        'insertVideo',
        'uploadVideo',
        'editVideoSize',
        'fullScreen',
      ],
    }, props.toolbarConfig ?? {}),
    editor: editorInstRef.value,
    mode: 'simple',
  }
})

function doUpdateValue(v: string) {
  /**
   * @description 获取焦点也会触发此事件的相关 issue
   * https://github.com/wangeditor-team/wangEditor/issues/4729
   */
  if ((props.modelValue ?? '') === v) {
    return
  }
  if (props.onUpdateModelValue) {
    call(props.onUpdateModelValue, v)
  }
  if (props['onUpdate:modelValue']) {
    call(props['onUpdate:modelValue'], v)
  }
  if (NFormItem) {
    NFormItem.handleContentInput()
    NFormItem.handleContentChange()
  }
}

watchEffect(() => {
  const editor = editorInstRef.value
  const disabled = mergedDisabled.value
  if (editor) {
    disabled
      ? editor.disable()
      : editor.enable()
  }
})

onBeforeUnmount(() => {
  const editor = editorInstRef.value
  if (editor) {
    editor.destroy()
    editorInstRef.value = undefined
  }
})

Boot.registerPlugin(withEmptyHtmlPlugin)
</script>

<template>
  <div class="wangeditor-wrapper">
    <toolbar
      v-bind="toolbarProps"
      class="wangeditor-toolbar"
      :class="[
        mergedStatus && `wangeditor-toolbar-${mergedStatus}-status`,
      ]"
    />
    <editor
      v-bind="editorProps"
      class="wangeditor-editor"
      :class="[
        mergedStatus && `wangeditor-editor-${mergedStatus}-status`,
      ]"
    />
  </div>
</template>

<style scoped>
.wangeditor-wrapper {
  width: 100%;
  /* 自定义 wangeditor 主题 */
  --w-e-toolbar-bg-color: v-bind('vars.baseColor');
  --w-e-textarea-bg-color: v-bind('vars.baseColor');
  --w-e-textarea-color: v-bind('vars.textColor1');
  --w-e-textarea-slight-bg-color: v-bind('vars.codeColor');
  --w-e-toolbar-color: v-bind('vars.textColor1');
  --w-e-toolbar-active-color: v-bind('vars.textColor1');
  --w-e-toolbar-active-bg-color: v-bind('vars.hoverColor');
  --w-e-modal-button-bg-color: v-bind('vars.actionColor');
  --w-e-toolbar-disabled-color: v-bind('vars.textColorDisabled');
}

.wangeditor-toolbar {
  --w-e-toolbar-border-color: v-bind('vars.borderColor');
  :deep(.w-e-toolbar) {
    border: 1px solid v-bind('vars.borderColor');
    border-radius: v-bind('vars.borderRadius') v-bind('vars.borderRadius') 0 0;
    transition: border-color 0.3s v-bind('vars.cubicBezierEaseInOut');
  }
}

.wangeditor-toolbar-success-status {
  --w-e-toolbar-border-color: v-bind('vars.successColor');
  :deep(.w-e-toolbar) {
    border-color: v-bind('vars.successColor');
  }
}

.wangeditor-toolbar-warning-status {
  --w-e-toolbar-border-color: v-bind('vars.warningColor');
  :deep(.w-e-toolbar) {
    border-color: v-bind('vars.warningColor');
  }
}

.wangeditor-toolbar-error-status {
  --w-e-toolbar-border-color: v-bind('vars.errorColor');
  :deep(.w-e-toolbar) {
    border-color: v-bind('vars.errorColor');
  }
}

.wangeditor-editor {
  --w-e-textarea-border-color: v-bind('vars.borderColor');
  :deep(.w-e-text-container) {
    border: 1px solid v-bind('vars.borderColor');
    border-top: none;
    border-radius: 0 0 v-bind('vars.borderRadius') v-bind('vars.borderRadius');
    transition: border-color 0.3s v-bind('vars.cubicBezierEaseInOut');
  }
}

.wangeditor-editor-success-status {
  --w-e-toolbar-border-color: v-bind('vars.successColor');
  :deep(.w-e-text-container) {
    border-color: v-bind('vars.successColor');
  }
}

.wangeditor-editor-warning-status {
  --w-e-toolbar-border-color: v-bind('vars.warningColor');
  :deep(.w-e-text-container) {
    border-color: v-bind('vars.warningColor');
  }
}

.wangeditor-editor-error-status {
  --w-e-toolbar-border-color: v-bind('vars.errorColor');
  :deep(.w-e-text-container) {
    border-color: v-bind('vars.errorColor');
  }
}
</style>
