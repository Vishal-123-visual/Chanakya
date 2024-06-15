import React, {useState, useEffect} from 'react'
import {KTIcon} from '../../../_metronic/helpers'
import {useStudentCourseFeesContext} from '../courseFees/StudentCourseFeesContext'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import AddDayBookData from './AddDayBookData'
import {usePaymentOptionContextContext} from '../payment_option/PaymentOption.Context'

const ViewDayBook = () => {
  const [fromDate, setFromDate] = useState(moment().subtract(6, 'days').toDate())
  const [toDate, setToDate] = useState(new Date())

  const dayBookDataCtx = usePaymentOptionContextContext()
  // console.log(dayBookDataCtx.getDayBookDataQuery?.data)

  const filteredData =
    dayBookDataCtx.getDayBookDataQuery?.data?.filter((item) => {
      const createdAt = moment(item.dayBookDatadate)
      const startDate = moment(fromDate).startOf('day')
      const endDate = moment(toDate).endOf('day')
      return createdAt.isBetween(startDate, endDate, null, '[]')
    }) || []

  //console.log(moment())

  return (
    <div className={`card`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Day Book</span>
          <span className=' mt-1 fw-semibold fs-7'>Fees and Expense, Income</span>
        </h3>
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
        {/* <div className='card-toolbar'>
          <a href='#' className='btn btn-sm btn-light-primary' title='Click to add a user'>
            <KTIcon iconName='plus' className='fs-3' />
            New Member
          </a>
        </div> */}
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
                <th className='min-w-120px'>Roll No</th>
                <th className='min-w-120px'>Particulars</th>
                <th className='min-w-120px'>Naretion</th>

                <th className='min-w-120px'>Credit</th>
                <th className='min-w-120px'>Debit</th>
                <th className='min-w-120px'>late Fees</th>
                <th className='min-w-100px text-center'>Balance</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              <AddDayBookData totalBalance={filteredData[0]?.balance} />

              {/* <tr className=''>
                <td className='bg-secondary text-center p-4' colspan='9'>
                  <h2>Student Fees Data Start here</h2>
                </td>
              </tr> */}

              {/* Day Book Data */}
              {filteredData.map((dayBookEntry, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
                    </td>
                    <td>
                      <a href='#' className='text-dark fw-bold text-hover-primary fs-6'>
                        {index + 1}
                      </a>
                    </td>
                    <td>
                      <a href='#' className='text-dark fw-bold text-hover-primary fs-6'>
                        {moment(dayBookEntry.dayBookDatadate).format('DD-MM-YYYY')}
                      </a>
                    </td>
                    <td>
                      <a href='#' className='text-dark fw-bold text-hover-primary fs-6'>
                        {dayBookEntry.rollNo}
                      </a>
                    </td>
                    <td className='text-center'>
                      <a href='#' className='text-dark fw-bold text-hover-primary fs-6'>
                        {dayBookEntry.accountName || dayBookEntry.StudentName}
                      </a>
                    </td>
                    <td className='text-center'>
                      <a href='#' className='text-dark fw-bold text-hover-primary fs-6'>
                        {dayBookEntry.naretion || '--'}
                      </a>
                    </td>
                    <td className='text-center'>
                      <a href='#' className='text-dark fw-bold text-hover-primary fs-6'>
                        {dayBookEntry.credit}
                      </a>
                    </td>
                    <td className='text-center'>
                      <a href='#' className='text-dark fw-bold text-hover-primary fs-6'>
                        {dayBookEntry.debit}
                      </a>
                    </td>

                    <td className='text-center'>
                      <a href='#' className='text-dark fw-bold text-hover-primary fs-6'>
                        {dayBookEntry?.studentLateFees || 0}
                      </a>
                    </td>
                    <td className='text-center'>
                      <a href='#' className='text-dark fw-bold text-hover-primary fs-6'>
                        {dayBookEntry.balance}
                      </a>
                    </td>
                  </tr>
                )
              })}

              {/* <tr className=''>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td className='text-center'>
                  <h4>{debitDayBookAmount}</h4>
                </td>
                <td className='text-center'>
                  <h4>{creditDayBookAmount}</h4>
                </td>
                <td className='text-center'>
                  <h4>{lateFineStudent}</h4>
                </td>
                <td className='text-center'>
                  <h4>{balance}</h4>
                </td>
              </tr> */}
            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* end::Body */}
    </div>
  )
}

export default ViewDayBook
