import * as React from 'react';
import type { ComponentProps, ComponentState, Slot } from '@fluentui/react-utilities';
import type { TreeItemElement } from '../TreeItem/TreeItem.types';
import { TreeContextValue } from '../../contexts/treeContext';

export type TreeSlots = {
  root: Slot<'div'>;
};

export type TreeOpenChangeData = { open: boolean; id: string } & (
  | {
      event: React.MouseEvent<TreeItemElement>;
      type: 'click';
    }
  | {
      event: React.KeyboardEvent<TreeItemElement>;
      type: 'arrowRight' | 'arrowLeft';
    }
);

export type TreeOpenChangeEvent = TreeOpenChangeData['event'];

export type TreeContextValues = {
  tree: TreeContextValue;
};

export type TreeProps = ComponentProps<TreeSlots> & {
  /**
   * Controls the state of the open subtrees.
   * These property is ignored for subtrees.
   */
  openSubtrees?: string | string[];
  /**
   * Default value for the uncontrolled state of open subtrees.
   * These property is ignored for subtrees.
   */
  defaultOpenSubtrees?: string | string[];
  /**
   * Callback fired when the component changes value from open state.
   * These property is ignored for subtrees.
   *
   * @param event - a React's Synthetic event
   * @param data - A data object with relevant information,
   * such as open value and type of interaction that created the event
   * and the id of the subtree that is being opened/closed
   */
  onOpenChange?(event: TreeOpenChangeEvent, data: TreeOpenChangeData): void;
};

/**
 * State used in rendering Tree
 */
export type TreeState = ComponentState<TreeSlots> &
  TreeContextValue & {
    open: boolean;
  };
