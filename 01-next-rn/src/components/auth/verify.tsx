'use client'
import React from 'react'
import { Button, Col, Divider, Form, Input, message, notification, Row } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { sendRequest } from '@/utils/api'
import { useRouter } from 'next/navigation'
const Verify = (props: any) => {
  const { id } = props
  const router = useRouter()
  const onFinish = async (values: any) => {
    const { _id, code } = values
    const res = await sendRequest<IBackendRes<any>>({
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/verify`,
      body: {
        _id,
        code,
      },
    })
    if (res?.data) {
      message.success('Kích hoạt tài khoản thành công')
      router.push('/auth/login')
    } else {
      notification.error({
        message: 'Kích hoạt tài khoản không thành công',
        description: res?.message || 'Có lỗi xảy ra',
      })
    }
  }

  return (
    <Row justify={'center'} style={{ marginTop: '30px' }}>
      <Col xs={24} md={16} lg={8}>
        <fieldset
          style={{
            padding: '15px',
            margin: '5px',
            border: '1px solid #ccc',
            borderRadius: '5px',
          }}
        >
          <legend>Kích hoạt Tài Khoản</legend>
          <Form name="basic" onFinish={onFinish} autoComplete="off" layout="vertical">
            <Form.Item label="Id" name="_id" initialValue={id} hidden>
              <Input disabled />
            </Form.Item>

            <Form.Item
              label="Code"
              name="code"
              rules={[
                {
                  required: true,
                  message: 'Please input your code',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
          <Link href={'/'}>
            <ArrowLeftOutlined /> Quay lại trang chủ
          </Link>
          <Divider />
          <div style={{ textAlign: 'center' }}>
            Đã có tài khoản? <Link href={'/auth/login'}>Đăng nhập</Link>
          </div>
        </fieldset>
      </Col>
    </Row>
  )
}

export default Verify
