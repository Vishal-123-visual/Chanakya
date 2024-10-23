import React, {useEffect, useState} from 'react'
import {KTIcon} from '../../../_metronic/helpers'
import PopUpModal from '../../modules/accounts/components/popUpModal/PopUpModal'
import {useDynamicFieldContext} from '../enquiry-related/DynamicFieldsContext'
import moment from 'moment'
import {useAuth} from '../../modules/auth'
import {useCompanyContext} from '../compay/CompanyContext'
import axios from 'axios'
import {toast} from 'react-toastify'
import {useStudentCourseFeesContext} from '../courseFees/StudentCourseFeesContext'

const BASE_URL = process.env.REACT_APP_BASE_URL

const StudentEmailsTable = ({studentInfoData}) => {
  const [emailLogs, setEmailLogs] = useState([])
  const [isSendingEmail, setIsSendingEmail] = useState(false) // Track sending status
  const [emailTemplates, setEmailTemplates] = useState([])
  const companyCTX = useCompanyContext()
  const studentPayFeeCtx = useStudentCourseFeesContext()
  const result = studentPayFeeCtx.useSingleStudentCourseFees(studentInfoData?._id)
  const {data: emailTemplate} = companyCTX.getEmailTemplate
  const [selectValue, setSelectValue] = useState('')

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/allMails`)
        setEmailLogs(res.data)
      } catch (error) {
        console.log('Failed to fetch email logs')
      }
    }

    const fetchEmailTemplates = async () => {
      try {
        const res = await companyCTX.getEmailTemplate
        setEmailTemplates(res.data || [])
        if (res.data.length > 0) {
          setSelectValue(res.data[0].customTemplate) // Set the first template as selected
        }
      } catch (error) {
        console.log('Failed to fetch email templates')
      }
    }

    fetchEmails()
    fetchEmailTemplates()
  }, [emailLogs])

  const student = result?.data || []

  const {openModal: contextOpenModal, setOpenModal: setcontextOpenModal} = useDynamicFieldContext()
  const {data: singleCompanyData} = companyCTX?.useGetSingleCompanyData(
    studentInfoData?.companyName
  )

  console.log(singleCompanyData)

  const handleSelectionChange = (e) => {
    const selectedValue = e.target.value
    setSelectValue(selectedValue)
  }

  const sendWarningEmail = async (studentData) => {
    setIsSendingEmail(true) // Start sending email
    try {
      const res = await axios.post(`${BASE_URL}/api/students/sendWarningMail`, studentData)
      if (res.data.success) {
        toast.success(
          res.data.message,
          {
            style: {
              fontSize: '18px',
              color: 'white',
              background: 'black',
            },
          },
          setcontextOpenModal(false)
        )
      }
    } catch (error) {
      console.error('Error sending email:', error)
      toast.error('Failed to send email')
    } finally {
      setIsSendingEmail(false) // Stop sending email
    }
  }

  const formatLetter = (template, studentInfoData, courseName, remainingFees) => {
    if (!studentInfoData || !singleCompanyData) return '' // Guard clause
    return template
      .replace(/\${studentInfo.name}/g, studentInfoData.name || '')
      .replace(/\${studentInfo.mobile_number}/g, studentInfoData.mobile_number || '')
      .replace(/\${studentInfo.present_address}/g, studentInfoData.present_address || '')
      .replace(/\${studentInfo.city}/g, studentInfoData.city || '')
      .replace(/\${studentInfo.father_name}/g, studentInfoData.father_name || '')
      .replace(/\${courseName.courseName}/g, studentInfoData.select_course || '')
      .replace(/\${companyName.companyName}/g, singleCompanyData.companyName || '')
      .replace(/\${remainingFees}/g, studentInfoData.remainingCourseFees || '')
  }

  // console.log(emailTemplate[0]?.customTemplate)
  // console.log(studentInfoData)

  return (
    <>
      <div className={`card my-10`}>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold fs-3 mb-1'>Student Emails</span>
            <span className='mt-1 fw-semibold fs-7'>{studentInfoData?.name}</span>
          </h3>
          <div className='card-toolbar'>
            <button
              className='btn btn-sm btn-light-primary'
              onClick={() => setcontextOpenModal(true)}
            >
              <KTIcon iconName='send' className='fs-3' />
              Send Email
            </button>
          </div>
        </div>
        <div className='card-body py-3'>
          <div className='table-responsive'>
            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
              <thead>
                <tr className='fw-bold '>
                  <th className='w-25px'></th>
                  <th className='min-w-100px'>Email Date and Time</th>
                  <th className='min-w-150px'>Subject</th>
                </tr>
              </thead>
              <tbody>
                {emailLogs.length === 0 ? (
                  <tr>
                    <td colSpan={3} className='text-center'>
                      <h4>No student Mail data available</h4>
                    </td>
                  </tr>
                ) : (
                  emailLogs
                    ?.filter((check) => {
                      if (!studentInfoData || !studentInfoData.email) {
                        console.error('Student info data or email is undefined')
                        return false
                      }
                      return check.recipientEmails?.includes(studentInfoData?.email)
                    })
                    .map((email, index) => (
                      <tr key={index}>
                        <td>
                          <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
                        </td>
                        <td>
                          <a className='text-dark fw-bold text-hover-primary d-block fs-6'>
                            {moment(email.sentAt).format('DD/MM/YYYY hh:mm A')}
                          </a>
                        </td>
                        <td>
                          <a className='text-dark fw-bold text-hover-primary d-block fs-6'>
                            {email.subject}
                          </a>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <PopUpModal show={contextOpenModal} handleClose={() => setcontextOpenModal(false)}>
        <div className='d-flex justify-content-end'>
          <select
            className='form-select form-select-solid form-select-lg mt-8'
            onChange={handleSelectionChange}
            value={selectValue}
          >
            {emailTemplate?.length > 0 ? (
              emailTemplate.map((email) => (
                <option key={email._id} value={email.customTemplate}>
                  Warning Letter {/* Assuming there is a name or title for the template */}
                </option>
              ))
            ) : (
              <option disabled>No templates available</option>
            )}
          </select>
        </div>

        {/* Render HTML content for the selected email template */}
        {emailTemplate?.length > 0 && selectValue === emailTemplate[0]?.customTemplate && (
          <div className='mt-5'>
            <pre
              style={{
                fontFamily: 'Gill Sans, sans-serif',
                fontSize: '12px',
                color: '#333',
                padding: '4px',
              }}
            >
              {formatLetter(
                selectValue,
                studentInfoData,
                studentInfoData?.select_course,
                studentInfoData?.remainingCourseFees
              )}
            </pre>
          </div>
        )}

        <div className='footer d-flex justify-content-end'>
          <button
            className='btn btn-primary'
            onClick={() => sendWarningEmail(student.length > 0 ? student[0] : null)}
            disabled={studentInfoData?.remainingCourseFees === 0 ? 'disabled' : isSendingEmail}
          >
            <KTIcon iconName='send' className='fs-3' />
            {isSendingEmail ? 'Sending...' : 'Send Email'}
          </button>
        </div>
      </PopUpModal>
    </>
  )
}

export default StudentEmailsTable
