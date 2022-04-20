import React from "react";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

interface Props {
  value?: Date;
  onChange: (value: Date) => void;
}

export default function DateSelect({ value, onChange }: Props) {
  return <DatePicker selected={value}
    locale="au"
    className="form-control"
    dateFormat="yyyy-MM-dd"
    showYearDropdown
    isClearable
    onChange={onChange} />
}
