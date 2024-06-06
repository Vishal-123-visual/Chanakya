import {useState} from 'react'
import {KTIcon, toAbsoluteUrl} from '../../../_metronic/helpers'
import {useStudentCourseFeesContext} from '../courseFees/StudentCourseFeesContext'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const ViewDayBook = () => {
  const [fromDate, setFromDate] = useState()
  const [toDate, setToDate] = useState()
  // console.log(fromDate)

  const studentCourseFessCtx = useStudentCourseFeesContext()
  const totalFeesAmount = studentCourseFessCtx.getAllStudentsCourseFees?.data.reduce(
    (acc, cur) => acc + cur.amountPaid + cur.lateFees,
    0
  )
  let balance = 0

  return (
    <div className={`card`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Day Book</span>
          <span className=' mt-1 fw-semibold fs-7'>fees and Expense, Income</span>
        </h3>
        <div
          className='card-toolbar'
          data-bs-toggle='tooltip'
          data-bs-placement='top'
          data-bs-trigger='hover'
          title='Click to add a user'
        >
          <div className='d-flex gap-5'>
            <label className='col-6 col-form-label fw-bold fs-6 flex-4'>
              From
              <div className='fv-row'>
                <DatePicker
                  selected={fromDate}
                  onChange={(date) => setFromDate(date)}
                  dateFormat='dd/MM/yyyy'
                  className='form-control form-control-lg form-control-solid'
                  placeholderText='DD/MM/YYYY'
                />
              </div>
            </label>
            <label className='col-6 col-form-label fw-bold fs-6 flex-4'>
              To
              <div className='fv-row'>
                <DatePicker
                  selected={toDate}
                  onChange={(date) => setToDate(date)}
                  dateFormat='dd/MM/yyyy'
                  className='form-control form-control-lg form-control-solid'
                  placeholderText='DD/MM/YYYY'
                />
              </div>
            </label>
          </div>
        </div>
        <div
          className='card-toolbar'
          data-bs-toggle='tooltip'
          data-bs-placement='top'
          data-bs-trigger='hover'
          title='Click to add a user'
        >
          <a
            href='#'
            className='btn btn-sm btn-light-primary'
            // data-bs-toggle='modal'
            // data-bs-target='#kt_modal_invite_friends'
          >
            <KTIcon iconName='plus' className='fs-3' />
            New Member
          </a>
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
            {/* begin::Table head */}
            <thead>
              <tr className='fw-bold'>
                <th className='w-25px'></th>
                <th className='min-w-150px'>ID</th>
                <th className='min-w-140px'>Date</th>
                <th className='min-w-120px'>RollNo</th>
                <th className='min-w-120px'>Particulars</th>
                <th className='min-w-120px'>R.NO</th>
                <th className='min-w-120px'>Debit</th>
                <th className='min-w-120px'>Credit</th>
                <th className='min-w-120px'>LateFees</th>
                <th className='min-w-100px text-center'>Balance</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}

            {studentCourseFessCtx.getAllStudentsCourseFees.isLoading ? (
              <tbody>
                <tr className=''>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    <h1>Loading...</h1>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {studentCourseFessCtx.getAllStudentsCourseFees.data
                  .filter((filterOne) => {
                    return (
                      moment(filterOne.createdAt).format('DD-MM-YYYY') ===
                        moment(new Date()).format('DD-MM-YYYY') ||
                      (moment(filterOne.createdAt).format('DD-MM-YYYY') ===
                        moment(fromDate).format('DD-MM-YYYY') &&
                        moment(filterOne.createdAt).format('DD-MM-YYYY') ===
                          moment(toDate).format('DD-MM-YYYY'))
                    )
                  })
                  .map((studentFeesData, index) => {
                    balance += studentFeesData.amountPaid + studentFeesData.lateFees
                    return (
                      <tr>
                        <td>
                          <div className='form-check form-check-sm form-check-custom form-check-solid'>
                            {/* <input className='form-check-input widget-9-check' type='checkbox' value='1' /> */}
                          </div>
                        </td>
                        <td>
                          <a href='#' className='text-dark fw-bold text-hover-primary fs-6'>
                            {index + 1}
                          </a>
                        </td>
                        <td>
                          <a href='#' className='text-dark fw-bold text-hover-primary fs-6'>
                            {moment(studentFeesData.createdAt).format('DD-MM-YYYY')}
                          </a>
                        </td>
                        <td>
                          <a href='#' className='text-dark fw-bold text-hover-primary fs-6'>
                            {studentFeesData.studentInfo.rollNumber}
                          </a>
                        </td>
                        <td>
                          <a href='#' className='text-dark fw-bold text-hover-primary fs-6'>
                            {studentFeesData.studentInfo.name}
                          </a>
                        </td>
                        <td>
                          <a href='#' className='text-dark fw-bold text-hover-primary fs-6'>
                            {studentFeesData.reciptNumber}
                          </a>
                        </td>
                        <td>
                          <a href='#' className='text-dark fw-bold text-hover-primary fs-6'>
                            0
                          </a>
                        </td>
                        <td>
                          <a href='#' className='text-dark fw-bold text-hover-primary fs-6'>
                            {studentFeesData.amountPaid}
                          </a>
                        </td>
                        <td>
                          <a href='#' className='text-dark fw-bold text-hover-primary fs-6'>
                            {studentFeesData.lateFees}
                          </a>
                        </td>
                        <td className='text-center'>
                          <a href='#' className='text-dark fw-bold text-hover-primary fs-6'>
                            {balance}
                          </a>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            )}
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}
    </div>
  )
}
export default ViewDayBook
