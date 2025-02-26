import * as React from 'react';
import {
  FolderRegular,
  EditRegular,
  OpenRegular,
  DocumentRegular,
  PeopleRegular,
  DocumentPdfRegular,
  VideoRegular,
} from '@fluentui/react-icons';
import { PresenceBadgeStatus, Avatar, Checkbox } from '@fluentui/react-components';
import { TableCellLayout } from '@fluentui/react-components/unstable';
import {
  DataGridBody,
  DataGridRow,
  DataGrid,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridCell,
  ColumnDefinition,
  RowState,
  createColumn,
  RowId,
  DataGridProps,
} from '@fluentui/react-table';

type FileCell = {
  label: string;
  icon: JSX.Element;
};

type LastUpdatedCell = {
  label: string;
  timestamp: number;
};

type LastUpdateCell = {
  label: string;
  icon: JSX.Element;
};

type AuthorCell = {
  label: string;
  status: PresenceBadgeStatus;
};

type Item = {
  file: FileCell;
  author: AuthorCell;
  lastUpdated: LastUpdatedCell;
  lastUpdate: LastUpdateCell;
};

const items: Item[] = [
  {
    file: { label: 'Meeting notes', icon: <DocumentRegular /> },
    author: { label: 'Max Mustermann', status: 'available' },
    lastUpdated: { label: '7h ago', timestamp: 1 },
    lastUpdate: {
      label: 'You edited this',
      icon: <EditRegular />,
    },
  },
  {
    file: { label: 'Thursday presentation', icon: <FolderRegular /> },
    author: { label: 'Erika Mustermann', status: 'busy' },
    lastUpdated: { label: 'Yesterday at 1:45 PM', timestamp: 2 },
    lastUpdate: {
      label: 'You recently opened this',
      icon: <OpenRegular />,
    },
  },
  {
    file: { label: 'Training recording', icon: <VideoRegular /> },
    author: { label: 'John Doe', status: 'away' },
    lastUpdated: { label: 'Yesterday at 1:45 PM', timestamp: 2 },
    lastUpdate: {
      label: 'You recently opened this',
      icon: <OpenRegular />,
    },
  },
  {
    file: { label: 'Purchase order', icon: <DocumentPdfRegular /> },
    author: { label: 'Jane Doe', status: 'offline' },
    lastUpdated: { label: 'Tue at 9:30 AM', timestamp: 3 },
    lastUpdate: {
      label: 'You shared this in a Teams chat',
      icon: <PeopleRegular />,
    },
  },
];

export const CustomRowId = () => {
  const columns: ColumnDefinition<Item>[] = React.useMemo(
    () => [
      createColumn<Item>({
        columnId: 'file',
        compare: (a, b) => {
          return a.file.label.localeCompare(b.file.label);
        },
        renderHeaderCell: () => {
          return 'File';
        },
        renderCell: item => {
          return <TableCellLayout media={item.file.icon}>{item.file.label}</TableCellLayout>;
        },
      }),
      createColumn<Item>({
        columnId: 'author',
        compare: (a, b) => {
          return a.author.label.localeCompare(b.author.label);
        },
        renderHeaderCell: () => {
          return 'Author';
        },
        renderCell: item => {
          return (
            <TableCellLayout media={<Avatar badge={{ status: item.author.status }} />}>
              {item.author.label}
            </TableCellLayout>
          );
        },
      }),
      createColumn<Item>({
        columnId: 'lastUpdated',
        compare: (a, b) => {
          return a.lastUpdated.timestamp - b.lastUpdated.timestamp;
        },
        renderHeaderCell: () => {
          return 'Last updated';
        },

        renderCell: item => {
          return item.lastUpdated.label;
        },
      }),
      createColumn<Item>({
        columnId: 'lastUpdate',
        compare: (a, b) => {
          return a.lastUpdate.label.localeCompare(b.lastUpdate.label);
        },
        renderHeaderCell: () => {
          return 'Last update';
        },
        renderCell: item => {
          return <TableCellLayout media={item.lastUpdate.icon}>{item.lastUpdate.label}</TableCellLayout>;
        },
      }),
    ],
    [],
  );

  const [selectedRows, setSelectedRows] = React.useState(
    new Set<RowId>(['Thursday presentation']),
  );
  const onSelectionChange: DataGridProps['onSelectionChange'] = (e, data) => {
    setSelectedRows(data.selectedItems);
  };

  return (
    <>
      <ul>
        {items.map(item => (
          <li key={item.file.label}>
            <Checkbox label={item.file.label} checked={selectedRows.has(item.file.label)} />
          </li>
        ))}
      </ul>

      <DataGrid
        items={items}
        columns={columns}
        focusMode="cell"
        selectionMode="multiselect"
        selectedItems={selectedRows}
        onSelectionChange={onSelectionChange}
        getRowId={item => item.file.label}
      >
        <DataGridHeader>
          <DataGridRow>
            {({ renderHeaderCell }: ColumnDefinition<Item>) => (
              <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
            )}
          </DataGridRow>
        </DataGridHeader>
        <DataGridBody>
          {({ item, rowId }: RowState<Item>) => (
            <DataGridRow key={rowId}>
              {({ renderCell }: ColumnDefinition<Item>) => <DataGridCell>{renderCell(item)}</DataGridCell>}
            </DataGridRow>
          )}
        </DataGridBody>
      </DataGrid>
    </>
  );
};

CustomRowId.parameters = {
  docs: {
    description: {
      story: [
        'By default row Ids are the index of the item in the collection. In order to use a row Id based on the data',
        'use the `getRowId` prop.',
      ].join('\n'),
    },
  },
};
