import {useState} from 'react'
import './studentFeesRecipt.css'

const BASE_URL = process.env.REACT_APP_BASE_URL
const BASE_URL_Image = `${BASE_URL}/api/images`

const PrintStudentFeesRecipt = () => {
  const [studentInfoData, setStudentInfoData] = useState(
    JSON.parse(localStorage.getItem('print-student-fees-recipt'))
  )
  console.log(studentInfoData)

  const gstAmount =
    studentInfoData.studentInfo.student_status === 'GST'
      ? (Number(studentInfoData.amountPaid) * Number(studentInfoData.companyName.gst)) / 100
      : 0

  return (
    <div style={{backgroundColor: '#d2c7ba', height: '100%'}}>
      {/* Start body */}
      <table border='0' cellPadding='0' cellSpacing='0' width='100%'>
        {/* Start logo */}
        <tr>
          <td align='center' bgcolor='#D2C7BA'>
            <table
              border='0'
              cellPadding='0'
              cellSpacing='0'
              width='100%'
              style={{maxWidth: '600px'}}
            >
              <tr>
                <td align='center' valign='top' style={{padding: '36px 24px'}}>
                  <a
                    href='http://www.visualmedia.co.in/'
                    target='_blank'
                    rel='noopener noreferrer'
                    style={{display: 'inline-block'}}
                  >
                    <img
                      src={BASE_URL_Image + '/' + studentInfoData?.companyName?.logo}
                      alt='Logo'
                      border='0'
                      width='200px'
                      style={{
                        display: 'block',
                        width: '200px',
                        height: '200px',
                        maxWidth: '200px',
                        minWidth: '200px',
                      }}
                    />
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        {/* End logo */}

        {/* Start hero */}
        <tr>
          <td align='center' bgcolor='#D2C7BA'>
            <table
              border='0'
              cellPadding='0'
              cellSpacing='0'
              width='100%'
              style={{maxWidth: '600px'}}
            >
              <tr>
                <td
                  align='left'
                  bgcolor='#ffffff'
                  style={{
                    padding: '36px 24px 0',
                    fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                    borderTop: '3px solid #d4dadf',
                  }}
                >
                  <h6
                    style={{
                      margin: 0,
                      fontSize: '27px',
                      fontWeight: 700,
                      letterSpacing: '-1px',
                      lineHeight: '30px',
                      textAlign: 'left',
                    }}
                  >
                    Thank You, Your Fees Submitted Successfully
                  </h6>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        {/* End hero */}

        {/* Start student info block */}
        <tr>
          <td align='center' bgcolor='#D2C7BA' valign='top' width='100%'>
            <table
              align='center'
              bgcolor='#ffffff'
              border='0'
              cellPadding='0'
              cellSpacing='0'
              width='100%'
              style={{maxWidth: '600px'}}
            >
              <tr>
                <td align='center' valign='top' style={{fontSize: 0}}>
                  <div
                    style={{
                      display: 'inline-block',
                      width: '100%',
                      maxWidth: '30%',
                      verticalAlign: 'top',
                      marginTop: '10px',
                    }}
                  >
                    <table
                      border='0'
                      cellPadding='0'
                      cellSpacing='0'
                      width='100%'
                      style={{maxWidth: '300px'}}
                    >
                      <tr>
                        <td
                          valign='top'
                          style={{
                            fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                            fontSize: '12px',
                          }}
                        >
                          <span style={{display: 'block', width: 'max-content'}}>
                            <strong>Student Name</strong>
                          </span>
                          <span style={{display: 'block', width: 'max-content'}}>
                            <strong>Father Name</strong>
                          </span>
                          <span style={{display: 'block', width: 'max-content'}}>
                            <strong>Roll Number</strong>
                          </span>
                          <span style={{display: 'block', width: 'max-content'}}>
                            <strong>Course Name</strong>
                          </span>
                          <span style={{display: 'block', width: 'max-content'}}>
                            <strong>Payment Method</strong>
                          </span>
                        </td>
                      </tr>
                    </table>
                  </div>
                  <div
                    style={{
                      display: 'inline-block',
                      width: '100%',
                      maxWidth: '50%',
                      verticalAlign: 'top',
                      marginTop: '10px',
                    }}
                  >
                    <table
                      border='0'
                      cellPadding='0'
                      cellSpacing='0'
                      width='100%'
                      style={{maxWidth: '300px'}}
                    >
                      <tr>
                        <td
                          valign='top'
                          style={{
                            fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                            fontSize: '12px',
                          }}
                        >
                          <span style={{display: 'block', width: 'max-content'}}>
                            {studentInfoData.studentInfo.name}
                          </span>
                          <span style={{display: 'block', width: 'max-content'}}>
                            {studentInfoData.studentInfo.father_name}
                          </span>
                          <span style={{display: 'block', width: 'max-content'}}>
                            {studentInfoData.studentInfo.rollNumber}
                          </span>
                          <span style={{display: 'block', width: 'max-content'}}>
                            {studentInfoData.courseName.courseName}
                          </span>
                          <span style={{display: 'block', width: 'max-content'}}>
                            {studentInfoData.paymentOption.name}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        {/* End student info block */}

        {/* Start copy block */}
        <tr>
          <td align='center' bgcolor='#D2C7BA'>
            <table
              border='0'
              cellPadding='0'
              cellSpacing='0'
              width='100%'
              style={{maxWidth: '600px'}}
            >
              {/* Start receipt table */}
              <tr>
                <td
                  align='left'
                  bgcolor='#ffffff'
                  style={{
                    padding: '24px',
                    fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                    fontSize: '14px',
                    lineHeight: '24px',
                  }}
                >
                  <table border='0' cellPadding='0' cellSpacing='0' width='100%'>
                    <tr>
                      <td
                        align='left'
                        bgcolor='#D2C7BA'
                        width='75%'
                        style={{
                          padding: '12px',
                          fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                          fontSize: '16px',
                          lineHeight: '24px',
                        }}
                      >
                        <strong>Receipt No</strong>
                      </td>
                      <td
                        align='left'
                        bgcolor='#D2C7BA'
                        width='25%'
                        style={{
                          padding: '12px',
                          fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                          fontSize: '14px',
                          lineHeight: '24px',
                        }}
                      >
                        <strong>{studentInfoData.reciptNumber}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td
                        align='left'
                        width='75%'
                        style={{
                          padding: '6px 12px',
                          fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                          fontSize: '12px',
                          lineHeight: '24px',
                        }}
                      >
                        Fees Paid
                      </td>
                      <td
                        align='left'
                        width='25%'
                        style={{
                          padding: '6px 12px',
                          fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                          fontSize: '12px',
                          lineHeight: '24px',
                        }}
                      >
                        {studentInfoData.amountPaid} Rs
                      </td>
                    </tr>
                    <tr>
                      <td
                        align='left'
                        width='75%'
                        style={{
                          padding: '6px 12px',
                          fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                          fontSize: '12px',
                          lineHeight: '24px',
                        }}
                      >
                        Late Fees
                      </td>
                      <td
                        align='left'
                        width='25%'
                        style={{
                          padding: '6px 12px',
                          fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                          fontSize: '12px',
                          lineHeight: '24px',
                        }}
                      >
                        {studentInfoData.lateFees} Rs
                      </td>
                    </tr>
                    {studentInfoData.studentInfo?.student_status !== 'NOGST' && (
                      <tr>
                        <td
                          align='left'
                          width='75%'
                          style={{
                            padding: '6px 12px',
                            fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                            fontSize: '12px',
                            lineHeight: '24px',
                          }}
                        >
                          GST ({studentInfoData.companyName.gst} %)
                        </td>
                        <td
                          align='left'
                          width='25%'
                          style={{
                            padding: '6px 12px',
                            fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                            fontSize: '12px',
                            lineHeight: '24px',
                          }}
                        >
                          {(Number(studentInfoData.lateFees) + gstAmount).toFixed(2)} Rs.
                        </td>
                      </tr>
                    )}
                    <tr style={{border: '2px dotted black'}}>
                      <td
                        align='left'
                        width='75%'
                        style={{
                          padding: '6px 12px',
                          fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                          fontSize: '12px',
                          lineHeight: '24px',
                        }}
                      >
                        Total Amount
                      </td>
                      <td
                        align='left'
                        width='25%'
                        style={{
                          padding: '6px 12px',
                          fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                          fontSize: '12px',
                          lineHeight: '24px',
                        }}
                      >
                        {(
                          Number(studentInfoData.lateFees) +
                          Number(studentInfoData.amountPaid) +
                          (Number(studentInfoData.lateFees) + gstAmount)
                        ).toFixed(2)}{' '}
                        Rs.
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              {/* End receipt table */}

              {/* Start copy */}
              <tr>
                <td
                  align='left'
                  bgcolor='#ffffff'
                  style={{
                    padding: '24px',
                    fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                    fontSize: '14px',
                    lineHeight: '24px',
                    borderBottom: '3px solid #d4dadf',
                  }}
                >
                  <p style={{margin: 0}}>
                    If you have any questions, just reply to this email—we're always happy to help
                    out.
                  </p>
                </td>
              </tr>
              {/* End copy */}
            </table>
          </td>
        </tr>
        {/* End copy block */}

        {/* Start footer */}
        <tr>
          <td align='center' bgcolor='#D2C7BA' style={{padding: '24px'}}>
            <table
              border='0'
              cellPadding='0'
              cellSpacing='0'
              width='100%'
              style={{maxWidth: '600px'}}
            >
              {/* Start permission */}
              <tr>
                <td
                  align='center'
                  bgcolor='#D2C7BA'
                  style={{
                    padding: '12px 24px',
                    fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                    fontSize: '12px',
                    lineHeight: '20px',
                    color: '#666',
                  }}
                >
                  <p style={{margin: 0}}>
                    You received this email because we received a request for registration for your
                    account. If you didn't request registration, you can safely delete this email.
                  </p>
                </td>
              </tr>
              {/* End permission */}
            </table>
          </td>
        </tr>
        {/* End footer */}
      </table>
      {/* End body */}
    </div>
  )
}
export default PrintStudentFeesRecipt
