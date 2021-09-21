import React, { useState } from "react";
import { Input, Select, Form } from 'antd';
import { DeleteTwoTone, SaveTwoTone } from "@ant-design/icons";

const { Option } = Select;

const Action = ({ handleSave, handleDel }) => {
    return <div className="g-action"
        style={{ width: "202px" }}
    >
        <SaveTwoTone
            twoToneColor="#44AEA0"
            style={{ fontSize: "25px" }}
            onClick={() => {
                if (typeof handleSave === 'function') {
                    handleSave()
                }
            }}
        />
        <DeleteTwoTone
            twoToneColor="#D3455C"
            style={{ fontSize: "25px" }}
            onClick={(e) => {
                if (typeof handleDel === 'function') {
                    handleDel(e)
                }
            }}
        />
    </div>
}

const InputAction = ({ type, allowers, handleSave, handleDel, keyIndex }) => {
    const [typeSelect, setTypeSelect] = useState('one')
    console.log(typeSelect, type)
    const [form] = Form.useForm();
    return <div
        key={keyIndex}
        style={{
            margin: '15px 0 0 15px',
            width: '208px',
        }}
    >
        <Form
        name={keyIndex}
        key={keyIndex}
        form={form}
        initialValues={{
            type: typeSelect,
            allowers
          }}
        >
            <Form.Item
             name="name"
             rules={[
                {
                  required: true,
                  message: 'Please input the title of folder!',
                },
              ]}
            >
                <Input style={{ width: "202px" }} placeholder="Enter new folder name" />
            </Form.Item>
            <Form.Item
                name="type"
                required
            >
                <Select
                    // defaultValue={type}
                    showSearch
                    style={{ width: "202px" }}
                    onChange={(sc) => {
                        setTypeSelect(sc)
                    }}
                >
                    <Option value="all">Visible to Everyone</Option>
                    <Option value="one">
                        Visible to specific users
                    </Option>
                </Select>
            </Form.Item>

            {typeSelect === 'one' ? <Form.Item
                name="allowers"
                rules={[
                    {
                      required: true,
                      message: 'Please select!',
                    },
                  ]}
            >
                <Select
                    // defaultValue={allowers}
                    placeholder="Select a name"
                    mode="multiple"
                    style={{ width: "202px" }}
                >
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                </Select>
            </Form.Item> : ''}
            <Form.Item>
                <Action handleSave={async() => {
                   const params = await form.validateFields().then(vl => vl)
                   handleSave(params)
                }} handleDel={handleDel} />
            </Form.Item>
        </Form>
    </div>
}

export default InputAction