import { App } from 'vue'

import { formatUtcString } from '@/utils/data-format'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function registerProperties(app: App) {
  app.config.globalProperties.$filters = {
    foo() {
      console.log('foo')
    },
    formaTime(value: string) {
      return formatUtcString(value)
    }
  }
}
