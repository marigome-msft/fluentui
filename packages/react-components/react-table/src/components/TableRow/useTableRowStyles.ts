import { makeStyles, mergeClasses, shorthands } from '@griffel/react';
import { tokens } from '@fluentui/react-theme';
import type { TableRowSlots, TableRowState } from './TableRow.types';
import type { SlotClassNames } from '@fluentui/react-utilities';
import { tableCellActionsClassNames } from '../TableCellActions/useTableCellActionsStyles';
import { tableSelectionCellClassNames } from '../TableSelectionCell/useTableSelectionCellStyles';
import { createCustomFocusIndicatorStyle } from '@fluentui/react-tabster';
import { useIsInTableHeader } from '../../contexts/tableHeaderContext';

export const tableRowClassName = 'fui-TableRow';
export const tableRowClassNames: SlotClassNames<TableRowSlots> = {
  root: tableRowClassName,
};

const useTableLayoutStyles = makeStyles({
  root: {
    display: 'table-row',
  },
});

const useFlexLayoutStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
});

/**
 * Styles for the root slot
 */
const useStyles = makeStyles({
  root: {
    color: tokens.colorNeutralForeground1,
    boxSizing: 'border-box',
    ...createCustomFocusIndicatorStyle(
      {
        [`& .${tableSelectionCellClassNames.root}`]: {
          opacity: 1,
        },
        [`& .${tableCellActionsClassNames.root}`]: {
          opacity: 1,
        },
      },
      { selector: 'focus-within' },
    ),
    ...createCustomFocusIndicatorStyle(
      {
        ...shorthands.outline('2px', 'solid', tokens.colorStrokeFocus2),
        ...shorthands.borderRadius(tokens.borderRadiusMedium),
      },
      { selector: 'focus', enableOutline: true },
    ),
  },

  // When focus is within the row the background colour
  // should be the same as hover, except when there is a brand
  // or neutral appearance applied on the row
  noAppearanceFocusWithin: {
    ...createCustomFocusIndicatorStyle(
      {
        [`& .${tableCellActionsClassNames.root}`]: {
          backgroundColor: tokens.colorSubtleBackgroundHover,
        },

        backgroundColor: tokens.colorSubtleBackgroundHover,
      },
      { selector: 'focus-within' },
    ),
  },

  rootInteractive: {
    ':active': {
      backgroundColor: tokens.colorSubtleBackgroundPressed,
      color: tokens.colorNeutralForeground1Pressed,
      [`& .${tableCellActionsClassNames.root}`]: {
        backgroundColor: tokens.colorSubtleBackgroundPressed,
        opacity: 1,
      },
      [`& .${tableSelectionCellClassNames.root}`]: {
        opacity: 1,
      },
    },
    ':hover': {
      backgroundColor: tokens.colorSubtleBackgroundHover,
      color: tokens.colorNeutralForeground1Hover,
      [`& .${tableCellActionsClassNames.root}`]: {
        backgroundColor: tokens.colorSubtleBackgroundHover,
        opacity: 1,
      },
      [`& .${tableSelectionCellClassNames.root}`]: {
        opacity: 1,
      },
    },
  },

  medium: {
    ...shorthands.borderBottom(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
  },

  small: {
    ...shorthands.borderBottom(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
  },

  'extra-small': {
    fontSize: tokens.fontSizeBase200,
  },

  brand: {
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorNeutralForeground1Hover,
    ...shorthands.borderColor(tokens.colorNeutralStrokeOnBrand),
    ':hover': {
      backgroundColor: tokens.colorBrandBackground2,
    },
    ':active': {
      backgroundColor: tokens.colorBrandBackgroundInvertedSelected,
    },

    '@media(forced-colors: active)': {
      ...shorthands.border('2px', 'solid', 'transparent'),
      ...shorthands.borderRadius(tokens.borderRadiusMedium),
      boxSizing: 'border-box',
      ':focus-visible': {
        outlineOffset: '-4px',
      },
    },
  },

  neutral: {
    '@media(forced-colors: active)': {
      ...shorthands.border('2px', 'solid', 'transparent'),
      ...shorthands.borderRadius(tokens.borderRadiusMedium),
      boxSizing: 'border-box',
      ':focus-visible': {
        outlineOffset: '-4px',
      },
    },
    backgroundColor: tokens.colorSubtleBackgroundSelected,
    color: tokens.colorNeutralForeground1Hover,

    ':active': {
      backgroundColor: tokens.colorSubtleBackgroundSelected,
    },
    ...shorthands.borderColor(tokens.colorNeutralStrokeOnBrand),
  },

  none: {},
});

/**
 * Apply styling to the TableRow slots based on the state
 */
export const useTableRowStyles_unstable = (state: TableRowState): TableRowState => {
  const isHeaderRow = useIsInTableHeader();
  const styles = useStyles();
  const layoutStyles = {
    table: useTableLayoutStyles(),
    flex: useFlexLayoutStyles(),
  };
  state.root.className = mergeClasses(
    tableRowClassNames.root,
    styles.root,
    !isHeaderRow && styles.rootInteractive,
    styles[state.size],
    state.noNativeElements ? layoutStyles.flex.root : layoutStyles.table.root,
    styles[state.appearance],
    state.appearance === 'none' && !isHeaderRow && styles.noAppearanceFocusWithin,
    state.root.className,
  );

  return state;
};
