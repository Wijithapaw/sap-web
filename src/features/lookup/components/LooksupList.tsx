import { useEffect, useMemo } from "react";
import { Column } from "react-table";
import { Card, CardBody, Col, Row } from "reactstrap";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import IconButton from "../../../components/IconButton";
import SapTable from "../../../components/SapTable";
import { getLookupHeaderAsync, getLookupsByHeaderAsync, lookupHeaderSelector, lookupsSelector } from "../lookup-slice";
import { Lookup } from "../types";

interface Props {
    header: string;
}

export default function LookupList({ header }: Props) {
    const dispatch = useAppDispatch();

    const lookupHeader = useAppSelector(lookupHeaderSelector)(header);
    const lookups = useAppSelector(lookupsSelector)(header);

    useEffect(() => {
        dispatch(getLookupHeaderAsync(header));
    }, [header]);

    useEffect(() => {
        lookupHeader && dispatch(getLookupsByHeaderAsync(lookupHeader));
    }, [lookupHeader]);

    const columns = useMemo<Column<Lookup>[]>(
        () => {
            const cols: Column<Lookup>[] = [
                {
                    Header: 'Code',
                    accessor: 'code',
                },
                {
                    Header: 'Name',
                    accessor: 'name',
                },
                {
                    Header: 'Active',
                    accessor: 'inactive',
                    Cell: props => <div>{props.value ? 'No' : 'Yes'}</div>
                },
                {
                    Header: () => '',
                    accessor: 'id',
                    Cell: props => {
                        return <div style={{ textAlign: "right" }}>
                            {
                                <IconButton className='text-danger' icon='trash' onClick={() => {
                                    if (window.confirm('Are you sure you want to delete this transaction?'))
                                        console.log('delete');
                                }} />}
                            <IconButton className='ms-2' icon='eye' onClick={() => { }} />
                        </div>
                    }
                },
            ];

            return cols;
        }, []);

    return <Card>
        <CardBody>
            <Row>
                <Col>
                    {lookupHeader && lookupHeader.name}
                    <hr />
                </Col>
            </Row>
            <Row>
                <Col>
                    <SapTable data={lookups} columns={columns} />
                </Col>
            </Row>
        </CardBody>
    </Card>
}
