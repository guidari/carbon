/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import './story.scss';
import { Checkbox as CheckboxIcon } from '@carbon/icons-react';
import React, { useState, useEffect, useRef } from 'react';
import { Popover, PopoverContent } from '../Popover';
import RadioButton from '../RadioButton';
import RadioButtonGroup from '../RadioButtonGroup';
import { default as Checkbox } from '../Checkbox';
import mdx from './Popover.mdx';
import { Settings } from '@carbon/icons-react';
import { keys, match } from '../../internal/keyboard';
import OverflowMenu from '../OverflowMenu/OverflowMenu';
import OverflowMenuItem from '../OverflowMenuItem';

const prefix = 'cds';

export default {
  title: 'Components/Popover',
  component: Popover,
  subcomponents: {
    PopoverContent,
  },
  parameters: {
    controls: {
      hideNoControlsWarning: true,
    },
    docs: {
      page: mdx,
    },
  },
};

const sharedArgTypes = {
  as: {
    table: {
      disable: true,
    },
  },
  children: {
    table: {
      disable: true,
    },
  },
  className: {
    table: {
      disable: true,
    },
  },
  relative: {
    table: {
      disable: true,
    },
  },
};

const DefaultStory = (props) => {
  const { align, caret, dropShadow, highContrast, open } = props;
  return (
    <Popover
      align={align}
      caret={caret}
      dropShadow={dropShadow}
      highContrast={highContrast}
      open={open}
      {...props}>
      <div className="playground-trigger">
        <CheckboxIcon />
      </div>
      <PopoverContent className="p-3">
        <h2 className="popover-title">Available storage</h2>
        <p className="popover-details">
          This server has 150 GB of block storage remaining.
        </p>
      </PopoverContent>
    </Popover>
  );
};

DefaultStory.argTypes = { ...sharedArgTypes };

export const TabTip = (args) => {
  const [open, setOpen] = useState(true);
  const [openTwo, setOpenTwo] = useState(false);
  const align = document?.dir === 'rtl' ? 'bottom-right' : 'bottom-left';
  const alignTwo = document?.dir === 'rtl' ? 'bottom-left' : 'bottom-right';
  return (
    <div className="popover-tabtip-story" style={{ display: 'flex' }}>
      <Popover
        align={align}
        open={open}
        onKeyDown={(evt) => {
          if (match(evt, keys.Escape)) {
            setOpen(false);
          }
        }}
        isTabTip
        onRequestClose={() => setOpen(false)}
        {...args}>
        <button
          aria-label="Settings"
          type="button"
          aria-expanded={open}
          onClick={() => {
            setOpen(!open);
          }}>
          <Settings />
        </button>
        <PopoverContent className="p-3">
          <RadioButtonGroup
            style={{ alignItems: 'flex-start', flexDirection: 'column' }}
            legendText="Row height"
            name="radio-button-group"
            defaultSelected="small">
            <RadioButton labelText="Small" value="small" id="radio-small" />
            <RadioButton labelText="Large" value="large" id="radio-large" />
          </RadioButtonGroup>
          <hr />
          <fieldset className={`${prefix}--fieldset`}>
            <legend className={`${prefix}--label`}>Edit columns</legend>
            <Checkbox defaultChecked labelText="Name" id="checkbox-label-1" />
            <Checkbox defaultChecked labelText="Type" id="checkbox-label-2" />
            <Checkbox
              defaultChecked
              labelText="Location"
              id="checkbox-label-3"
            />
          </fieldset>
        </PopoverContent>
      </Popover>

      <Popover
        open={openTwo}
        isTabTip
        align={alignTwo}
        onRequestClose={() => setOpenTwo(false)}
        {...args}>
        <button
          aria-label="Settings"
          type="button"
          aria-expanded={open}
          onClick={() => {
            setOpenTwo(!openTwo);
          }}>
          <Settings />
        </button>
        <PopoverContent className="p-3">
          <RadioButtonGroup
            style={{ alignItems: 'flex-start', flexDirection: 'column' }}
            legendText="Row height"
            name="radio-button-group-2"
            defaultSelected="small-2">
            <RadioButton labelText="Small" value="small-2" id="radio-small-2" />
            <RadioButton labelText="Large" value="large-2" id="radio-large-2" />
          </RadioButtonGroup>
          <hr />
          <fieldset className={`${prefix}--fieldset`}>
            <legend className={`${prefix}--label`}>Testing</legend>
            <Checkbox defaultChecked labelText="Name" id="checkbox-label-8" />
            <Checkbox defaultChecked labelText="Type" id="checkbox-label-9" />
            <Checkbox
              defaultChecked
              labelText="Location"
              id="checkbox-label-10"
            />
          </fieldset>
        </PopoverContent>
      </Popover>
    </div>
  );
};

TabTip.argTypes = {
  ...sharedArgTypes,
  align: { control: false },
  autoAlign: { control: false },
};

export const Default = DefaultStory.bind({});

Default.args = {
  caret: true,
  dropShadow: true,
  highContrast: false,
  open: true,
};

Default.argTypes = {
  align: {
    options: [
      'top',
      'top-start',
      'top-end',

      'bottom',
      'bottom-start',
      'bottom-end',

      'left',
      'left-end',
      'left-start',

      'right',
      'right-end',
      'right-start',
    ],
    control: {
      type: 'select',
    },
  },
  caret: {
    control: {
      type: 'boolean',
    },
  },
  dropShadow: {
    control: {
      type: 'boolean',
    },
  },
  highContrast: {
    control: {
      type: 'boolean',
    },
  },
  open: {
    control: {
      type: 'boolean',
    },
  },
};

Default.story = {
  decorators: [
    (story) => <div className="mt-10 flex justify-center">{story()}</div>,
  ],
};

export const ExperimentalAutoAlign = (args) => {
  const [open, setOpen] = useState(true);
  const ref = useRef();

  useEffect(() => {
    ref?.current?.scrollIntoView({ block: 'center', inline: 'center' });
  });

  return (
    <div style={{ width: '5000px', height: '5000px' }}>
      <div
        style={{
          position: 'absolute',
          top: '2500px',
          left: '2500px',
        }}>
        <Popover open={open} align="top" autoAlign ref={ref} {...args}>
          <div className="playground-trigger">
            <CheckboxIcon
              onClick={() => {
                setOpen(!open);
              }}
            />
          </div>
          <PopoverContent className="p-3">
            <div>
              <p className="popover-title">This popover uses autoAlign</p>
              <p className="popover-details">
                Scroll the container up, down, left or right to observe how the
                popover will automatically change its position in attempt to
                stay within the viewport. This works on initial render in
                addition to on scroll.
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export const TabTipExperimentalAutoAlign = () => {
  const [open, setOpen] = useState(true);
  const ref = useRef();

  useEffect(() => {
    ref?.current?.scrollIntoView({ block: 'center', inline: 'center' });
  });

  return (
    <div style={{ width: '5000px', height: '5000px' }}>
      <div
        style={{
          position: 'absolute',
          top: '2500px',
          left: '2500px',
        }}>
        <Popover open={open} align="bottom-right" autoAlign ref={ref} isTabTip>
          <div className="playground-trigger">
            <CheckboxIcon
              onClick={() => {
                setOpen(!open);
              }}
            />
          </div>
          <PopoverContent className="p-3">
            <div>
              <p className="popover-title">
                This popover uses autoAlign with isTabTip
              </p>
              <p className="popover-details">
                Scroll the container up, down, left or right to observe how the
                popover will automatically change its position in attempt to
                stay within the viewport. This works on initial render in
                addition to on scroll.
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
