import React, {useState} from 'react'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import {useAdmissionContext} from '../../../modules/auth/core/Addmission'
import {useStudentCourseFeesContext} from '../../courseFees/StudentCourseFeesContext'
import moment from 'moment'
import {useParams} from 'react-router-dom'
import {useCourseContext} from '../CourseContext'

const DocumentViewer = ({companyId, toDate, fromDate, categoryId}) => {
  const [isPreviewVisible, setIsPreviewVisible] = useState(false)
  const [pdfURL, setPdfURL] = useState('')
  const ctx = useCourseContext()
  const params = useParams()
  const studentPayFeeCtx = useStudentCourseFeesContext()

  const courseIds = ctx.getCourseLists?.data?.map((course) => course?.category?._id)
  // console.log(categoryId)

  // Fetch student fee data
  const studentFees = studentPayFeeCtx.getAllStudentsCourseFees?.data || []

  const formattedFromDate = fromDate ? moment(fromDate).startOf('day') : null
  const formattedToDate = toDate ? moment(toDate).endOf('day') : null

  const filteredStudentFees = studentFees.filter((fee) => {
    const feeDate = moment(fee.amountDate).startOf('day') // Parse fee date and set time to midnight
    const companyMatch = fee?.companyName === params.id // Match on company ID
    const fromDateMatch = !formattedFromDate || feeDate.isSameOrAfter(formattedFromDate, 'day')
    const toDateMatch = !formattedToDate || feeDate.isSameOrBefore(formattedToDate, 'day')
    const courseMatch = fee.courseName.category === categoryId // Match on course category

    // Debugging logs to see the dates being compared

    // Filter students who match all criteria
    return companyMatch && fromDateMatch && toDateMatch && courseMatch
  })

  // console.log(filteredStudentFees)
  // console.log(c)

  // Group the filtered fees by course
  const groupedByCourse = filteredStudentFees.reduce((acc, fee) => {
    const courseId = fee.courseName._id
    if (!acc[courseId]) {
      acc[courseId] = []
    }
    acc[courseId].push(fee)
    return acc
  }, {})

  // Map filtered fees to include student details
  const dataForPDF = (fees) =>
    fees.map((fee) => ({
      rollNumber: fee.studentInfo?.rollNumber || 'N/A',
      studentName: fee.studentInfo?.name || 'N/A',
      fatherName: fee.studentInfo?.father_name || 'N/A',
      courseName: fee.courseName?.courseName || 'N/A',
      reciptNumber: fee.reciptNumber || 'N/A',
      amountPaid: fee.amountPaid || 0,
      remainingFees: fee.remainingFees || 0,
      totalPaid: fee?.studentInfo?.totalPaid || 0,
      amountDate: moment(fee?.studentInfo?.createdAt).format('DD/MM/YYYY'),
      addedBy: fee.addedBy || 'N/A',
    }))

  // Function to generate PDF for each course
  const generatePDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(12)

    const courseIds = Object.keys(groupedByCourse)

    courseIds.forEach((courseId, index) => {
      const courseFees = groupedByCourse[courseId]
      const courseName = courseFees[0]?.courseName?.courseName || 'Unknown Course'

      // Title for each course PDF
      doc.text(`${courseName} - Student Fee Report`, 20, 20)

      // Add table header
      const headers = [
        [
          'Roll Number',
          'Name',
          'Father Name',
          'Course',
          'Amount Paid',
          'Total Paid',
          'Remaining Fees',
          'Date',
          'Added By',
        ],
      ]

      // Add table data
      const data = dataForPDF(courseFees).map((item) => [
        item.rollNumber,
        item.studentName,
        item.fatherName,
        item.courseName,
        item.amountPaid,
        item.totalPaid,
        item.remainingFees,
        item.amountDate,
        item.addedBy,
      ])

      // Add table using autoTable
      doc.autoTable({
        head: headers,
        body: data,
        startY: 30,
      })

      // Calculate total amount paid for the course
      const totalAmount = courseFees.reduce((sum, fee) => sum + fee.amountPaid, 0)
      doc.text(`Total Amount Paid: ${totalAmount}`, 20, doc.lastAutoTable.finalY + 10)

      // Add a new page for the next course if more than one course exists
      if (index < courseIds.length - 1) {
        doc.addPage()
      }
    })

    // Convert PDF to Blob URL for preview
    const pdfBlob = doc.output('blob')
    const pdfURL = URL.createObjectURL(pdfBlob)
    setPdfURL(pdfURL)

    // Show modal for preview
    setIsPreviewVisible(true)
  }

  return (
    <div>
      {/* Generate PDF Button */}
      <button onClick={generatePDF} className='btn btn-primary btn-sm'>
        Generate PDF
      </button>

      {/* Preview Modal */}
      {isPreviewVisible && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: '999',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              position: 'relative',
              width: '80%',
              height: '80%',
              zIndex: '999',
            }}
          >
            <iframe
              src={pdfURL}
              title='PDF Preview'
              style={{width: '100%', height: '100%', border: 'none'}}
            ></iframe>
            <button
              onClick={() => setIsPreviewVisible(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'red',
                color: '#fff',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DocumentViewer
