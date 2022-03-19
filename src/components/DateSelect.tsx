import React from "react";
import { Input } from "reactstrap";

interface Props {
  value?: Date;
  onChange: (value: Date) => void;
}

export default function DateSelect({ value, onChange }: Props) {
  return <Input type='date' placeholder="yyyy-MM-dd"
    value={value && value.toLocaleDateString('en-CA')}
    onChange={(e) => onChange(new Date(e.target.value))} />
}