import { Testable } from '@testable/index';

import ShreddedGlass from './ShreddedGlass';

@Testable({
  path: '/components/ShreddedGlass',
  useFbnBackground: true,
  useOrbitControls: true
})
export default class extends ShreddedGlass {
}
