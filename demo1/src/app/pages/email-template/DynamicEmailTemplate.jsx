import {useEffect, useState} from 'react'
import {useCompanyContext} from '../compay/CompanyContext'

const DynamicEmailTemplate = () => {
  const companyCTX = useCompanyContext()
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
      <h1>Email Templates </h1>
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
    </div>
  )
}

export default DynamicEmailTemplate
