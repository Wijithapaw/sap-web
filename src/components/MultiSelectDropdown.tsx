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
  options: ListItem[];
  onSelect: (selectedIds: string[]) => void;
}

export default function MultiSelectDropdown({ options, onSelect }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    onSelect(selectedIds);
  }, [selectedIds])

  return <Multiselect
    options={options}
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