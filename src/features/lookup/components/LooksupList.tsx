import { useEffect } from "react";
import { Card, CardBody } from "reactstrap";

interface Props {
    header: string;
}

export default function LookupList({ header }: Props) {
    useEffect(() => {console.log(header + ' loaded');}, []);

    return <Card>
        <CardBody>
            {header + ' Comes here'}
        </CardBody>
    </Card>
}
