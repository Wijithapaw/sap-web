import React from 'react';

interface Props {
  value: string;
}

export default function PageTitle({ value }: Props) {
  return <h4 className="mt-2 mb-4" style={{ borderBottom: '1px solid black' }}>{value}</h4>
}
