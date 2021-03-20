import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import schema from '../../validation/CourseSchema';
import { courseActions } from '../../state/ducks';
import { useFormWithErrors } from '../../hooks';
import styled from 'styled-components';

// css
// import '../../styles/Form.css';
import 'antd/dist/antd.css';
import { Button, Input, Select, Form } from 'antd';
const { TextArea } = Input;

//styled components
const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 3%;
  margin-left: 10%;
`;

const layout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 16 },
};

const initialFormErrors = {
  coursename: '',
  coursecode: '',
  coursedescription: '',
};

export default function EditCourseForm() {
  const { push } = useHistory();
  const dispatch = useDispatch();
  const { status, error } = useSelector(state => state.courseReducer);
  const courseToEdit = useSelector(state => state.courseReducer.editCourse);

  const { values, errors, disabled, onChange, resetValues } = useFormWithErrors(
    schema,
    courseToEdit,
    initialFormErrors,
    false
  );

  const changeValues = e => {
    const { name, value, type } = e.target;
    const valueToUse = type === 'select' ? Select : value;
    onChange(name, valueToUse);
  };

  useEffect(() => {
    if (status === 'edit/success') {
      resetValues();
      push('/courses');
    }
    if (status === 'edit/error') {
      console.log(error);
    }
  }, [status, error, push, resetValues]);

  function submitForm(e) {
    e.preventDefault();

    const editedCourse = {
      courseid: courseToEdit.courseid,
      coursename: values.coursename,
      coursecode: values.coursecode,
      coursedescription: values.coursedescription,
    };

    dispatch(
      courseActions.editCourseThunk(courseToEdit.courseid, editedCourse)
    );
  }

  const goBack = () => {
    push('/courses');
  };

  return (
    <StyledContainer>
      <h1 className="edit-form-h1">Edit Course</h1>
      <Form
        {...layout}
        name="basic"
        onFinish={submitForm}
        initialValues={{
          coursename: courseToEdit.coursename,
          coursecode: courseToEdit.coursecode,
          coursedescription: courseToEdit.coursedescription,
        }}
        className="form"
      >
        <Form.Item htmlFor="coursename" label="Course Name:" validateStatus>
          <Input
            id="coursename"
            name="coursename"
            value={values.coursename}
            onChange={changeValues}
          />
          <div style={{ color: 'red' }}>
            {errors.coursename ? `${errors.coursename}` : ''}
          </div>
        </Form.Item>

        <Form.Item htmlFor="coursecode" label="Course Code:">
          <Input
            id="coursecode"
            name="coursecode"
            value={values.coursecode}
            onChange={changeValues}
          />
          <div style={{ color: 'red' }}>
            {errors.coursecode ? `${errors.coursecode}` : ''}
          </div>
        </Form.Item>

        <Form.Item htmlFor="coursedescription" label="Course Description:">
          <TextArea
            // onKeyPress={handleKeyPress}
            showCount
            maxLength={250}
            id="coursedescription"
            name="coursedescription"
            value={values.coursedescription}
            onChange={changeValues}
            rows={4}
          />
          <div style={{ color: 'red' }}>
            {errors.coursedescription ? `${errors.coursedescription}` : ''}
          </div>
        </Form.Item>
        <div className="button-container">
          <Button onClick={goBack} type="secondary" className="button">
            Cancel
          </Button>
          <Button
            onClick={submitForm}
            type="primary"
            disabled={disabled}
            className="button"
          >
            Submit
          </Button>
        </div>
      </Form>
    </StyledContainer>
  );
}
