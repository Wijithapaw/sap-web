import { useEffect } from "react";
import { Card, CardBody } from "reactstrap";

export default function ProjectList(){
    useEffect(() => {console.log('projects loaded');}, []);

    return <Card>
        <CardBody>
            Project list comes here.
        </CardBody>
    </Card>
}