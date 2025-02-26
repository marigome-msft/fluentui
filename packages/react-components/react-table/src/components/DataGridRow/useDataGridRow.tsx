import * as React from 'react';
import type { DataGridRowProps, DataGridRowState } from './DataGridRow.types';
import { useTableRow_unstable } from '../TableRow/useTableRow';
import { useDataGridContext_unstable } from '../../contexts/dataGridContext';
import { ColumnIdContextProvider } from '../../contexts/columnIdContext';
import { DataGridSelectionCell } from '../DataGridSelectionCell/DataGridSelectionCell';
import { useRowIdContext } from '../../contexts/rowIdContext';
import { useEventCallback } from '@fluentui/react-utilities';
import { useIsInTableHeader } from '../../contexts/tableHeaderContext';
import { resolveShorthand } from '@fluentui/react-utilities';

/**
 * Create the state required to render DataGridRow.
 *
 * The returned state can be modified with hooks such as useDataGridRowStyles_unstable,
 * before being passed to renderDataGridRow_unstable.
 *
 * @param props - props from this instance of DataGridRow
 * @param ref - reference to root HTMLElement of DataGridRow
 */
export const useDataGridRow_unstable = (props: DataGridRowProps, ref: React.Ref<HTMLElement>): DataGridRowState => {
  const rowId = useRowIdContext();
  const isHeader = useIsInTableHeader();
  const columnDefs = useDataGridContext_unstable(ctx => ctx.columns);
  const selectable = useDataGridContext_unstable(ctx => ctx.selectableRows);
  const selected = useDataGridContext_unstable(ctx => ctx.selection.isRowSelected(rowId));
  const appearance = useDataGridContext_unstable(ctx => {
    if (!isHeader && selectable && ctx.selection.isRowSelected(rowId)) {
      return ctx.selectionAppearance;
    }

    return 'none';
  });
  const toggleRow = useDataGridContext_unstable(ctx => ctx.selection.toggleRow);

  const cellRenderFunction = props.children;
  const cells = columnDefs.map(columnDef => {
    return (
      <ColumnIdContextProvider value={columnDef.columnId} key={columnDef.columnId}>
        {cellRenderFunction(columnDef)}
      </ColumnIdContextProvider>
    );
  });

  const onClick = useEventCallback((e: React.MouseEvent<HTMLTableRowElement>) => {
    if (selectable && !isHeader) {
      toggleRow(e, rowId);
    }

    props.onClick?.(e);
  });

  const onKeyDown = useEventCallback((e: React.KeyboardEvent<HTMLTableRowElement>) => {
    if (selectable && !isHeader && e.key === ' ') {
      toggleRow(e, rowId);
    }

    props.onKeyDown?.(e);
  });

  const baseState = useTableRow_unstable(
    {
      appearance,
      'aria-selected': selectable ? selected : undefined,
      ...props,
      onClick,
      onKeyDown,
      children: cells,
      as: 'div',
    },
    ref,
  );

  return {
    ...baseState,
    components: {
      ...baseState.components,
      selectionCell: DataGridSelectionCell,
    },
    selectionCell: resolveShorthand(props.selectionCell, { required: selectable }),
  };
};
