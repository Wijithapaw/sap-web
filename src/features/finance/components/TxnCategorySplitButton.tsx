import { Button, ButtonGroup } from "reactstrap";
import { TxnCategory } from "../types";

interface Props {
    value?: TxnCategory;
    onChange: (val?: TxnCategory) => void;
}

export default function TxnCategorySplitButton({ value, onChange }: Props) {
    return <ButtonGroup>
        <Button color="primary" outline onClick={() => onChange(undefined)} active={value === undefined}>All</Button>
        <Button color="primary" outline onClick={() => onChange(TxnCategory.Expense)} active={value === TxnCategory.Expense}>Expense</Button>
        <Button color="primary" outline onClick={() => onChange(TxnCategory.Income)} active={value === TxnCategory.Income}>Income</Button>
    </ButtonGroup>
}