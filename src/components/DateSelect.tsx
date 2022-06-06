import React from "react";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

interface Props {
  value?: Date;
  onChange: (value: Date) => void;
  placeHolder?: string;
}

export default function DateSelect({ value, onChange, placeHolder }: Props) {
  return <DatePicker selected={value}
    placeholderText={placeHolder}
    className="form-control"
    dateFormat="yyyy-MM-dd"
    showYearDropdown
    isClearable
    onChange={onChange} />
}
