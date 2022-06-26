import { Label } from "reactstrap";

interface Props {
    label: string;
    error?: string;
    touched?: boolean;
}

export default function FormLabel({ label, error, touched }: Props) {
    return <Label className={error && touched ? 'text-danger' : ''}>
        {`${label} ${error && touched ? error : ''}`}
    </Label>
}
