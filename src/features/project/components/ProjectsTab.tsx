import { useEffect } from "react";
import { Card, CardBody } from "reactstrap";
import ProjectList from "./ProjectList";
import ProjectsFilters from "./ProjectsFilters";

export default function ProjectsTab() {
    useEffect(() => { console.log('projects loaded'); }, []);

    return <Card>
        <CardBody>
            <ProjectsFilters></ProjectsFilters>
            <ProjectList></ProjectList>
        </CardBody>
    </Card>
}