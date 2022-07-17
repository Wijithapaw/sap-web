import { useMemo } from "react";
import { useAppSelector } from "../../../app/hooks";
import Dropdown from "../../../components/Dropdown";
import { projectsSelector } from "../../finance/finance-slice";

interface Props {
  selectedValue: string;
  onChange: (val: string) => void;
  showInactive?: boolean;
}

export default function ProjectSingleSelect({ selectedValue, onChange, showInactive }: Props) {
  const projectsListItems = useAppSelector(projectsSelector);

  const projectsOptions = useMemo(() => {
    const projectsToShow = projectsListItems.filter(p => showInactive || !p.inactive)
    return projectsToShow;
  }, [projectsListItems, showInactive]);

  return <Dropdown name="projectId"
    items={projectsOptions}
    selectedValue={selectedValue}
    onChange={onChange}
    placeholder="Select a project" />
}
