import React from 'react';
import { Input } from 'reactstrap';
import { ListItem } from '../app/types';

interface Props {
  name: string;
  selectedValue?: string;
  items: ListItem[];
  showEmptyRow?: boolean;
  placeholder: string;
  onChange: (value: string) => void;
}

export default function Dropdown({ name, selectedValue = '', items, showEmptyRow = true, placeholder, onChange }: Props) {
  return <Input
    id="exampleSelect"
    name={name}
    type="select"
    value={selectedValue}
    onChange={(e) => onChange(e.target.value)}
  >
    {showEmptyRow && <option label={placeholder || 'Please select'} value='' />}
    {items.map(i => <option key={i.key} label={i.value} value={i.key} />)}
  </Input>
}
