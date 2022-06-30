import { useEffect, useMemo, useState } from "react";
import { Column } from "react-table";
import { Button, Card, CardBody, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { NotificationType, showNotification } from "../../../app/notification-service";
import IconButton from "../../../components/IconButton";
import SapTable from "../../../components/SapTable";
import { deleteLookup } from "../lookup-api";
import { getLookupHeaderAsync, getLookupsByHeaderAsync, lookupHeaderSelector, lookupsSelector } from "../lookup-slice";
import { Lookup } from "../types";
import LookupEntryScreenForm from "./LookupEntryForm";

interface Props {
    headerCode: string;
}

export default function LookupList({ headerCode }: Props) {
    const [addNew, setAddNew] = useState(false);
    const [editingId, setEdititngId] = useState<string>();

    const dispatch = useAppDispatch();

    const lookupHeader = useAppSelector(lookupHeaderSelector)(headerCode);
    const lookups = useAppSelector(lookupsSelector)(headerCode);

    useEffect(() => {
        dispatch(getLookupHeaderAsync(headerCode));
    }, [headerCode]);

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
                                        handleDelete(props.value);
                                }} />}
                            <IconButton className='ms-2' icon='eye' onClick={() => { setEdititngId(props.value); }} />
                        </div>
                    }
                },
            ];

            return cols;
        }, []);

    const handleDelete = (id: string) => {
        deleteLookup(id).then(() => {
            showNotification(NotificationType.success, 'Lookup deleted');  
            dispatch(getLookupsByHeaderAsync(lookupHeader));    
        }).catch((err) => {
            showNotification(NotificationType.error, 'Error in deleting lookup');  
        })
    }

    const toggleModal = () => {
        setAddNew(false);
        setEdititngId(undefined);
    }

    return <Card>
        <CardBody>
            <Row>
                <Col>
                    {lookupHeader && lookupHeader.name}
                </Col>
                <Col className="text-end">
                    <Button color="primary" onClick={() => setAddNew(true)}>Add New</Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <hr />
                </Col>
            </Row>
            <Row>
                <Col>
                    <SapTable data={lookups} columns={columns} />
                </Col>
            </Row>
            {lookupHeader &&
                <Modal size="md" centered toggle={toggleModal} isOpen={addNew || !!editingId}>
                    <ModalHeader toggle={toggleModal}>{editingId ? 'Update ': 'Create '}Lookup</ModalHeader>
                    <ModalBody>
                        <LookupEntryScreenForm headerId={lookupHeader.id}  editingId={editingId}
                            onSave={(id) => {
                                dispatch(getLookupsByHeaderAsync(lookupHeader));
                            }} />
                    </ModalBody>
                </Modal>
            }
        </CardBody>
    </Card>
}
