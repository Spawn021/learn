'use client'
import React from 'react'
import { Button, Col, Divider, Form, Input, notification, Row } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { sendRequest } from '@/utils/api'
import { useRouter } from 'next/navigation'
const Register = () => {
  const router = useRouter()
  const onFinish = async (values: any) => {
    const { email, password, name } = values
    const res = await sendRequest<IBackendRes<any>>({
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`,
      body: {
        email,
        password,
        name,
      },
    })

    if (res?.data) {
      router.push(`/verify/${res?.data?.data._id}`)
    } else {
      notification.error({
        message: 'Đăng ký không thành công',
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
          <legend>Đăng Ký Tài Khoản</legend>
          <Form name="basic" onFinish={onFinish} autoComplete="off" layout="vertical">
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please input your email!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item label="Name" name="name">
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

export default Register
