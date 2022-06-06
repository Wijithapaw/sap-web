import Multiselect from "multiselect-react-dropdown";
import React, { useEffect, useState } from "react";
import { ListItem } from "../app/types";

const options: ListItem[] = [{
  key: 'p1',
  value: 'Project 1'
},
{
  key: 'p2',
  value: 'Project 2'
},
{
  key: 'p3',
  value: 'Project 3'
}]

interface Props {
  initialValues?: string[];
  options: ListItem[];
  onSelect: (selectedIds: string[]) => void;
  placeHolder?: string;
}

export default function MultiSelectDropdown({ initialValues, options, onSelect, placeHolder }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialValues || []);

  useEffect(() => {
    onSelect(selectedIds);
  }, [selectedIds])

  return <Multiselect placeholder={placeHolder || 'Select'} hidePlaceholder={!!selectedIds.length}
    options={options}
    selectedValues={options.filter(o => selectedIds.includes(o.key))}
    onSelect={(a, b) => {
      setSelectedIds([...selectedIds, b.key])
    }}
    onRemove={(a, b) => {
      const rem = selectedIds.filter(v => v != b.key);
      setSelectedIds(rem);
    }}
    displayValue="value"
  />
}