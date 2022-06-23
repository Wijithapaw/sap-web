import { Card, CardBody } from 'reactstrap';
import TransactionEntryForm from './TransactionEntryForm';

export default function TransactionEntryPage() {
  return <Card className="mt-2">
    <CardBody><TransactionEntryForm /></CardBody>
  </Card>
}