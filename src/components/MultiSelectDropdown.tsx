import Multiselect from "multiselect-react-dropdown";
import React, { useEffect, useState } from "react";
import { ListItem } from "../app/types";

interface Props {
  selectedIds: string[];
  options: ListItem[];
  onSelect: (selectedIds: string[]) => void;
  placeHolder?: string;
}

export default function MultiSelectDropdown({ selectedIds, options, onSelect, placeHolder }: Props) {
  return <Multiselect placeholder={placeHolder || 'Select'} hidePlaceholder={!!selectedIds.length}
    options={options}
    selectedValues={options.filter(o => selectedIds.includes(o.key))}
    onSelect={(a, b) => {
      onSelect([...selectedIds, b.key])
    }}
    onRemove={(a, b) => {
      const rem = selectedIds.filter(v => v != b.key);
      onSelect(rem);
    }}
    displayValue="value"
  />
}