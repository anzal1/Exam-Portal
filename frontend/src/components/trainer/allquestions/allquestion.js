import React, { Component } from "react";
import {
  Table,
  Input,
  Button,
  Icon,
  Typography,
  Popconfirm,
  Divider,
  Modal,
  Select,
  Row,
  Col,
} from "antd";
import Highlighter from "react-highlight-words";
import { connect } from "react-redux";
import {
  ChangeQuestionModalState,
  ChangeQuestionTableData,
  ChangeQuestionSearchText,
  ChangeSelectedSubjects,
} from "../../../actions/trainerAction";
import { ChangeSubjectTableData } from "../../../actions/adminAction";
import "./allquestion.css";
import Alert from "../../../components/common/alert";
import { SecurePost } from "../../../services/axiosCall";
import apis from "../../../services/Apis";
import NewQuestionForm from "../newquestion/newquestion";
import QuestionDetails from "../questionDetails/questiondetails";
import {
  givenDifficulties,
  givenLevels,
  givenSchools,
  givenComponents,
  givenExams,
  givenYears,
} from "../../common/constants";

class AllQuestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questiondetailsId: null,
      questiondetailsModelVisible: false,
    };
  }
  OpendetailsModal = (id) => {
    this.setState((previousState, previousProps) => {
      return {
        questiondetailsId: id,
        questiondetailsModelVisible: true,
      };
    });
  };
  ClosedetailsModal = () => {
    this.setState((previousState, previousProps) => {
      return {
        questiondetailsId: null,
        questiondetailsModelVisible: false,
      };
    });
  };

  componentDidMount() {
    console.log("all uestions karan");
    this.props.ChangeSubjectTableData();
    this.props.ChangeQuestionTableData(this.props.trainer.selectedSubjects);
  }

  openNewModal = (mode) => {
    this.props.ChangeQuestionModalState(true);
  };

  closeNewModal = () => {
    this.props.ChangeQuestionModalState(false);
  };

  handleSubjectChange = (s) => {
    this.props.ChangeSelectedSubjects(s);
    this.props.ChangeQuestionTableData(s);
  };

  deleteQuestion = (id) => {
    SecurePost({
      url: `${apis.DELETE_QUESTION}`,
      data: { _id: id },
    })
      .then((response) => {
        if (response.data.success) {
          Alert("success", "Success", response.data.message);
          this.props.ChangeQuestionTableData(
            this.props.trainer.selectedSubjects
          );
        } else return Alert("warning", "Warning!", response.data.message);
      })
      .catch((error) => Alert("error", "Error!", "Server Error"));
  };

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text) => (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[this.props.trainer.QuestionsearchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ),
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.props.ChangeQuestionSearchText(selectedKeys[0]);
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.props.ChangeQuestionSearchText("");
  };

  render() {
    const { Title } = Typography;
    const columns = [
      {
        title: "Subject",
        dataIndex: "subject.topic",
        key: "subject.topic",
        width: "10%",
      },
      {
        title: "Question",
        dataIndex: "body",
        key: "body",
        width: "20%",
        ...this.getColumnSearchProps("body"),
      },
      {
        title: "Level",
        dataIndex: "level",
        key: "level",
        width: "10%",
        sorter: (a, b) => a.level > b.level,

        render: (l) => {
          const columnData = givenLevels.find((lv) => lv.value === l);
          const lvl = columnData ? columnData.label : "";
          return <span>{lvl}</span>;
        },
        filters: givenLevels.map((lv) => {
          return {
            text: lv.label,
            value: lv.value,
          };
        }),
        onFilter: (value, record) =>
          record.level.startsWith(value.toLowerCase()),
        filterSearch: true,
      },
      {
        title: "Difficulty",
        dataIndex: "difficulty",
        key: "difficulty",
        width: "10%",
        sorter: (a, b) => a.difficulty > b.difficulty,
        render: (l) => {
          const columnData = givenDifficulties.find((df) => df.value === l);
          const d = columnData ? columnData.label : "";
          return <span>{d}</span>;
        },
        filters: givenDifficulties.map((df) => {
          return {
            text: df.label,
            value: df.value,
          };
        }),
        onFilter: (value, record) =>
          record.difficulty.startsWith(value.toLowerCase()),
        filterSearch: true,
      },
      {
        title: "School",
        dataIndex: "school",
        key: "school",
        width: "10%",
        sorter: (a, b) => a.school > b.school,
        render: (l) => {
          const columnData = givenSchools.find((df) => df.value === l);
          const d = columnData ? columnData.label : "";
          return <span>{d}</span>;
        },
        filters: givenSchools.map((df) => {
          return {
            text: df.label,
            value: df.value,
          };
        }),
        onFilter: (value, record) => record.school.startsWith(value),
        filterSearch: true,
      },
      {
        title: "Exam",
        dataIndex: "exam",
        key: "exam",
        width: "10%",
        sorter: (a, b) => a.exam > b.exam,
        render: (l) => {
          const columnData = givenExams.find((df) => df.value === l);
          const d = columnData ? columnData.label : "";
          return <span>{d}</span>;
        },
        filters: givenExams.map((df) => {
          return {
            text: df.label,
            value: df.value,
          };
        }),
        onFilter: (value, record) => record.exam.startsWith(value),
        filterSearch: true,
      },
      {
        title: "Component",
        dataIndex: "component",
        key: "component",
        width: "10%",
        sorter: (a, b) => a.component > b.component,
        render: (l) => {
          const columnData = givenComponents.find((df) => df.value === l);
          const d = columnData ? columnData.label : "";
          return <span>{d}</span>;
        },
        filters: givenComponents.map((df) => {
          return {
            text: df.label,
            value: df.value,
          };
        }),
        onFilter: (value, record) => record.component.startsWith(value),
        filterSearch: true,
      },
      {
        title: "Year",
        dataIndex: "year",
        key: "year",
        width: "10%",
        sorter: (a, b) => a.year > b.year,
        render: (l) => {
          const columnData = givenYears.find((df) => df.value === l);
          const d = columnData ? columnData.label : "";
          return <span>{d}</span>;
        },
        filters: givenYears.map((df) => {
          return {
            text: df.label,
            value: df.value,
          };
        }),
        onFilter: (value, record) => record.year.startsWith(value),
        filterSearch: true,
      },
      {
        title: "Action",
        key: "_id",
        dataIndex: "_id",
        width: "10%",
        render: (key) => (
          <span>
            <Button
              type="primary"
              shape="circle"
              onClick={() => this.OpendetailsModal(key)}
              icon="info-circle"
            />
            <Divider type="vertical" />
            <Popconfirm
              title="Are you sure？"
              cancelText="No"
              okText="Yes"
              onConfirm={() => {
                this.deleteQuestion(key);
              }}
              icon={<Icon type="delete" style={{ color: "red" }} />}
            >
              <Button type="danger" shape="circle" icon="delete" />
            </Popconfirm>
          </span>
        ),
      },
    ];
    return (
      <div className="admin-table-container">
        <div>
          <Row>
            <Col span={12}>
              <Button
                type="primary"
                icon="question-circle"
                style={{ marginBottom: "10px" }}
                onClick={() => this.openNewModal("Add New Question")}
              >
                Add New Question
              </Button>
            </Col>
            <Col span={12}>
              <Select
                mode="multiple"
                placeholder="Select one or more subjects"
                defaultValue={this.props.trainer.selectedSubjects}
                onChange={this.handleSubjectChange}
                style={{ width: "100%" }}
                allowClear={true}
                optionFilterProp="s"
              >
                {this.props.admin.subjectTableData.map((item) => (
                  <Select.Option key={item._id} value={item._id} s={item.topic}>
                    {item.topic}
                  </Select.Option>
                ))}
              </Select>
            </Col>
          </Row>
        </div>
        <div className="register-trainer-form-header">
          <Title level={4} style={{ color: "#fff", textAlign: "center" }}>
            List of Questions
          </Title>
        </div>
        <Table
          bordered={true}
          columns={columns}
          dataSource={this.props.trainer.QuestionTableData}
          size="medium"
          pagination={{ pageSize: 10 }}
          loading={this.props.trainer.QuestionTableLoading}
          rowKey="_id"
          style={{ backgroundColor: "#fff", padding: "10px" }}
        />
        <Modal
          visible={this.props.trainer.NewQuestionmodalOpened}
          // visible={true}
          title="New Question"
          onCancel={this.closeNewModal}
          style={{
            top: "20px",
            padding: "0px",
            backgroundColor: "rgb(155,175,190)",
          }}
          width="80%"
          destroyOnClose={true}
          footer={<></>}
          bodyStyle={{ maxHeight: "75vh", overflow: "auto" }}
        >
          <NewQuestionForm />
        </Modal>

        <Modal
          visible={this.state.questiondetailsModelVisible}
          title="Question Details"
          onCancel={this.ClosedetailsModal}
          style={{
            top: "20px",
            padding: "0px",
            backgroundColor: "rgb(155,175,190)",
          }}
          width="70%"
          destroyOnClose={true}
          footer={[]}
        >
          <QuestionDetails id={this.state.questiondetailsId} />
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  trainer: state.trainer,
  admin: state.admin,
});

export default connect(mapStateToProps, {
  ChangeQuestionModalState,
  ChangeQuestionTableData,
  ChangeQuestionSearchText,
  ChangeSelectedSubjects,
  ChangeSubjectTableData,
})(AllQuestions);
