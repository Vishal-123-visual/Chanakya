import {useNavigate, useParams} from 'react-router-dom'
import {KTIcon} from '../../../_metronic/helpers'
import {useStudentCourseFeesContext} from '../courseFees/StudentCourseFeesContext'
import moment from 'moment'
import {useCompanyContext} from '../compay/CompanyContext'
import {useState} from 'react'

const PaymentApproval = () => {
  const params = useParams()
  const navigate = useNavigate()
  const {
    getAllStudentsCourseFees,
    createStudentStatusMutation,
    useSingleStudentCourseFees,
    getAllRecieptStatusData,
  } = useStudentCourseFeesContext()

  // State for search query
  const [searchQuery, setSearchQuery] = useState('')

  // Filter approvalData based on the company ID
  const approvalData = getAllRecieptStatusData?.data?.approvalData?.filter(
    (data) => data.companyId === params.id
  )

  // Filter the course fees data based on the company name
  const dataReciepts = getAllStudentsCourseFees?.data?.filter(
    (data) => data.studentInfo.companyName === params.id
  )

  const companyCTX = useCompanyContext()
  const {data: singleComapnyData} = companyCTX?.useGetSingleCompanyData(params?.id)
  const recieptCount = dataReciepts?.length

  const handleStatusChange = (recieptId, studentId, status) => {
    createStudentStatusMutation.mutate({
      studentId: studentId,
      companyId: params.id,
      reciept: recieptId,
      status,
    })
  }

  // Function to get the status for each receipt based on approvalData
  const getReceiptStatus = (recieptId) => {
    const approval = approvalData?.find((data) => data.reciept.toString() === recieptId.toString())
    return approval ? approval.status : 'Pending'
  }

  // Sort the receipts to ensure Pending comes first
  const sortedDataReciepts = dataReciepts?.sort((a, b) => {
    const statusA = getReceiptStatus(a._id)
    const statusB = getReceiptStatus(b._id)
    if (statusA === 'Pending' && statusB !== 'Pending') {
      return -1 // Move Pending items to the top
    }
    if (statusB === 'Pending' && statusA !== 'Pending') {
      return 1 // Move Pending items to the top
    }
    return 0 // Keep the order for other statuses
  })

  // Filter the receipts based on search query
  const filteredDataReciepts = sortedDataReciepts?.filter((reciept) => {
    const studentName = reciept?.studentInfo?.name?.toLowerCase() || ''
    const courseName = reciept?.courseName?.courseName?.toLowerCase() || ''
    const recieptNumber = reciept?.reciptNumber?.toLowerCase() || ''
    const query = searchQuery.toLowerCase()
    return (
      studentName.includes(query) || courseName.includes(query) || recieptNumber.includes(query)
    )
  })

  // Function to check if a receipt is from the current month
  const isReceiptFromCurrentMonth = (receiptDate) => {
    const currentMonth = moment().month() + 1 // 0-based index, so add 1
    const receiptMonth = moment(receiptDate).month() + 1
    return currentMonth === receiptMonth && moment(receiptDate).year() === moment().year()
  }

  // Function to get the label for each student's particular (New Admission or Installment)
  const getParticularsLabel = (studentId) => {
    const studentReceipts = dataReciepts.filter((reciept) => reciept.studentInfo._id === studentId)

    // Check if there's only one receipt and it's from the current month
    if (studentReceipts.length === 1 && isReceiptFromCurrentMonth(studentReceipts[0].amountDate)) {
      return 'New Admission'
    }
    return 'Installment'
  }

  return (
    <div className={`card`}>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>{singleComapnyData?.companyName}</span>
          <span className='card-label fw-bold fs-3 mb-1'>Receipt {recieptCount}</span>
        </h3>
        <div className='search-bar'>
          <input
            type='text'
            className='form-control'
            placeholder='Search by Name or Course'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className='card-body py-3'>
        <div className='table-responsive'>
          <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
            <thead>
              <tr className='fw-bold text-muted'>
                <th className='min-w-120px'>No.</th>
                <th className='min-w-120px'>Receipt No.</th>
                <th className='min-w-150px'>Name</th>
                <th className='min-w-140px'>Particulars</th>
                <th className='min-w-130px'>Date</th>
                <th className='min-w-120px'>Amount</th>
                <th className='min-w-120px text-end'>Status</th>
                <th className='min-w-100px text-end'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDataReciepts?.length > 0 ? (
                filteredDataReciepts?.map((reciept, index) => {
                  const status = getReceiptStatus(reciept._id)
                  return (
                    <tr key={reciept._id}>
                      <td>
                        <div
                          style={{cursor: 'pointer'}}
                          className='text-dark fw-bold text-hover-primary d-block fs-6'
                        >
                          {index + 1}
                        </div>
                      </td>
                      <td>
                        <div
                          style={{cursor: 'pointer'}}
                          className='text-dark fw-bold text-hover-primary d-block fs-6'
                          onClick={() => navigate(`/profile/student/${reciept?.studentInfo?._id}`)}
                        >
                          {reciept?.reciptNumber}
                        </div>
                      </td>
                      <td>
                        <div className='d-flex align-items-center'>
                          <div className='d-flex justify-content-start flex-column'>
                            <div
                              style={{cursor: 'pointer'}}
                              className='text-dark fw-bold text-hover-primary fs-6'
                              onClick={() =>
                                navigate(`/profile/student/${reciept?.studentInfo?._id}`)
                              }
                            >
                              {reciept?.studentInfo?.name}
                            </div>
                            <span className='text-muted fw-semibold text-muted d-block fs-7'>
                              {reciept?.courseName?.courseName}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className='text-end'>
                        <div className='d-flex flex-column w-100 me-2'>
                          <div style={{cursor: 'pointer'}} className='d-flex flex-stack mb-2'>
                            <span className=' me-2 fs-6 fw-semibold'>
                              {getParticularsLabel(reciept?.studentInfo?._id)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div
                          style={{cursor: 'pointer'}}
                          className='text-dark fw-bold text-hover-primary d-block fs-6'
                        >
                          {moment(reciept?.amountDate).format('DD-MM-YYYY')}
                        </div>
                      </td>
                      <td className='text-end'>
                        <div className='d-flex flex-column w-100 me-2'>
                          <div style={{cursor: 'pointer'}} className='d-flex flex-stack mb-2'>
                            <span className=' me-2 fs-6 fw-semibold'>{reciept?.amountPaid}</span>
                          </div>
                        </div>
                      </td>
                      <td className='text-end'>
                        <span
                          className={`badge ${
                            status === 'Approved' ? 'badge-light-success' : 'badge-light-danger'
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className='text-end'>
                        <div className='d-flex justify-content-end flex-shrink-0'>
                          <button
                            className='btn btn-icon btn-bg-light btn-active-color-success btn-sm me-1'
                            onClick={() =>
                              handleStatusChange(reciept._id, reciept.studentInfo._id, 'Approved')
                            }
                          >
                            <KTIcon iconName='check' className='fs-2' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan='8'>No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default PaymentApproval
