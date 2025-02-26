import { makeStyles, mergeClasses } from '@griffel/react';
import type { TreeItemLayoutSlots, TreeItemLayoutState } from './TreeItemLayout.types';
import type { SlotClassNames } from '@fluentui/react-utilities';

export const treeItemLayoutClassNames: SlotClassNames<TreeItemLayoutSlots> = {
  root: 'fui-TreeItemLayout',
  // TODO: add class names for all slots on TreeItemLayoutSlots.
  // Should be of the form `<slotName>: 'fui-TreeItemLayout__<slotName>`
};

/**
 * Styles for the root slot
 */
const useStyles = makeStyles({
  root: {
    // TODO Add default styles for the root element
  },

  // TODO add additional classes for different states and/or slots
});

/**
 * Apply styling to the TreeItemLayout slots based on the state
 */
export const useTreeItemLayoutStyles_unstable = (state: TreeItemLayoutState): TreeItemLayoutState => {
  const styles = useStyles();
  state.root.className = mergeClasses(treeItemLayoutClassNames.root, styles.root, state.root.className);

  // TODO Add class names to slots, for example:
  // state.mySlot.className = mergeClasses(styles.mySlot, state.mySlot.className);

  return state;
};
