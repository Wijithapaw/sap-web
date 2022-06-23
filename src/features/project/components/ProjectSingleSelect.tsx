import { useAppSelector } from "../../../app/hooks";
import Dropdown from "../../../components/Dropdown";
import { projectsSelector } from "../../finance/finance-slice";

interface Props {
  selectedValue: string;
  onChange: (val: string) => void;
}

export default function ProjectSingleSelect({selectedValue, onChange}: Props) {
  const projectsListItems = useAppSelector(projectsSelector);
  
  return  <Dropdown name="projectId"
  items={projectsListItems}
  selectedValue={selectedValue}
  onChange={onChange}
  placeholder="Select a project" />
}
