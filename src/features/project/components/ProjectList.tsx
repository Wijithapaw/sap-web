import React, { useEffect, useState } from "react";
import { useTable, Column } from 'react-table'
import { Button, Card, CardBody, Col, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { isMobileSelector, setGlobalError } from "../../../app/core-slice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import IconButton from "../../../components/IconButton";
import SapTable from "../../../components/SapTable";
import { deleteProject } from "../project-api";
import { projectFilterSelector, projectsSelector, removeProjectFromList, updateEditingProjectAsync } from "../project-slice";
import { Project } from "../types";
import ProjectForm from "./ProjectForm";

const ProjectList = () => {
    const dispatch = useAppDispatch();
    const projectFilter = useAppSelector(projectFilterSelector);
    const isMobile = useAppSelector(isMobileSelector);
    const data = useAppSelector(projectsSelector);
    const [editingProjectId, setEditingProjectId] = useState<string>();

    const handleDeleteProject = (id: string) => {
        deleteProject(id).then(() => {
            dispatch(removeProjectFromList(id));
            setEditingProjectId(undefined);
        }).catch(err => {
            dispatch(setGlobalError(err.response.data))
        })
    };

    const columns = React.useMemo<Column<Project>[]>(
        () => {
            const cols: Column<Project>[] = [
                {
                    Header: 'Name',
                    accessor: 'name'
                },
                {
                    Header: () => '',
                    accessor: 'id',
                    Cell: props => {
                        return <div style={{ textAlign: "right" }}>
                            <IconButton className='text-danger' icon='trash' onClick={() => {
                                if (window.confirm('Are you sure you want to delete this transaction?'))
                                    handleDeleteProject(props.value);
                            }} />
                            <IconButton className='ms-2' icon='eye' onClick={() => setEditingProjectId(props.value)} />
                        </div>
                    }
                },
            ];

            if (!isMobile) {
                cols.splice(1, 0, {
                    Header: 'Description',
                    accessor: 'description',
                });
            }

            return cols;
        }, []
    );


    return (<>
        <SapTable data={data} columns={columns} />
        <Modal size='lg' centered 
            isOpen={!!editingProjectId}
            toggle={() => setEditingProjectId(undefined)}>
            <ModalHeader toggle={() => setEditingProjectId(undefined)}>Edit Project</ModalHeader>
            <ModalBody>
                <ProjectForm editingId={editingProjectId}
                    onSave={() => {
                        dispatch(updateEditingProjectAsync(editingProjectId!));
                    }}
                    onDelete={handleDeleteProject} />
            </ModalBody>
        </Modal>
    </>
    );
};

export default ProjectList;

