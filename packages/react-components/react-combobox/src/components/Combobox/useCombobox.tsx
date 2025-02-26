import * as React from 'react';
import { ChevronDownRegular as ChevronDownIcon } from '@fluentui/react-icons';
import {
  getPartitionedNativeProps,
  resolveShorthand,
  mergeCallbacks,
  useEventCallback,
  useMergedRefs,
} from '@fluentui/react-utilities';
import { getDropdownActionFromKey } from '../../utils/dropdownKeyActions';
import { useComboboxBaseState } from '../../utils/useComboboxBaseState';
import { useComboboxPopup } from '../../utils/useComboboxPopup';
import { useTriggerListboxSlots } from '../../utils/useTriggerListboxSlots';
import { Listbox } from '../Listbox/Listbox';
import type { Slot } from '@fluentui/react-utilities';
import type { SelectionEvents } from '../../utils/Selection.types';
import type { OptionValue } from '../../utils/OptionCollection.types';
import type { ComboboxProps, ComboboxState } from './Combobox.types';

/**
 * Create the state required to render Combobox.
 *
 * The returned state can be modified with hooks such as useComboboxStyles_unstable,
 * before being passed to renderCombobox_unstable.
 *
 * @param props - props from this instance of Combobox
 * @param ref - reference to root HTMLElement of Combobox
 */
export const useCombobox_unstable = (props: ComboboxProps, ref: React.Ref<HTMLInputElement>): ComboboxState => {
  const baseState = useComboboxBaseState(props);
  const {
    activeOption,
    clearSelection,
    getIndexOfId,
    getOptionsMatchingText,
    hasFocus,
    open,
    selectOption,
    selectedOptions,
    setActiveOption,
    setFocusVisible,
    setOpen,
    setValue,
    value,
  } = baseState;
  const { freeform, multiselect } = props;

  const { primary: triggerNativeProps, root: rootNativeProps } = getPartitionedNativeProps({
    props,
    primarySlotTagName: 'input',
    excludedPropNames: ['children', 'size'],
  });

  const rootRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLInputElement>(null);

  // calculate listbox width style based on trigger width
  const [popupWidth, setPopupWidth] = React.useState<string>();
  React.useEffect(() => {
    const width = open ? `${rootRef.current?.clientWidth}px` : undefined;
    setPopupWidth(width);
  }, [open]);

  // handle input type-to-select
  const getSearchString = (inputValue: string): string => {
    // if there are commas in the value string, take the text after the last comma
    const searchString = inputValue.split(',').pop();

    return searchString?.trim().toLowerCase() || '';
  };

  // set active option and selection based on typing
  const getOptionFromInput = (inputValue: string): OptionValue | undefined => {
    const searchString = getSearchString(inputValue);

    if (searchString.length === 0) {
      return;
    }

    const matcher = (optionText: string) => optionText.toLowerCase().indexOf(searchString) === 0;
    const matches = getOptionsMatchingText(matcher);

    // return first matching option after the current active option, looping back to the top
    if (matches.length > 1 && activeOption) {
      const startIndex = getIndexOfId(activeOption.id);
      const nextMatch = matches.find(option => getIndexOfId(option.id) >= startIndex);
      return nextMatch ?? matches[0];
    }

    return matches[0] ?? undefined;
  };

  /* Handle typed input */

  // reset any typed value when an option is selected
  baseState.selectOption = (ev: SelectionEvents, option: OptionValue) => {
    setValue(undefined);
    selectOption(ev, option);
  };

  const onTriggerBlur = (ev: React.FocusEvent<HTMLInputElement>) => {
    // handle selection and updating value if freeform is false
    if (!baseState.open && !freeform) {
      // select matching option, if the value fully matches
      if (value && activeOption && getSearchString(value) === activeOption?.value.toLowerCase()) {
        baseState.selectOption(ev, activeOption);
      }

      // reset typed value when the input loses focus while collapsed, unless freeform is true
      setValue(undefined);
    }
  };

  baseState.setOpen = (ev, newState: boolean) => {
    if (!newState && !freeform) {
      setValue(undefined);
    }

    setOpen(ev, newState);
  };

  // update value and active option based on input
  const onTriggerChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = ev.target.value;
    // update uncontrolled value
    baseState.setValue(inputValue);

    // handle updating active option based on input
    const matchingOption = getOptionFromInput(inputValue);
    setActiveOption(matchingOption);

    setFocusVisible(true);

    // clear selection for single-select if the input value no longer matches the selection
    if (
      !multiselect &&
      selectedOptions.length === 1 &&
      (inputValue.length < 1 || selectedOptions[0].indexOf(inputValue) !== 0)
    ) {
      clearSelection(ev);
    }
  };

  // open Combobox when typing
  const onTriggerKeyDown = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && getDropdownActionFromKey(ev) === 'Type') {
      setOpen(ev, true);
    }
  };

  // resolve input and listbox slot props
  let triggerSlot: Slot<'input'>;
  let listboxSlot: Slot<typeof Listbox> | undefined;

  triggerSlot = resolveShorthand(props.input, {
    required: true,
    defaultProps: {
      ref: useMergedRefs(props.input?.ref, triggerRef),
      type: 'text',
      value: value ?? '',
      ...triggerNativeProps,
    },
  });

  triggerSlot.onChange = mergeCallbacks(triggerSlot.onChange, onTriggerChange);
  triggerSlot.onBlur = mergeCallbacks(triggerSlot.onBlur, onTriggerBlur);
  triggerSlot.onKeyDown = mergeCallbacks(triggerSlot.onKeyDown, onTriggerKeyDown);

  // only resolve listbox slot if needed
  listboxSlot =
    open || hasFocus
      ? resolveShorthand(props.listbox, {
          required: true,
          defaultProps: {
            children: props.children,
            style: { width: popupWidth },
          },
        })
      : undefined;

  [triggerSlot, listboxSlot] = useComboboxPopup(props, triggerSlot, listboxSlot);
  [triggerSlot, listboxSlot] = useTriggerListboxSlots(props, baseState, ref, triggerSlot, listboxSlot);

  const state: ComboboxState = {
    components: {
      root: 'div',
      input: 'input',
      expandIcon: 'span',
      listbox: Listbox,
    },
    root: resolveShorthand(props.root, {
      required: true,
      defaultProps: {
        ...rootNativeProps,
      },
    }),
    input: triggerSlot,
    listbox: listboxSlot,
    expandIcon: resolveShorthand(props.expandIcon, {
      required: true,
      defaultProps: {
        children: <ChevronDownIcon />,
      },
    }),
    ...baseState,
    setOpen,
  };

  state.root.ref = useMergedRefs(state.root.ref, rootRef);

  /* handle open/close + focus change when clicking expandIcon */
  const { onMouseDown: onIconMouseDown, onClick: onIconClick } = state.expandIcon || {};
  const onExpandIconMouseDown = useEventCallback(
    mergeCallbacks(onIconMouseDown, () => {
      // do not dismiss on blur when closing via clicking the icon
      if (open) {
        baseState.ignoreNextBlur.current = true;
      }
    }),
  );

  const onExpandIconClick = useEventCallback(
    mergeCallbacks(onIconClick, (event: React.MouseEvent<HTMLSpanElement>) => {
      // open and set focus
      state.setOpen(event, !state.open);
      triggerRef.current?.focus();
    }),
  );

  if (state.expandIcon) {
    state.expandIcon.onMouseDown = onExpandIconMouseDown;
    state.expandIcon.onClick = onExpandIconClick;
  }

  return state;
};
