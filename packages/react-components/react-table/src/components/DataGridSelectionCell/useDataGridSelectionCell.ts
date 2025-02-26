import * as React from 'react';
import { useEventCallback } from '@fluentui/react-utilities';
import { useDataGridContext_unstable } from '../../contexts/dataGridContext';
import { useRowIdContext } from '../../contexts/rowIdContext';
import { useIsInTableHeader } from '../../contexts/tableHeaderContext';
import { useTableSelectionCell_unstable } from '../TableSelectionCell/useTableSelectionCell';
import type { DataGridSelectionCellProps, DataGridSelectionCellState } from './DataGridSelectionCell.types';

/**
 * Create the state required to render DataGridSelectionCell.
 *
 * The returned state can be modified with hooks such as useDataGridSelectionCellStyles_unstable,
 * before being passed to renderDataGridSelectionCell_unstable.
 *
 * @param props - props from this instance of DataGridSelectionCell
 * @param ref - reference to root HTMLElement of DataGridSelectionCell
 */
export const useDataGridSelectionCell_unstable = (
  props: DataGridSelectionCellProps,
  ref: React.Ref<HTMLElement>,
): DataGridSelectionCellState => {
  const isHeader = useIsInTableHeader();
  const rowId = useRowIdContext();
  const multiselect = useDataGridContext_unstable(ctx => ctx.selection.selectionMode === 'multiselect');
  const subtle = useDataGridContext_unstable(ctx => ctx.subtleSelection);
  const checked = useDataGridContext_unstable(ctx => {
    if (isHeader && multiselect) {
      return ctx.selection.allRowsSelected ? true : ctx.selection.someRowsSelected ? 'mixed' : false;
    }

    return ctx.selection.isRowSelected(rowId);
  });

  const toggleAllRows = useDataGridContext_unstable(ctx => ctx.selection.toggleAllRows);
  const type = useDataGridContext_unstable(ctx =>
    ctx.selection.selectionMode === 'multiselect' ? 'checkbox' : 'radio',
  );

  const onClick = useEventCallback((e: React.MouseEvent<HTMLTableCellElement>) => {
    if (isHeader) {
      toggleAllRows(e);
    }

    props.onClick?.(e);
  });

  return useTableSelectionCell_unstable(
    {
      as: 'div',
      role: 'gridcell',
      checked,
      type,
      tabIndex: 0,
      hidden: isHeader && !multiselect,
      subtle,
      checkboxIndicator: { tabIndex: -1 },
      ...props,
      onClick,
    },
    ref,
  );
};
