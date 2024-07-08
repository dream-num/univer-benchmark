import { LocaleType } from '@univerjs/core'
import UniverDesignEnUS from '@univerjs/design/locale/en-US'
import UniverDocsUIEnUS from '@univerjs/docs-ui/locale/en-US'
import UniverSheetsEnUS from '@univerjs/sheets/locale/en-US'
import UniverSheetsUIEnUS from '@univerjs/sheets-ui/locale/en-US'
import UniverUiEnUS from '@univerjs/ui/locale/en-US'
import UniverSheetsNumfmtPluginUiEnUS from '@univerjs/sheets-numfmt/locale/en-US'

export const locales = {
  [LocaleType.EN_US]: {
    ...UniverSheetsEnUS,
    ...UniverDocsUIEnUS,
    ...UniverUiEnUS,
    ...UniverDesignEnUS,
    ...UniverSheetsUIEnUS,
    ...UniverSheetsNumfmtPluginUiEnUS,
  },
}
