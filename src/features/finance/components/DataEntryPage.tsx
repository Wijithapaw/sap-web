import { Card, CardBody } from 'reactstrap';
import DataEntryForm from './DataEntryForm';

export default function DataEntryPage() {
  return <Card className="mt-2">
    <CardBody><DataEntryForm /></CardBody>
  </Card>
}