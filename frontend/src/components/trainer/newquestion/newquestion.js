import React, { Component } from "react";
import "./newquestion.css";
import {
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  Checkbox,
  Modal,
  Upload,
  Icon,
  InputNumber,
  Radio,
} from "antd";
import { connect } from "react-redux";
import {
  ChangeQuestionConfirmDirty,
  ChangeQuestionTableData,
  ChangeQuestionModalState,
} from "../../../actions/trainerAction";
import { SecurePost } from "../../../services/axiosCall";
import apis from "../../../services/Apis";
import Alert from "../../../components/common/alert";
import auth from "../../../services/AuthServices";
import {
  givenComponents,
  givenDifficulties,
  givenEnglishTopics,
  givenExams,
  givenLevels,
  givenMathsTopics,
  givenSchools,
  givenScienceTopics,
  givenTopics,
  givenYears,
} from "../../common/constants";

class NewQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subject: "",
      questionDetails: {
        isMcq: true,
        questionimage: null,
        options: [
          { image: null, body: null, isAnswer: false },
          { image: null, body: null, isAnswer: false },
          { image: null, body: null, isAnswer: false },
          { image: null, body: null, isAnswer: false },
        ],
      },
      adding: false,
      submitDisabled: false,
      fifthoptioAddButtonVisible: true,
      level: 1,
      difficulty: 1,
    };
  }

  addfifthOption = (e) => {
    this.setState((previousState, previousProps) => {
      return {
        fifthoptioAddButtonVisible: false,
        questionDetails: {
          ...previousState.questionDetails,
          options: [
            ...previousState.questionDetails.options,
            { image: null, body: null, isAnswer: false },
          ],
        },
      };
    });
  };

  Customalert = () => {
    Modal.confirm({
      title: "Confirm",
      content: "Empty option can not be set as answer",
      okText: "I understand",
      cancelText: null,
    });
  };

  handleLevelDifficultyChange = (name, value) => {
    this.setState({
      [name]: value,
    });
  };

  handleSchoolChange = (name, value) => {
    this.setState({
      [name]: value,
    });
  };

  handleYearChange = (name, value) => {
    this.setState({
      [name]: value,
    });
  };

  handleComponentChange = (name, value) => {
    this.setState({
      [name]: value,
    });
  };

  handleExamChange = (name, value) => {
    this.setState({
      [name]: value,
    });
  };

  handleTopicChange = (name, value) => {
    this.setState({
      [name]: value,
    });
  };

  handleSubjectChange = (name, value) => {
    this.setState({
      [name]: value,
    });
  };

  OptionTextChange = (e, i) => {
    var newOptions = [...this.state.questionDetails.options];

    newOptions[i] = {
      ...this.state.questionDetails.options[i],
      body: e.target.value,
    };
    if (
      (newOptions[i].image === "undefined" ||
        newOptions[i].image === undefined ||
        newOptions[i].image === null ||
        newOptions[i].image === "null") &&
      (newOptions[i].body === "undefined" ||
        newOptions[i].body === undefined ||
        newOptions[i].body === "null" ||
        newOptions[i].body === "" ||
        newOptions[i].body === null)
    ) {
      newOptions[i] = {
        ...this.state.questionDetails.options[i],
        body: "",
        isAnswer: false,
      };
      this.setState((ps, pp) => {
        return {
          questionDetails: { ...ps.questionDetails, options: newOptions },
        };
      });
    }
    this.setState((ps, pp) => {
      return {
        questionDetails: {
          ...ps.questionDetails,
          options: newOptions,
        },
      };
    });
  };

  AnswerOptionSwitch = (e, i) => {
    if (
      (this.state.questionDetails.options[i].body !== "" &&
        this.state.questionDetails.options[i].body !== null) ||
      (this.state.questionDetails.options[i].image !== null &&
        this.state.questionDetails.options[i].image !== "undefined" &&
        this.state.questionDetails.options[i].image !== undefined)
    ) {
      var newOptions = [...this.state.questionDetails.options];
      newOptions[i] = {
        ...this.state.questionDetails.options[i],
        isAnswer: e.target.checked,
      };
      this.setState((ps, pp) => {
        return {
          questionDetails: {
            ...ps.questionDetails,
            options: newOptions,
          },
        };
      });
    } else {
      this.Customalert();
      return;
    }
  };

  OptionImageonChange = (f, i) => {
    var newOptions = [...this.state.questionDetails.options];
    if (!f) {
      delete newOptions[i].image;
      newOptions[i].image = null;
    } else {
      newOptions[i] = {
        ...this.state.questionDetails.options[i],
        image: `${apis.BASE}/${f.link}`,
      };
    }
    this.setState({
      submitDisabled: false,
    });
    if (
      (newOptions[i].image === "undefined" ||
        newOptions[i].image === undefined ||
        newOptions[i].image === null ||
        newOptions[i].image === "null") &&
      (newOptions[i].body === "undefined" ||
        newOptions[i].body === undefined ||
        newOptions[i].body === "null" ||
        newOptions[i].body === "" ||
        newOptions[i].body === null)
    ) {
      newOptions[i] = {
        ...this.state.questionDetails.options[i],
        isAnswer: false,
      };
    }
    this.setState((ps, pp) => {
      return {
        questionDetails: { ...ps.questionDetails, options: newOptions },
      };
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        var f = 1;
        var ans = 0;
        var opts = [];
        this.state.questionDetails.options.forEach((element, i) => {
          opts.push({
            optbody: element.body,
            optimg: element.image,
            isAnswer: element.isAnswer,
          });

          if (
            this.state.questionDetails.isMcq &&
            (element.image === "undefined" ||
              element.image === undefined ||
              element.image === null ||
              element.image === "null") &&
            (element.body === "" ||
              element.body === null ||
              element.body === "null" ||
              element.body === "undefined" ||
              element.body === undefined)
          ) {
            f = 0;
          }
          if (element.isAnswer) ans = ans + 1;
        });
        if (f) {
          if (
            (this.state.questionDetails.isMcq && !ans) ||
            (!this.state.questionDetails.isMcq && !values.answer)
          ) {
            return Alert(
              "warning",
              "Warning!",
              "There must be atleast one right answer"
            );
          }
          this.setState({ adding: true });
          return SecurePost({
            url: apis.CREATE_QUESTIONS,
            data: {
              body: values.questionbody,
              options: opts,
              isMcq: this.state.questionDetails.isMcq,
              answer: values.answer,
              quesimg: this.state.questionDetails.questionimage,
              subject: values.subject,
              explanation: values.explanation,
              weightage: values.waitage,
              difficulty: this.state.difficulty,
              level: this.state.level,
              exam: this.state.exam,
              component: this.state.component,
              school: this.state.school,
              year: this.state.year,
              topic: this.state.topic,
            },
          })
            .then((response) => {
              this.setState({ adding: false });
              if (response.data.success) {
                this.props.ChangeQuestionModalState(false);
                Alert("success", "Success", response.data.message);
                this.props.ChangeQuestionTableData(
                  this.props.trainer.selectedSubjects
                );
              } else {
                this.props.ChangeQuestionModalState(false);
                this.props.form.resetFields();
                return Alert("warning", "Warning!", response.data.message);
              }
            })
            .catch((error) => {
              console.log(error);
              this.props.form.resetFields();
              this.setState({
                adding: false,
                questionDetails: {
                  questionimage: null,
                  isMcq: true,
                  options: [
                    { image: null, body: null, isAnswer: false },
                    { image: null, body: null, isAnswer: false },
                    { image: null, body: null, isAnswer: false },
                    { image: null, body: null, isAnswer: false },
                  ],
                },
              });
              this.props.ChangeQuestionModalState(false);
              return Alert("error", "Error!", "Server Error");
            });
        }
        return Alert("warning", "Warning!", "Please fill all the options");
      }
    });
  };
  changeqImage = (f) => {
    this.setState((ps, pp) => {
      return {
        questionDetails: {
          ...ps.questionDetails,
          questionimage: f.link ? `${apis.BASE}/${f.link}` : null,
        },
        submitDisabled: false,
      };
    });
  };

  upl = () => {
    this.setState({
      submitDisabled: true,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { Option } = Select;
    const { TextArea } = Input;
    var QuestionImageprops = {
      name: "file",
      action: `${apis.BASE}${apis.FILE_UPLOAD}?Token=${auth.retriveToken()}`,
      listType: "picture",
    };

    return (
      <div className="register-subject-form">
        <div className="register-trainer-form-body">
          <Form onSubmit={this.handleSubmit}>
            <div>
              <Row>
                <Col span={8}>
                  <Form.Item label="Subject" hasFeedback>
                    {getFieldDecorator("subject", {
                      rules: [
                        {
                          required: true,
                          message: "Please select any subject!",
                        },
                      ],
                    })(
                      <Select
                        showSearch
                        style={{ width: "100%" }}
                        placeholder="Select a subject"
                        optionFilterProp="s"
                      >
                        {this.props.admin.subjectTableData.map((d, i) => (
                          <Option
                            key={d._id}
                            s={d.topic}
                            value={d._id}
                            onClick={() => {
                              this.handleSubjectChange("subject", d.topic);
                            }}
                          >
                            {d.topic}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col offset={1} span={5} style={{ marginTop: "49px" }}>
                  <Radio.Group
                    options={[
                      { label: "MCQ Type", value: "MCQ" },
                      { label: "Custom Type", value: "CUSTOM" },
                    ]}
                    onChange={({ target: { value } }) => {
                      this.setState((prev) => ({
                        ...prev,
                        questionDetails: {
                          ...prev.questionDetails,
                          isMcq: value === "MCQ" ? true : false,
                        },
                      }));
                    }}
                    value={this.state.questionDetails.isMcq ? "MCQ" : "CUSTOM"}
                    optionType="button"
                  />
                </Col>
              </Row>

              <Row
                offset={1}
                span={9}
                style={{ display: "flex", flexDirection: "row", gap: "15px" }}
              >
                <Form.Item label="Level" hasFeedback required>
                  <Select
                    showSearch
                    style={{ width: 150 }}
                    placeholder="Select Level"
                    optionFilterProp="s"
                  >
                    {givenLevels.map((d, i) => (
                      <Option
                        key={d.value}
                        s={d.label}
                        value={d.value}
                        onClick={() =>
                          this.handleLevelDifficultyChange("level", d.value)
                        }
                      >
                        {d.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Difficulty" hasFeedback required>
                  <Select
                    showSearch
                    style={{ width: 150 }}
                    placeholder="Select Difficulty"
                    optionFilterProp="s"
                  >
                    {givenDifficulties.map((d, i) => (
                      <Option
                        key={d.value}
                        s={d.label}
                        value={d.value}
                        onClick={() =>
                          this.handleLevelDifficultyChange(
                            "difficulty",
                            d.value
                          )
                        }
                      >
                        {d.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item label="School" hasFeedback>
                  <Select
                    showSearch
                    style={{ width: 150 }}
                    placeholder="Select School"
                    optionFilterProp="s"
                  >
                    {givenSchools.map((d, i) => (
                      <Option
                        key={d.value}
                        s={d.label}
                        value={d.value}
                        onClick={() =>
                          this.handleSchoolChange("school", d.value)
                        }
                      >
                        {d.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item label="Year" hasFeedback>
                  <Select
                    showSearch
                    style={{ width: 150 }}
                    placeholder="Select Year"
                    optionFilterProp="s"
                  >
                    {givenYears.map((d, i) => (
                      <Option
                        key={d.value}
                        s={d.label}
                        value={d.value}
                        onClick={() => this.handleYearChange("year", d.value)}
                      >
                        {d.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item label="Component" hasFeedback>
                  <Select
                    showSearch
                    style={{ width: 150 }}
                    placeholder="Select Component"
                    optionFilterProp="s"
                  >
                    {givenComponents.map((d, i) => (
                      <Option
                        key={d.value}
                        s={d.label}
                        value={d.value}
                        onClick={() =>
                          this.handleComponentChange("component", d.value)
                        }
                      >
                        {d.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item label="Exam" hasFeedback>
                  <Select
                    showSearch
                    style={{ width: 150 }}
                    placeholder="Select Exam"
                    optionFilterProp="s"
                  >
                    {givenExams.map((d, i) => (
                      <Option
                        key={d.value}
                        s={d.label}
                        value={d.value}
                        onClick={() => this.handleExamChange("exam", d.value)}
                      >
                        {d.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                {this.state.subject ? (
                  <Form.Item label="Topic" hasFeedback>
                    <Select
                      showSearch
                      style={{ width: 150 }}
                      placeholder="Select Topic"
                      optionFilterProp="s"
                    >
                      {/* {givenTopics.map((d, i) => (
                      <Option
                        key={d.value}
                        s={d.label}
                        value={d.value}
                        onClick={() => this.handleTopicChange("topic", d.value)}
                      >
                        {d.label}
                      </Option>
                    ))} */}
                      {this.state.subject &&
                      this.state.subject === "Mathematics"
                        ? givenMathsTopics.map((d, i) => (
                            <Option
                              key={d.value}
                              s={d.label}
                              value={d.value}
                              onClick={() =>
                                this.handleTopicChange("topic", d.value)
                              }
                            >
                              {d.label}
                            </Option>
                          ))
                        : this.state.subject && this.state.subject === "Science"
                        ? givenScienceTopics.map((d, i) => (
                            <Option
                              key={d.value}
                              s={d.label}
                              value={d.value}
                              onClick={() =>
                                this.handleTopicChange("topic", d.value)
                              }
                            >
                              {d.label}
                            </Option>
                          ))
                        : this.state.subject && this.state.subject === "English"
                        ? givenEnglishTopics.map((d, i) => (
                            <Option
                              key={d.value}
                              s={d.label}
                              value={d.value}
                              onClick={() =>
                                this.handleTopicChange("topic", d.value)
                              }
                            >
                              {d.label}
                            </Option>
                          ))
                        : null}
                    </Select>
                  </Form.Item>
                ) : null}
              </Row>
              <Row>
                <Col span={19}>
                  <Form.Item label="Question" hasFeedback>
                    {getFieldDecorator("questionbody", {
                      rules: [
                        { required: true, message: "Please type question!" },
                      ],
                    })(<TextArea rows={3} />)}
                  </Form.Item>
                </Col>
                <Col span={4} style={{ textAlign: "center" }}>
                  <Form.Item label="Question Image">
                    <Upload
                      {...QuestionImageprops}
                      beforeUpload={this.upl}
                      onRemove={this.changeqImage}
                      onSuccess={this.changeqImage}
                    >
                      <Button>
                        <Icon type="upload" /> Upload
                      </Button>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={19}>
                  <Form.Item label="Explanation" hasFeedback>
                    {getFieldDecorator("explanation")(
                      <TextArea onChange={this.ExplanationChange} rows={3} />
                    )}
                  </Form.Item>
                </Col>
                <Col span={4} style={{ textAlign: "center" }}>
                  <Form.Item label="Weightage" hasFeedback>
                    {getFieldDecorator("waitage", {
                      rules: [
                        { required: true, message: "Please enter the marks" },
                      ],
                    })(<InputNumber min={1} max={10} />)}
                  </Form.Item>
                </Col>
              </Row>

              {this.state.questionDetails.isMcq ? (
                <div
                  style={{
                    paddingTop: "20px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                  }}
                >
                  {this.state.questionDetails.options.map((option, i) => {
                    return (
                      <Row
                        key={i}
                        style={{ border: "1px solid #f0f0f0", padding: "10px" }}
                      >
                        <Col lg={{ span: 14 }} sm={{ span: 24 }}>
                          <Form.Item
                            label={`Option ${i + 1}`}
                            style={{ padding: 0 }}
                          >
                            <TextArea
                              value={this.state.questionDetails.options[i].body}
                              onChange={(e) => this.OptionTextChange(e, i)}
                              rows={2}
                            />
                          </Form.Item>
                        </Col>
                        <Col
                          lg={{ span: 8 }}
                          sm={{ span: 12 }}
                          style={{ textAlign: "center" }}
                        >
                          <Form.Item label={`Option${i + 1} Image`}>
                            <Upload
                              {...QuestionImageprops}
                              beforeUpload={this.upl}
                              onRemove={(f) =>
                                this.OptionImageonChange(null, i)
                              }
                              onSuccess={(f) => this.OptionImageonChange(f, i)}
                            >
                              <Button>
                                <Icon type="upload" /> Upload
                              </Button>
                            </Upload>
                          </Form.Item>
                        </Col>
                        <Col
                          lg={{ span: 2 }}
                          sm={{ span: 12 }}
                          style={{
                            padding: "10px 10px",
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Form.Item>
                            <Checkbox
                              checked={
                                this.state.questionDetails.options[i].isAnswer
                              }
                              onChange={(e) => this.AnswerOptionSwitch(e, i)}
                            ></Checkbox>
                          </Form.Item>
                        </Col>
                      </Row>
                    );
                  })}
                </div>
              ) : (
                <Row>
                  <Col span={24}>
                    <Form.Item label="Answer" hasFeedback>
                      {getFieldDecorator("answer", {
                        ...(!this.state.questionDetails.isMcq && {
                          rules: [
                            {
                              required: true,
                              message: "Please type answer!",
                            },
                          ],
                        }),
                      })(<Input />)}
                    </Form.Item>
                  </Col>
                </Row>
              )}
              <Row>
                {this.state.questionDetails.isMcq && (
                  <Col span={12} style={{ marginTop: "16px" }}>
                    {this.state.fifthoptioAddButtonVisible ? (
                      <Button
                        type="primary"
                        onClick={(e) => this.addfifthOption(e)}
                      >
                        Add 5th option
                      </Button>
                    ) : null}
                  </Col>
                )}
                <Col style={{ marginTop: "16px" }} span={12}>
                  <Form.Item>
                    <Button
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        marginLeft: "auto",
                      }}
                      type="primary"
                      htmlType="submit"
                      disabled={this.state.submitDisabled}
                      loading={this.state.adding}
                    >
                      Create Question
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  trainer: state.trainer,
  admin: state.admin,
});

const NewQuestionForm = Form.create({ name: "newQuestion" })(NewQuestion);

export default connect(mapStateToProps, {
  ChangeQuestionConfirmDirty,
  ChangeQuestionModalState,
  ChangeQuestionTableData,
})(NewQuestionForm);
