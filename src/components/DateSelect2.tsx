import React from "react";
import { Input } from "reactstrap";

interface Props {
  value?: string;
  onChange: (value: string) => void;
}

export default function DateSelect2({ value, onChange }: Props) {
  return <Input type='date'
    value={value || ''}
    onChange={(e) => onChange(e.target.value)} />
}
