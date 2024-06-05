import {useState} from 'react'
import moment from 'moment'
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
    <div style={{backgroundColor: 'white', height: '100%'}}>
      {/* Start body */}
      <table border='0' cellPadding='0' cellSpacing='0' width='100%'>
        {/* Start logo */}
        <tr>
          <td align='center' bgcolor='white'>
            <table
              border='0'
              cellPadding='0'
              cellSpacing='0'
              width='100%'
              style={{maxWidth: '600px'}}
            >
              <tr>
                <td align='center' valign='top' style={{padding: '5px 20px'}}>
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
                        border: '1px solid black',
                        borderRadius: '5px',
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
          <td align='center' bgcolor='white'>
            <table
              border='0'
              cellPadding='0'
              cellSpacing='0'
              width='100%'
              style={{maxWidth: '600px'}}
            >
              <tr>
                <td
                  bgcolor='#ffffff'
                  style={{
                    padding: '5px 16px',
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
          <td align='center' bgcolor='white' valign='top' width='100%'>
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
                          <span style={{display: 'block', width: 'max-content'}}>
                            <strong>Payment Date</strong>
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
                          <span style={{display: 'block', width: 'max-content'}}>
                            {moment(+studentInfoData.amountDate).format('DD-MM-YYYY')}
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
          <td align='center' bgcolor='white'>
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
                    padding: '5px 20px',
                    fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                    fontSize: '14px',
                    lineHeight: '24px',
                  }}
                >
                  <table border='0' cellPadding='0' cellSpacing='0' width='100%'>
                    <tr>
                      <td
                        align='left'
                        bgcolor='white'
                        width='75%'
                        style={{
                          padding: '0 12px',
                          fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                          fontSize: '16px',
                          lineHeight: '24px',
                        }}
                      >
                        <strong>Receipt No</strong>
                      </td>
                      <td
                        align='left'
                        bgcolor='white'
                        width='25%'
                        style={{
                          padding: '0 12px',
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
                          padding: '0px 12px',
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
                          padding: '0px 12px',
                          fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                          fontSize: '12px',
                          lineHeight: '24px',
                        }}
                      >
                        Rs {studentInfoData.amountPaid}
                      </td>
                    </tr>
                    <tr>
                      <td
                        align='left'
                        width='75%'
                        style={{
                          padding: '0px 12px',
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
                          padding: '0px 12px',
                          fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                          fontSize: '12px',
                          lineHeight: '24px',
                        }}
                      >
                        Rs {studentInfoData.lateFees}
                      </td>
                    </tr>
                    {studentInfoData.studentInfo?.student_status !== 'NOGST' && (
                      <tr>
                        <td
                          align='left'
                          width='75%'
                          style={{
                            padding: '0px 12px',
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
                            padding: '0px 12px',
                            fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                            fontSize: '12px',
                            lineHeight: '24px',
                          }}
                        >
                          Rs {(Number(studentInfoData.lateFees) + gstAmount).toFixed(2)}
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
                        Total
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
                        Rs{' '}
                        {(
                          Number(studentInfoData.lateFees) +
                          Number(studentInfoData.amountPaid) +
                          (Number(studentInfoData.lateFees) + gstAmount)
                        ).toFixed(2)}{' '}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              {/* End receipt table */}

              {/* Start copy */}
              <tr>
                <td
                  bgcolor='#ffffff'
                  style={{
                    padding: '0 20px',
                    fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                    fontSize: '14px',
                    lineHeight: '17px',
                    borderBottom: '3px solid #d4dadf',
                  }}
                >
                  <p style={{margin: 0}}>{studentInfoData.companyName.companyAddress}</p>
                  <p style={{textAlign: 'center'}}>
                    Contact Us : +91 {studentInfoData.companyName.companyPhone}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                    }}
                  >
                    <p>
                      Email :{' '}
                      <a href={studentInfoData.companyName.email} target='_blank'>
                        {studentInfoData.companyName.email} |
                      </a>{' '}
                    </p>
                    <p>
                      Website :{' '}
                      <a href={studentInfoData.companyName.companyWebsite} target='_blank'>
                        {studentInfoData.companyName.companyWebsite}
                      </a>
                    </p>
                  </div>
                </td>
              </tr>
              {/* End copy */}
            </table>
          </td>
        </tr>
        {/* End copy block */}

        {/* Start footer */}
        <tr>
          <td align='center' bgcolor='white'>
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
                  bgcolor='white'
                  style={{
                    fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                    fontSize: '12px',
                    color: '#666',
                  }}
                >
                  <b> Important Note : </b>
                  <p>
                    CHEQUES SUBJECT TO REALISATION <br />
                    THE RECEIPT MUST BE PRODUCED WHEN DEMANDED FEES <br /> ONCE FEES PAID ARE NOT
                    REFUNDABLE <br /> To stop receiving these emails, you can{' '}
                    <a
                      href='http://www.visualmedia.co.in/'
                      target='_blank'
                      style={{textDecoration: 'underline'}}
                    >
                      unsubscribe
                    </a>{' '}
                    at any time
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
