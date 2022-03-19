import React from 'react';
import PageTitle from '../../../components/PageTitle';
import DataEntryForm from './DataEntryForm';

export default function DataEntryPage() {
  return <><PageTitle value="Data Entry" />
    <div><DataEntryForm /></div>
  </>
}