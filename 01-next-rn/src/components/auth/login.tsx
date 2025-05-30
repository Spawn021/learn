'use client'
import { Button, Col, Divider, Form, Input, notification, Row } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { authenticate } from '@/utils/action'

const Login = () => {
  const router = useRouter()
  const onFinish = async (values: any) => {
    const { email, password } = values
    const res = await authenticate(email, password)
    if (res?.error) {
      if (res?.code === 1) {
        notification.error({
          message: 'Đăng nhập thất bại',
          description: 'Email hoặc mật khẩu không đúng',
        })
      } else if (res?.code === 2) {
        notification.error({
          message: 'Đăng nhập thất bại',
          description: 'Tài khoản chưa được kích hoạt',
        })
        router.push('/verify')
      } else {
        notification.error({
          message: 'Đăng nhập thất bại',
          description: 'Có lỗi xảy ra, vui lòng thử lại sau',
        })
      }
    } else {
      router.push('/dashboard')
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
          <legend>Đăng Nhập</legend>
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

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Login
              </Button>
            </Form.Item>
          </Form>
          <Link href={'/'}>
            <ArrowLeftOutlined /> Quay lại trang chủ
          </Link>
          <Divider />
          <div style={{ textAlign: 'center' }}>
            Chưa có tài khoản? <Link href={'/auth/register'}>Đăng ký tại đây</Link>
          </div>
        </fieldset>
      </Col>
    </Row>
  )
}

export default Login
