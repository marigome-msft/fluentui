import * as React from 'react';
import type { TableContextValues, TableProps, TableSlots, TableState } from '../Table/Table.types';
import type {
  SortState,
  TableState as HeadlessTableState,
  UseTableSortOptions,
  SelectionMode,
  UseTableSelectionOptions,
  OnSelectionChangeData,
} from '../../hooks';
import { TableRowProps } from '../TableRow/TableRow.types';

export type DataGridSlots = TableSlots;

export type FocusMode = 'none' | 'cell';

export type DataGridContextValues = TableContextValues & {
  dataGrid: DataGridContextValue;
};

// Use any here since we can't know the user types
// The user is responsible for narrowing the type downstream
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DataGridContextValue = HeadlessTableState<any> & {
  /**
   * How focus navigation will work in the datagrid
   * @default none
   */
  focusMode: FocusMode;

  /**
   * Lets child components know if rows selection is enabled
   * @see selectionMode prop enables row selection on the component
   */
  selectableRows: boolean;

  /**
   * Enables subtle selection style
   * @default false
   */
  subtleSelection: boolean;

  /**
   * Row appearance when selected
   * @default brand
   */
  selectionAppearance: TableRowProps['appearance'];
};

/**
 * DataGrid Props
 */
export type DataGridProps = TableProps &
  Pick<DataGridContextValue, 'items' | 'columns' | 'getRowId'> &
  Pick<Partial<DataGridContextValue>, 'focusMode' | 'subtleSelection' | 'selectionAppearance'> &
  Pick<UseTableSortOptions, 'sortState' | 'defaultSortState'> &
  Pick<UseTableSelectionOptions, 'defaultSelectedItems' | 'selectedItems'> & {
    onSortChange?: (e: React.MouseEvent, sortState: SortState) => void;
    onSelectionChange?: (e: React.MouseEvent | React.KeyboardEvent, data: OnSelectionChangeData) => void;
    /**
     * Enables row selection and sets the selection mode
     * @default false
     */
    selectionMode?: SelectionMode;
  };

/**
 * State used in rendering DataGrid
 */
export type DataGridState = TableState & { tableState: HeadlessTableState<unknown> } & Pick<
    DataGridContextValue,
    'focusMode' | 'selectableRows' | 'subtleSelection' | 'selectionAppearance' | 'getRowId'
  >;
