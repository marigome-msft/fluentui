import {
  DataGrid,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridBody,
  DataGridRow,
  DataGridCell,
  DataGridSelectionCell,
} from '@fluentui/react-components/unstable';
import descriptionMd from './DataGridDescription.md';

export { Default } from './Default.stories';
export { KeyboardNavigation } from './KeyboardNavigation.stories';
export { Sort } from './Sort.stories';
export { SortControlled } from './SortControlled.stories';
export { MultipleSelect } from './MultipleSelect.stories';
export { MultipleSelectControlled } from './MultipleSelectControlled.stories';
export { SingleSelect } from './SingleSelect.stories';
export { SingleSelectControlled } from './SingleSelectControlled.stories';
export { SubtleSelection } from './SubtleSelection.stories';
export { SelectionAppearance } from './SelectionAppearance.stories';
export { CustomRowId } from './CustomRowId.stories';
export default {
  title: 'Preview Components/DataGrid',
  component: DataGrid,
  subcomponents: {
    DataGridHeader,
    DataGridHeaderCell,
    DataGridBody,
    DataGridRow,
    DataGridCell,
    DataGridSelectionCell,
  },
  parameters: {
    docs: {
      description: {
        component: [descriptionMd].join('\n'),
      },
    },
  },
};
