import React, { Component } from "react";
import apis from "../../../services/Apis";
import { SecurePost } from "../../../services/axiosCall";
import Alert from "../../common/alert";
import { Row, Col } from "antd";
import "./conducttes.css";

export default class Questions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    this.refreshquestionList();
  }

  refreshquestionList = () => {
    this.setState({
      loading: true,
    });
    SecurePost({
      url: `${apis.GET_TEST_QUESTIONS}`,
      data: {
        id: this.props.id,
      },
    })
      .then((response) => {
        if (response.data.success) {
          this.props.updateQuestiosnTest(response.data.data);
        } else {
          Alert("error", "Error!", response.data.message);
        }
        this.setState({
          loading: false,
        });
      })
      .catch((error) => {
        console.log(error);
        Alert("error", "Error!", "Server Error");
        this.setState({
          loading: false,
        });
      });
  };

  render() {
    const aMap = ["A", "B", "C", "D", "E"];

    return (
      <div>
        {this.props.questionsOfTest.map((d, i) => {
          return (
            <div key={i} style={{ paddingBottom: "50px" }}>
              <Row>
                <Col span={20}>
                  <b>Q {i + 1}&#41; &nbsp;</b>
                  <b>{d.body}</b>
                  <br />
                  {d.quesimg && (
                    <img
                      alt="unable to load"
                      src={d.quesimg}
                      style={{ width: "100%" }}
                    />
                  )}
                </Col>
                <Col span={4}>Marks: {d.weightage}</Col>
                <Col span={20}>
                  {d.options.map((dd, ii) => {
                    return (
                      <Col key={ii} span={12} style={{ padding: "10px 20px" }}>
                        <b>{aMap[ii]} &#41; </b> {dd.optbody}
                        {dd.optimg ? (
                          <img alt="Option" src={dd.optimg} />
                        ) : null}
                      </Col>
                    );
                  })}
                </Col>
              </Row>
            </div>
          );
        })}
      </div>
    );
  }
}
