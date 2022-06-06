import { useMemo } from "react";
import { SapPermissions } from "../../../app/constants";
import { useAppSelector } from "../../../app/hooks";
import MultiSelectDropdown from "../../../components/MultiSelectDropdown";
import { hasPermission } from "../../auth/auth-slice";
import { projectsSelector } from "../../finance/finance-slice";

interface Props {
  initialValues: string[];
  onSelect: (values: string[]) => void;
}

export default function ProjectsMultiSelect({initialValues, onSelect}: Props) {

  const projectsList = useAppSelector(projectsSelector);
  
  const hasAllProjectPermission = useAppSelector((state) => hasPermission(state, SapPermissions.projectsFullAccess))

  const projectsOptions = useMemo(() => {
    const projs = [...projectsList]
    if (hasAllProjectPermission) {
      projs.splice(0, 0, { key: "*", value: "All Projects" })
    }
    return projs;
  }, [projectsList])

  return <MultiSelectDropdown
    initialValues={initialValues}
    placeHolder="Projects"
    options={projectsOptions}
    onSelect={onSelect} />
}
