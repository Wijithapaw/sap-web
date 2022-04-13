import React from 'react';
import { Card, CardBody } from 'reactstrap';
import PageTitle from '../../../components/PageTitle';
import DataEntryForm from './DataEntryForm';

export default function DataEntryPage() {
  return <Card className="mt-2">
    <CardBody><DataEntryForm /></CardBody>
  </Card>
}