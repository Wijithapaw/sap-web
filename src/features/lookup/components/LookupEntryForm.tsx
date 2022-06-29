import { Formik, Field } from 'formik';
import { useEffect, useMemo, useState } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import * as Yup from 'yup';
import FormLabel from '../../../components/FormLabel';
import { createLookup, getLookup, updateLookup } from '../lookup-api';
import { Lookup, LookupEntry } from '../types';

interface Props {
    editingId?: string;
    headerId: string;
    onSave?: (id: string) => void;
}

export default function LookupEntryScreenForm({ headerId, editingId, onSave }: Props) {
    const [editingLookup, setEditingLookup] = useState<Lookup>();

    useEffect(() => {
        editingId && getLookup(editingId).then((lookup) => {
            console.log(lookup);

            setEditingLookup(lookup);
        })
    }, [editingId]);

    const validationSchema = useMemo(() => {
        return Yup.object().shape({
            code: Yup.string()
                .min(2, 'is too Short!')
                .max(20, ' is too Long!')
                .required('is required'),
            name: Yup.string()
                .min(5, 'is too Short!')
                .max(50, ' is too Long!')
                .required('is required'),
        });
    }, [])

    if (editingId && !editingLookup) return null;

    return <div>
        <Formik
            initialValues={{
                code: editingLookup?.code || '',
                name: editingLookup?.name || '',
                active: !(editingLookup?.inactive || false)
            }}
            onSubmit={(values, { setSubmitting }) => {
                setSubmitting(true);

                var entry: LookupEntry = {
                    code: values.code,
                    headerId: headerId,
                    inactive: !values.active,
                    name: values.name
                }

                const promise = editingId ? updateLookup(editingId, entry) : createLookup(entry);

                promise.then((id) => {
                    console.log(editingId ? 'updated' : 'created');
                    onSave && onSave(editingId || id);
                });
            }}
            validationSchema={validationSchema}
        >
            {
                ({ errors, touched, handleSubmit }) => (
                    <Form onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }} >
                        <FormGroup>
                            <FormLabel label='Code' touched={touched.code} error={errors.code} />
                            <Field name="code" type="text" className="form-control" />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel label='Name' touched={touched.name} error={errors.name} />
                            <Field name="name" type="text" className="form-control" />
                        </FormGroup>
                        <FormGroup check>
                            <Label for='chkActive'>Active</Label>
                            <Field id="chkActive" name="active" type="checkbox" className="me-1 form-check-input" />
                        </FormGroup>
                        <FormGroup>
                            <Button color='primary' type="submit">Save</Button>
                        </FormGroup>
                    </Form>
                )
            }
        </Formik>

    </div>
}
