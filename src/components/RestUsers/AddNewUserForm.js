import React from 'react';
import { Modal, Button, Form, Input, Select } from 'antd';
import schema from '../../validation/NewUserSchema';
import { useFormWithErrors } from '../../hooks';
import { client } from '../../utils/api';

const initValues = {
  email: '',
  username: '',
  firstname: '',
  lastname: '',
  roleType: '',
};

const AddNewUserForm = props => {
  const { values, disabled, onChange, resetValues } = useFormWithErrors(
    schema,
    initValues
  );

  const changeValues = evt => {
    if (typeof evt == 'string') {
      // this strange exists to handle the change-function for AntD's `Select` element
      onChange('roleType', evt);
      return;
    }
    const { name, value } = evt.target;
    onChange(name, value);
  };

  const onSubmit = evt => {
    evt.preventDefault();
    client.postNewUser(values);
    resetValues();
  };

  const innerForm = (
    <>
      <h2>Create a User!</h2>
      <Form
        name="Create User"
        layout="vertical"
        size="large"
        onFinish={onSubmit}
      >
        <Form.Item
          label="*Email"
          name="email"
          rules={[
            { required: true, message: 'A valid remail address is required.' },
          ]}
        >
          <Input
            name="email"
            id="email"
            value={values.email}
            onChange={changeValues}
          />
        </Form.Item>
        <Form.Item
          name="role"
          label="*Role"
          rules={[{ required: true, message: 'Role is required.' }]}
        >
          <Select value={values.role} onChange={changeValues}>
            <Select.Option value="ADMIN">Admin</Select.Option>
            <Select.Option value="TEACHER">Teacher</Select.Option>
            <Select.Option value="STUDENT">Student</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="First Name" name="firstname">
          <Input
            id="firstname"
            name="firstname"
            value={values.firstname}
            onChange={changeValues}
          />
        </Form.Item>
        <Form.Item label="Last Name" name="lastname">
          <Input
            id="lastname"
            name="lastname"
            value={values.lastname}
            onChange={changeValues}
          />
        </Form.Item>
        <Form.Item label="Username" name="username">
          <Input
            id="username"
            name="username"
            value={values.username}
            onChange={changeValues}
          />
        </Form.Item>
      </Form>
    </>
  );

  return (
    <>
      {props.isWrapped ? (
        <Modal
          visible={props.visible}
          onCancel={props.hideModal}
          onOk={e => {
            if (disabled) {
              props.hideModal();
            } else {
              onSubmit(e);
              props.hideModal();
            }
          }}
        >
          {innerForm}
        </Modal>
      ) : (
        <>
          {innerForm}
          <div className="button-container">
            <Button
              onClick={onSubmit}
              type="primary"
              disabled={disabled}
              className="button"
            >
              Submit
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default AddNewUserForm;
