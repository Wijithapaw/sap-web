import { useEffect } from "react";
import ProjectList from "./ProjectList";
import ProjectsFilters from "./ProjectsFilters";

export default function ProjectsTab(){
    useEffect(() => {console.log('projects loaded');}, []);

    return <div>
        <ProjectsFilters></ProjectsFilters>
        <ProjectList></ProjectList>
    </div>
}