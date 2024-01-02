'use client'

import { useState } from 'react'

const Login = () => {
  const [data, setData] = useState({
    username: '',
    password: '',
    email: ''
  })
  return (
    <div className="">
      <div>
        <input
          type="text"
          value={data.username}
          placeholder="账号"
          onChange={e => {
            setData({ ...data, username: e.target.value })
          }}
          required
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="密码"
          required
          onChange={e => {
            setData({ ...data, password: e.target.value })
          }}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="邮箱"
          required
          onChange={e => {
            setData({ ...data, email: e.target.value })
          }}
        />
      </div>
      <button
        onClick={() => {
          fetch('/api/user/create', {
            method: 'POST',
            body: JSON.stringify(data)
          })
            .then(res => res.json())
            .then(res => console.log(res, 'res'))
        }}
      >
        注册
      </button>
    </div>
  )
}

export default Login
