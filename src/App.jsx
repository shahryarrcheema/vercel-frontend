import { useState } from 'react'
import './App.css'
import { Button, Form, Image, Input, message, Modal, Select, Table } from 'antd'

import { DeleteFilled, DeleteOutlined, EditFilled, EditOutlined, PlusOutlined } from '@ant-design/icons'
import axios from 'axios'
import useSwr,{mutate} from 'swr'
axios.defaults.baseURL=import.meta.env.VITE_BACKEND_URL


function App() {
  const [model, setModel] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [imgUrl, setImgUrl] = useState(null)
  const [regForm] = Form.useForm()
  const [id,setId]=useState(null)

  const onDelete=async(id)=>{
    try{
      await axios.delete(`register/${id}`)
      message.success('data deleted')
      mutate('/register')
    }
    catch(err){
     message.error('unable to delete data')

    }
  }
  const onUpdate=(obj)=>{
    try{
       delete obj.profile;
       setModel(true)
       regForm.setFieldsValue(obj)
       setId(obj._id)
    }
    catch(err){
      message.error('unable to update')
    }
  }

  const handleImage = (e) => {
    const file = e.target.files[0]
    const fReader = new FileReader()
    if (file.size <= 60000) {
      alert('success')
      setDisabled(false)
      regForm.setFields([{ name: 'profile', errors: [] }])
      fReader.readAsDataURL(file)
      fReader.onload = (ev) => {
        const url = ev.target.result
        setImgUrl(url)


      }

    }
    else {
      setDisabled(true)
      regForm.setFields([{ name: 'profile', errors: ['max 60kb Image size'] }])
    }
  }
  const onFinish = async (values) => {
    imgUrl ? values.profile = imgUrl : values.profile = 'https://www.dreamstime.com/vector-illustration-avatar-dummy-logo-collection-image-icon-stock-isolated-object-set-symbol-web-image137160339'
    console.log(values)
    try {
      await axios.post('/register', values)
      //toast.success('registered successfully')
      setTimeout(() => {
        setModel(false)
        regForm.resetFields()
        message.success('added')
        setImgUrl(null)
        mutate('/register')
      }, 300)
    }
    catch (err) {
      if(err.response.data.error.code ===11000)
        return  regForm.setFields([{ name: 'email', errors: ['email already exist!'] }])
      //toast.error('Unable to insert data')
    }
  }

    const Update = async (values) => {
    imgUrl ? values.profile = imgUrl : delete values.profile
    console.log(values)
    try {
      await axios.put(`/register/${id}`, values)
      //toast.success('registered successfully')
      setTimeout(() => {
        setModel(false)
        regForm.resetFields()
        message.success('added')
        setImgUrl(null)
        setId(null)
        mutate('/register')
        message.success('updated')
      }, 300)
    }
    catch (err) {
     
      message.error('unable to update the data')
    }
  }

  const columns = [
    {
      title: 'Profile',
      dataIndex: 'profile',
      key: 'profile',
      render:(_,obj)=>(

      <Image src={obj.profile} width={70} height={30} className='rounded-full'></Image>
      )
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Mobile',
      dataIndex: 'mobile',
      key: 'mobile'
    },
    {
      title: 'Dob',
      dataIndex: 'dob',
      key: 'dob'
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender'
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_,obj) => (
        <div>
          <Button
            className='text-green-500'
            icon={<span className='text-green-500'>{<EditFilled />}</span>}
            shape='circle' type='text' 
            onClick={()=>onUpdate(obj)}
            />
          <Button
            className='text-rose-500'
            icon={<span className='text-rose-700'><DeleteFilled /></span>}
            shape='circle' type='text'
            onClick={()=>onDelete(obj._id)}
            />
        </div>
      )
    },
  ]
   
   const fetcher =async(url)=>{
    try{
       const {data} =await axios.get(url)
       return data;
    }
    catch(error) {
      console.error(error)
        return null;
    }
   }

  const {data, error} = useSwr(

    '/register',fetcher
  )
    const dataSource = data && data.map(item=>({
    ...item,key:item._id
  }))
  const onClose =()=>{
    setModel(false)
    setId(null)
    regForm.resetFields()
  }


console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);


  return (
    <>
 
      <div className='min-h-screen bg-rose-100 flex flex-col items-center md:p-4'>
        <div className='flex rounded justify-between items-center my-5 p-4 bg-blue-600 w-10/12'>
          <h1 className='capitalize font-bold  text-white text-2xl md:text-5xl'>mern Crud Operation</h1>
          <Button
            icon={<PlusOutlined />} shape='circle' size='large' className='!bg-green-500 !text-white hover:!bg-white hover:!text-blue-900' type='text' onClick={() => setModel(true)}></Button>
        </div>
        <Table className='w-10/12'
          columns={columns}
          dataSource={dataSource}
          pagination={{ pageSize: 5, position: ['bottomCenter'] }}
          scroll={{ x: 'max-content' }}
        />
        <Modal
          open={model} onCancel={onClose} footer={null} title={<h1 className='text-xl font-semibold'>Registration Form</h1>} width={720}  >
          <Form layout='vertical' className='font-semibold' onFinish={id ? Update : onFinish} form={regForm}>
            <div className='mt-5 grid md:grid-cols-2 gap-x-2'>
              <Form.Item label='Profile' name='profile'>
                <Input size='large' type='file' onChange={(e) => handleImage(e)} />
              </Form.Item>
              <Form.Item label='FullName' name='name' rules={[{ required: true }]}>
                <Input size='large' />
              </Form.Item>
              <Form.Item label='Email' name='email' rules={[{ required: true }]}>
                <Input size='large' />
              </Form.Item>
              <Form.Item label='Mobile' name='mobile' rules={[{ required: true }]}>
                <Input size='large' />
              </Form.Item>
              <Form.Item label='Dob' name='dob' rules={[{ required: true }]}>
                <Input type='date' size='large' />
              </Form.Item>
              <Form.Item label='Gender' name='gender' rules={[{ required: true }]}>
                <Select placeholder='Select Gender' size='large'>
                  <Select.Option value='male'>Male</Select.Option>
                  <Select.Option value='female'>Female</Select.Option>
                </Select>
              </Form.Item>
            </div>
            <Form.Item label='Address' name='address' rules={[{ required: true }]}>
              <Input.TextArea rows={4} style={{ resize: 'none' }} />
            </Form.Item>
            <Form.Item >
              {id ? <Button className='w-full font-semibold !text-white !bg-red-600' size='large' icon={<PlusOutlined />} htmlType='submit' disabled={disabled}>Update Now</Button>
                 :  <Button className='w-full font-semibold !text-white !bg-blue-600' size='large' icon={<PlusOutlined />} htmlType='submit' disabled={disabled}>Register Now</Button>}
            </Form.Item>
          </Form>
        </Modal>
      </div>
 
    </>
  )
}

export default App
