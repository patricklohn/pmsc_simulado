import 'styled-components';
import type { iTheme } from './theme';

declare module 'styled-components' {
  // Os componentes enxergam os tokens tipados em `props.theme`. O nome é imposto pelo styled-components.
  // eslint-disable-next-line @typescript-eslint/naming-convention
  export interface DefaultTheme extends iTheme {}
}
