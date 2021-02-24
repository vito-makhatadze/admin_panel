import React, {Component} from "react";
import {Table} from 'antd';
import reqwest from 'reqwest';

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        sorter: true,
        render: name => `${name.first} ${name.last}`,
        width: '20%',
    },
    {
        title: 'Gender',
        dataIndex: 'gender',
        filters: [
            {text: 'Male', value: 'male'},
            {text: 'Female', value: 'female'},
        ],
        width: '20%',
    },
    {
        title: 'Email',
        dataIndex: 'email',
    },
];

const getRandomuserParams = params => ({
    results: params.pagination.pageSize,
    page: params.pagination.current,
    ...params,
});

class User extends Component {
    constructor() {
        super();
        this.state = {
            data: [],
            pagination: {
                current: 1,
                pageSize: 10,
            },
            loading: false,
        };

        this.handleTableChange = this.handleTableChange.bind(this)
    }

    componentDidMount() {
        const {pagination} = this.state;
        this.fetch({pagination});
    }

    handleTableChange(pagination, filters, sorter) {
        this.fetch({
            sortField: sorter.field,
            sortOrder: sorter.order,
            pagination,
            ...filters,
        });
    };

    fetch(params = {}) {
        console.log(params)
        this.setState({loading: true});
        reqwest({
            url: 'https://randomuser.me/api',
            method: 'get',
            type: 'json',
            data: getRandomuserParams(params),
        }).then(data => {
            this.setState({
                loading: false,
                data: data.results,
                pagination: {
                    ...params.pagination,
                    total: 200,
                },
            });
        });
    };

    render() {
        const {data, pagination, loading} = this.state;
        return (
            <Table
                columns={columns}
                rowKey={record => record.login.uuid}
                dataSource={data}
                pagination={pagination}
                loading={loading}
                scroll={{ y: 480 }}
                onChange={this.handleTableChange}
            />
        );
    }
}

export default User
