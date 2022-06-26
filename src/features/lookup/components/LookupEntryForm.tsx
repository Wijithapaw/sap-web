import { Formik, Field } from 'formik';
import { useMemo } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import * as Yup from 'yup';
import FormLabel from '../../../components/FormLabel';

interface Props {
    editingId?: string;
}

export default function LookupEntryScreenForm({ editingId }: Props) {

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

return <div>
        <Formik
            initialValues={{
                code: '',
                name: '',
                active: true
            }}
            onSubmit={(values, { setSubmitting }) => {
                setSubmitting(true);
                console.log(values);
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
