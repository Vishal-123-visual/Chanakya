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
  const [selectValue, setSelectValue] = useState('Warning') // Default value is 'Warning'
  const [emailLogs, setEmailLogs] = useState([])
  const companyCTX = useCompanyContext()
  const studentPayFeeCtx = useStudentCourseFeesContext()
  const result = studentPayFeeCtx.useSingleStudentCourseFees(studentInfoData?._id)
  const {data: emailRemainderData} = companyCTX.getEmailRemainderTextMessage
  // console.log(emailRemainderData)
  // Logging the API response for debugging
  // console.log('API Response:', result)
  // console.log(selectValue)
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/allMails`)
        setEmailLogs(res.data)
      } catch (error) {
        console.log('Failed to fetch email logs')
      }
    }
    fetchEmails()
  }, [emailLogs])
  // console.log(emailLogs)

  // Ensure student is always an array
  const student = result?.data || []
  // console.log('Student Data:', student)

  const {openModal: contextOpenModal, setOpenModal: setcontextOpenModal} = useDynamicFieldContext()
  const {data: singleComapnyData} = companyCTX?.useGetSingleCompanyData(
    studentInfoData?.companyName
  )

  const handleSelectionChange = (e) => {
    const selectedValue = e.target.value
    setSelectValue(selectedValue)
  }

  const sendWarningEmail = async (studentData) => {
    try {
      // console.log(studentData)
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
    }
  }

  const sendReminderMailToStudent = async (studentData, selectValue) => {
    try {
      // console.log(studentData)
      const res = await axios.post(
        `${BASE_URL}/api/students/reminderMails`,
        studentData,
        selectValue
      )
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
    } catch (error) {}
  }

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
                {/* {console.log('studentInfoData:', studentInfoData)}
                {console.log('emailLogs:', emailLogs)} */}

                {emailLogs.length === 0 ? (
                  <tr>
                    <td colSpan={3} className='text-center'>
                      <h4>No student Mail data available</h4>
                    </td>
                  </tr>
                ) : (
                  emailLogs
                    ?.filter((check) => {
                      // console.log('Check object:', check)
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
            <option value='Warning'>Warning Letter</option>
            {/* {emailRemainderData?.map((data, index) => (
              <React.Fragment key={index}>
                <option value={data.firstRemainder}>First Fee Remainder</option>
                <option value={data.secondRemainder}>Second Fee Remainder</option>
                <option value={data.thirdRemainder}>Third Fee Remainder</option>
              </React.Fragment>
            ))} */}
          </select>
        </div>
        {selectValue === 'Warning' && (
          <div className='mt-5'>
            <h5 className='fw-bold'>Final Notice Regarding Pending Fees</h5>
            {/* <p>[Your Name]</p> */}
            <p>Centre Manager</p>
            <p>{singleComapnyData?.companyName}</p>
            <p>{singleComapnyData?.companyAddress}</p>
            <p>
              Website:{' '}
              <a href='https://visualmedia.co.in/' target='_blank'>
                {singleComapnyData?.companyWebsite}
              </a>
            </p>
            <p>
              Email: <a href='mailto:info@visualmedia.co.in'>{singleComapnyData?.email}</a>
            </p>

            <hr />
            {/* <p>{moment}</p> */}

            <p>{studentInfoData?.name}</p>
            <p>
              <a href={`tel:+91${studentInfoData?.phone_number}`}>
                +91 {studentInfoData?.phone_number}
              </a>
            </p>
            <p>{studentInfoData?.present_address}</p>
            <p>{studentInfoData?.city}</p>
            <hr />
            <p>
              <strong>Subject:</strong> Final Notice Regarding Pending Fees for Web Designing Course
            </p>
            <hr />
            <p>Dear {studentInfoData?.name},</p>
            <p>
              I hope this letter finds you well. We have previously communicated with you regarding
              the outstanding fees for the {studentInfoData?.select_course} Course at{' '}
              {singleComapnyData?.companyName}. Despite our previous notices, it has come to our
              attention that your outstanding fees have not been settled.
            </p>
            <p>
              This letter serves as a final warning and an opportunity for you to rectify this
              matter before further action is taken. As a reminder, the outstanding balance for your{' '}
              {studentInfoData?.select_course} Course is Rs{' '}
              {studentInfoData?.no_of_installments_amount}/-.
            </p>
            <p>
              We understand that various circumstances may have arisen, leading to this delay in
              payment. However, it is essential to resolve this matter promptly, as failure to do so
              will have serious consequences:
            </p>
            <ul>
              <li>
                <strong>Certificate Issuance:</strong> If your outstanding fees are not cleared by
                15 of this month and this year, we will be unable to issue your{' '}
                {studentInfoData?.select_course} Course completion certificate.
              </li>
              <li>
                <strong>Admission Status:</strong> If your fees remain unpaid after the
                aforementioned deadline, your admission will be considered canceled.
              </li>
            </ul>
            <p>We encourage you to act swiftly. You can settle your outstanding fees through:</p>
            <ul>
              <li>
                <strong>Online Payment:</strong> Visit our Google Pay, Phone Pay, Paytm, UPI, Cash,
                Cheque, Credit Card, Bharat Pay and follow the instructions to make a secure online
                payment.
              </li>
              <li>
                <strong>In-Person Payment:</strong> You can also visit our institution's finance
                department during business hours to make the payment in person. Please bring this
                letter with you as reference.
              </li>
            </ul>
            <p>We hope this matter will be resolved promptly.</p>
            <p>Sincerely,</p>
            <p>Centre Manager</p>
            <p>Visual Media Technology</p>
            <p>
              <a href='tel:+917696300600'>+91 7696300600</a>
            </p>
          </div>
        )}
        {/* {selectValue === emailRemainderData[0]?.firstRemainder &&
          emailRemainderData[0]?.firstRemainder}
        {selectValue === emailRemainderData[0]?.secondRemainder &&
          emailRemainderData[0]?.secondRemainder}
        {selectValue === emailRemainderData[0]?.thirdRemainder &&
          emailRemainderData[0]?.thirdRemainder} */}
        <div className='footer d-flex justify-content-end'>
          <button className='btn btn-primary' onClick={() => sendWarningEmail(student[0] || null)}>
            <KTIcon iconName='send' className='fs-3' />
            Send
          </button>
        </div>
      </PopUpModal>
    </>
  )
}

export default StudentEmailsTable
