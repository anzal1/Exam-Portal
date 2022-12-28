import React, { Component } from "react";
import "../../basic/login/login.css";
import { Form, Icon, Input, Button, Select } from "antd";
import queryString from "query-string";
import apis from "../../../services/Apis";
import { Redirect } from "react-router-dom";
import { Post } from "../../../services/axiosCall";
import Alert from "../../common/alert";
const { Option } = Select;

class TraineeRegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inform: true,
      testid: null,
      user: null,
      link: null,
    };
  }

  componentDidMount() {
    let params = queryString.parse(this.props.location.search);
    this.setState({ testid: params.testid });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        Post({
          url: apis.REGISTER_TRAINEE_FOR_TEST,
          data: {
            name: values.name,
            emailid: values.email,
            contact: `${values.prefix}${values.contact}`,
            organisation: values.organisation,
            testid: this.state.testid,
            location: values.location,
          },
        })
          .then((data) => {
            if (data.data.success) {
              this.setState({
                inform: false,
                user: data.data.user,
                link: data.data.testLink,
              });
            } else {
              Alert("info", "Error !", data.data.message);
              this.setState({ inform: false, link: data.data.testLink });
            }
          })
          .catch((error) => {
            console.log(error);
            this.props.form.resetFields();
            Alert("error", "Error!", "Server Error");
          });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const prefixSelector = getFieldDecorator("prefix", {
      initialValue: "+65",
      rules: [{ required: true, message: "Please enter contact no prefix" }],
    })(
      <Select style={{ width: 70 }}>
        <Option value="+65">+65</Option>
      </Select>
    );

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        {this.state.inform ? (
          <div className="login-container">
            <div className="login-inner">
              <h1>Appear for Test</h1>
              <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item label="Name" hasFeedback>
                  {getFieldDecorator("name", {
                    rules: [
                      { required: true, message: "Please enter your name" },
                    ],
                  })(
                    <Input
                      prefix={
                        <Icon
                          type="user"
                          style={{ color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      placeholder="Name"
                    />
                  )}
                </Form.Item>
                <Form.Item label="Email Id" hasFeedback>
                  {getFieldDecorator("email", {
                    rules: [
                      {
                        type: "email",
                        message: "This is not valid E-mail!",
                      },
                      {
                        required: true,
                        message: "Please enter your E-mail!",
                      },
                    ],
                  })(
                    <Input
                      prefix={
                        <Icon
                          type="mail"
                          style={{ color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      placeholder="Email Id"
                    />
                  )}
                </Form.Item>
                <Form.Item label="Phone Number" hasFeedback>
                  {getFieldDecorator("contact", {
                    rules: [
                      {
                        required: true,
                        message: "Please enter your phone number!",
                      },
                      {
                        len: 8,
                        message: "Contact number must be 8 digit long",
                      },
                    ],
                  })(<Input addonBefore={prefixSelector} min={8} max={8} />)}
                </Form.Item>
                <Form.Item label="Location" hasFeedback>
                  {getFieldDecorator("location")(
                    <Input
                      prefix={
                        <Icon
                          type="home"
                          style={{ color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      placeholder="Location"
                    />
                  )}
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                  >
                    Register
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        ) : (
          <Redirect to={this.state.link} />
        )}
      </div>
    );
  }
}

const TraineeRegister = Form.create({ name: "Trainee Registration" })(
  TraineeRegisterForm
);

export default TraineeRegister;
