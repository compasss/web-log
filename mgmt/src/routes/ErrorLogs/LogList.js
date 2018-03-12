import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Row, Col, Card, Form, Popconfirm, Select, Button, DatePicker, Modal, message, Divider } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './LogList.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(({ logs, loading }) => ({
  logs,
  loading: loading.models.logs,
}))
@Form.create()
export default class LogList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    formValues: {},
    dateValue: [],
    pagination: {
      current: 1,
      pageSize: 10,
    },
    logInfo: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'logs/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    this.state.pagination = pagination;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      rows: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'logs/fetch',
      payload: params,
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'logs/fetch',
      payload: {},
    });
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const params = {};
      if (this.state.dateValue) {
        [params.startDate, params.endDate] = this.state.dateValue;
      }

      if (fieldsValue.project) {
        params.project = fieldsValue.project;
      }

      if (fieldsValue.type) {
        params.type = fieldsValue.type;
      }

      this.setState({
        formValues: params,
      });

      dispatch({
        type: 'logs/fetch',
        payload: params,
      });
    });
  }

  handleModalVisible = (e, data) => {
    this.setState({
      modalVisible: true,
      logInfo: data,
    });
  }

  handleDateChange = (date, dateString) => {
    // 日期选择器事件
    this.setState({
      dateValue: dateString,
    });
  }

  removeLog = (data) => {
    // 删除一条日志
    const { dispatch } = this.props;

    dispatch({
      type: 'logs/deleteLog',
      payload: {
        id: data._id,
      },
      callback: (res) => {
        if (res.ok === 1) {
          message.error('删除失败');
        } else {
          this.setState({
            selectedRows: [],
          });
          message.success('删除成功');
          dispatch({
            type: 'logs/fetch',
          });
        }
      },
    });
  }

  hideModal = () => {
    this.setState({
      modalVisible: false,
    });
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="更新日期">
              {getFieldDecorator('date')(
                <RangePicker style={{ width: '100%' }} onChange={this.handleDateChange} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="项目名称">
              {getFieldDecorator('project')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="hospital_app">互联网医院用户端</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="错误类型">
              {getFieldDecorator('type')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="info">信息</Option>
                  <Option value="warning">警告</Option>
                  <Option value="error">错误</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div className={styles.tableListOperator}>
          <Button type="primary" htmlType="submit">查询</Button>
          <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
        </div>
      </Form>
    );
  }

  render() {
    const { logs: { data }, loading } = this.props;
    const { selectedRows, modalVisible } = this.state;
    const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: this.state.pagination.current,
      pageSize: this.state.pagination.pageSize,
      total: data.total,
    };

    const columns = [
      {
        title: '时间',
        dataIndex: 'time',
        width: '100px',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: 'ip地址',
        dataIndex: 'ip',
        width: '120px',
      },
      {
        title: '设备类型',
        dataIndex: 'device',
      },
      {
        title: '项目名称',
        dataIndex: 'project',
        width: '120px',
      },
      {
        title: '错误类型',
        dataIndex: 'type',
        width: '100px',
      },
      {
        title: '行',
        dataIndex: 'line',
        width: '50px',
      },
      {
        title: '列',
        dataIndex: 'col',
        width: '50px',
      },
      {
        title: '报错信息',
        dataIndex: 'message',
      },
      {
        title: '操作',
        width: '120px',
        render: (text, record) => (
          <Fragment>
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.removeLog(record)}>
              <a>删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a onClick={e => this.handleModalVisible(e, record)}>查看</a>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderLayout title="错误日志">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderAdvancedForm()}
            </div>
            <Table
              rowKey="_id"
              selectedRows={selectedRows}
              loading={loading}
              dataSource={data.data}
              columns={columns}
              pagination={pagination}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
            <Modal
              title="日志详情"
              visible={modalVisible}
              onOk={this.hideModal}
              onCancel={this.hideModal}
              okText="确认"
              cancelText="取消"
              width="800px"
            >
              <ul className={styles.modelInfo}>
                <li>
                  <h3>项目名称</h3>
                  <p>{this.state.logInfo.project}</p>
                </li>
                <li>
                  <h3>ip地址</h3>
                  <p>{this.state.logInfo.ip}</p>
                </li>
                <li>
                  <h3>设备类型</h3>
                  <p>{this.state.logInfo.device}</p>
                </li>
                <li>
                  <h3>时间</h3>
                  <p>{this.state.logInfo.time}</p>
                </li>
                <li>
                  <h3>错误类型</h3>
                  <p>{this.state.logInfo.type}</p>
                </li>
                <li>
                  <h3>行</h3>
                  <p>{this.state.logInfo.line}</p>
                </li>
                <li>
                  <h3>列</h3>
                  <p>{this.state.logInfo.col}</p>
                </li>
                <li>
                  <h3>报错文件</h3>
                  <p>{this.state.logInfo.url}</p>
                </li>
                <li>
                  <h3>报错信息</h3>
                  <p>{this.state.logInfo.message}</p>
                </li>
              </ul>
            </Modal>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
