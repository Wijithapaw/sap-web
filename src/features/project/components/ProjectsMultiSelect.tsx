import { useEffect, useMemo, useState } from "react";
import { Col, Input, Label, Row } from "reactstrap";
import { useAppSelector } from "../../../app/hooks";
import MultiSelectDropdown from "../../../components/MultiSelectDropdown";
import { projectsSelector } from "../../finance/finance-slice";

interface Props {
  selectedIds: string[];
  onSelect: (values: string[]) => void;
}

export default function ProjectsMultiSelect({ selectedIds, onSelect }: Props) {
  const [showInactive, setShowInactive] = useState(false);
  const projectsList = useAppSelector(projectsSelector);

  const projectsOptions = useMemo(() => {
    const projectsToShow = projectsList.filter(p => showInactive || !p.inactive)
    const projs = [...projectsToShow]
    const allProjIds = ['all', ...projs.map(p => p.key)].join(",");
    projs.splice(0, 0, { key: allProjIds, value: "All" })
    return projs;
  }, [projectsList, showInactive])

  useEffect(() => {
    const refinedValues = [...selectedIds];

    const allIndex = refinedValues.findIndex(v => v.startsWith('all'));
    if (allIndex >= 0) {
      refinedValues.splice(allIndex, 1, projectsOptions[0].key);
    }

    const removeIndexes: number[] = [];
    refinedValues.forEach((val, index) => {
      const project = projectsOptions.find(p => p.key === val);
      if (!project) removeIndexes.push(index);
    })

    removeIndexes.forEach(index => {
      refinedValues.splice(index, 1);
    });

    onSelect(refinedValues);

  }, [projectsOptions])

  return <Row>
    <Col>
      <MultiSelectDropdown
        selectedIds={selectedIds}
        placeHolder="Projects"
        options={projectsOptions}
        onSelect={onSelect} />
    </Col>
    <Col xs="auto" className="pt-2 ps-0">
      <Input id="cbkShowInactive" type="checkbox" className="me-1" onChange={(e) => setShowInactive(e.target.checked)} />
      <Label check for="cbkShowInactive">
        Show Inactive
      </Label>
    </Col>
  </Row>
}
