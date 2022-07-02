import React, { useState } from "react";
import {  Column } from 'react-table'
import { Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { isMobileSelector, setGlobalError } from "../../../app/core-slice";
import { dateHelpers } from "../../../app/helpers";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import IconButton from "../../../components/IconButton";
import SapTable from "../../../components/SapTable";
import { deleteProject } from "../project-api";
import { projectFilterSelector, projectsSelector, removeProjectFromList, updateEditingProjectAsync } from "../project-slice";
import { Project, ProjectState } from "../types";
import ProjectForm from "./ProjectForm";

function getProjectState(state: ProjectState) {
    switch (state) {
        case ProjectState.Pending: return "Pending";
        case ProjectState.Abandoned: return "Abandoned";
        case ProjectState.Completed: return "Completed";
        case ProjectState.Inprogress: return "Inprogress";
        default: return "NA"
    }
}

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
                    Header: 'State',
                    accessor: 'state',
                    Cell: props => getProjectState(props.value)
                },
                {
                    Header: 'Start Date',
                    accessor: 'startDate',
                    Cell: props => <div className='text-nowrap'>
                        {isMobile ? dateHelpers.toShortDateString(props.value)
                            : dateHelpers.toIsoString2(props.value)}
                    </div>
                },
                {
                    Header: 'End Date',
                    accessor: 'endDate',
                    Cell: props => <div className='text-nowrap'>
                        {isMobile ? props.value && dateHelpers.toShortDateString(props.value)
                            : props.value && dateHelpers.toIsoString2(props.value)}
                    </div>
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
                cols.splice(4, 0, {
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

