import * as React from 'react';
import { CreditCardEntry } from './CreditCardEntry';

export interface HiddenCreditCardEntryProps {
  label: string
  value: string
}

export interface HiddenCreditCardEntryState {
  hidden: boolean;
}

export class HiddenCreditCardEntry extends React.Component<HiddenCreditCardEntryProps, HiddenCreditCardEntryState> {
  state = { hidden: true }

  async toggle() {
    return this.setState({ hidden: !this.state.hidden })
  }

  render() {
    const { label, value } = this.props;
    const { hidden = false } = this.state;

    return (
      <CreditCardEntry
        label={label}
        value={hidden ? Array.from(value).map(() => '*').join(' ') : value}
        icon={hidden ? 'bullseye' : 'panorama-fisheye'}
        onPress={() => this.toggle()} />
    )
  }

}