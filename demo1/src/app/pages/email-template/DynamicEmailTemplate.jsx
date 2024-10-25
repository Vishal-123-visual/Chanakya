import {useEffect, useState} from 'react'
import {useCompanyContext} from '../compay/CompanyContext'
import {useDynamicFieldContext} from '../enquiry-related/DynamicFieldsContext'
import PopUpModal from '../../modules/accounts/components/popUpModal/PopUpModal'

const DynamicEmailTemplate = () => {
  const companyCTX = useCompanyContext()
  const {openModal: contextOpenModal, setOpenModal: setcontextOpenModal} = useDynamicFieldContext()
  // const [modalOpen, setModalOpen] = useState('Student')
  const {data: emailTemplates} = companyCTX.getEmailTemplate
  const [emailTemplate, setEmailTemplate] = useState({
    customTemplate: '',
  })

  // Update the email template when `emailTemplates` changes
  useEffect(() => {
    if (emailTemplates && emailTemplates[0]) {
      setEmailTemplate({
        customTemplate: emailTemplates[0]?.customTemplate || '',
      })
    }
  }, [emailTemplates])

  const handleStudent = () => {
    // setModalOpen('Student')
    setcontextOpenModal(true)
  }

  const onChangeHandler = (e) => {
    setEmailTemplate({...emailTemplate, [e.target.name]: e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await companyCTX.postEmailTemplate.mutate(emailTemplate)
    } catch (error) {
      console.error('Failed to submit template:', error)
    } finally {
      setEmailTemplate({
        customTemplate: '',
      })
    }
  }

  return (
    <div className='card p-10'>
      <div className='d-flex justify-content-between'>
        <h1>Email Templates </h1>
        <button className='btn btn-primary btn-sm' onClick={handleStudent}>
          Details
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='mb-3'>
          <label htmlFor='customTemplate' className='form-label'>
            Warning Letter Template
          </label>
          <textarea
            id='customTemplate'
            rows={15}
            value={emailTemplate.customTemplate}
            onChange={onChangeHandler}
            type='text'
            className='form-control'
            name='customTemplate'
          />
        </div>
        <button
          disabled={companyCTX.postEmailTemplate.isLoading}
          type='submit'
          className='btn btn-primary'
        >
          {companyCTX.postEmailTemplate.isLoading ? 'Adding' : 'Submit'}
        </button>
      </form>
      <PopUpModal show={contextOpenModal} handleClose={() => setcontextOpenModal(false)}>
        <h2>Student Details</h2>
        <div className='mt-5 d-flex'>
          <ul className='px-10'>
            <strong>Student Name :</strong>{' '}
            <li style={{marginBottom: '10px'}}>{'${studentInfo.name}'}</li>
            <strong>Student Father Name :</strong>{' '}
            <li style={{marginBottom: '10px'}}>{'${studentInfo.father_name}'}</li>
            <strong>Student Mobile Number :</strong>{' '}
            <li style={{marginBottom: '10px'}}>{'${studentInfo.mobile_number}'}</li>
            <strong>Student Present Address :</strong>{' '}
            <li style={{marginBottom: '10px'}}>{'${studentInfo.present_address}'}</li>
            <strong>Student Roll Number :</strong>{' '}
            <li style={{marginBottom: '10px'}}>{'${studentInfo.rollNumber}'}</li>
          </ul>
          <ul className='px-10'>
            <strong>Student Email:</strong>{' '}
            <li style={{marginBottom: '10px'}}>{'${studentInfo.email}'}</li>
            <strong>Student City :</strong>{' '}
            <li style={{marginBottom: '10px'}}>{'${studentInfo.city}'}</li>
            <strong>Student Remaining Course Fees :</strong>
            <li style={{marginBottom: '10px'}}>{'${studentInfo.remainingCourseFees}'}</li>
            <strong>Course Name :</strong>{' '}
            <li style={{marginBottom: '10px'}}>{'${courseName.courseName}'}</li>
            <strong>Course Fees :</strong>{' '}
            <li style={{marginBottom: '10px'}}>{'${courseName.courseFees}'}</li>
          </ul>
          <ul className='px-10'>
            <strong>Company Name :</strong>{' '}
            <li style={{marginBottom: '10px'}}>{'${companyName.companyName}'}</li>
            <strong>Company Email :</strong>{' '}
            <li style={{marginBottom: '10px'}}>{'${companyName.email}'}</li>
            <strong>Company Phone :</strong>{' '}
            <li style={{marginBottom: '10px'}}>{'${companyName.companyPhone}'}</li>
            <strong>Company Address :</strong>{' '}
            <li style={{marginBottom: '10px'}}>{'${companyName.companyAddress}'}</li>
            <strong>Company Website :</strong>{' '}
            <li style={{marginBottom: '10px'}}>{'${companyName.companyWebsite}'}</li>
          </ul>
        </div>
      </PopUpModal>
    </div>
  )
}

export default DynamicEmailTemplate
