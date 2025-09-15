import type { ExtractPublicPropTypes, PropType } from 'vue'
import type { LoadingOptions } from '@/directive/loading/types'

export const proPageProps = {
  /**
   * v-loading 配置
   */
  loading: [Boolean, Object] as PropType<boolean | LoadingOptions>,
  /**
   * 底部区域高度
   */
  footerHeight: Number,
} as const

export type ProPageProps = ExtractPublicPropTypes<typeof proPageProps>
