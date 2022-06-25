import SapIcon from "./SapIcon";

interface Props {
    reconciled: boolean;
    reconciledBy?: string;
}

export default function ReconcileStatus({ reconciled, reconciledBy }: Props) {
    return <>
        {reconciled ? <SapIcon icon='check' className='text-success' title={reconciledBy} /> :
            <SapIcon icon='times' className='text-warning' title="Not Reconciled" />}
    </>
}