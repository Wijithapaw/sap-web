import { Button, ButtonGroup } from "reactstrap";

interface Props {
    value?: boolean;
    onChange: (val?: boolean) => void;
}

export default function TxnReconciledSplitButton({ value, onChange }: Props) {
    return <ButtonGroup>
        <Button color="primary" outline onClick={() => onChange(undefined)} active={value === undefined}>All</Button>
        <Button color="primary" outline onClick={() => onChange(true)} active={value === true}>Reconciled</Button>
        <Button color="primary" outline onClick={() => onChange(false)} active={value === false}>Unreconciled</Button>
    </ButtonGroup>
}