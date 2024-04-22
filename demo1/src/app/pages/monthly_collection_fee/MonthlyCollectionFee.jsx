import {Link, useNavigate} from 'react-router-dom'
import {KTIcon, toAbsoluteUrl} from '../../../_metronic/helpers'
import {useStudentCourseFeesContext} from '../courseFees/StudentCourseFeesContext'
import React, {useState} from 'react'

const MonthlyCollectionFee = () => {
  const ctx = useStudentCourseFeesContext()
  const result = ctx.useGetStudentMonthlyCourseFeesCollection()
  //console.log(result.data)
  const [searchContentValues, setSearchContentValues] = useState({from: '', to: ''})
  const [filteredData, setFilteredData] = useState([])
  const [totalCollectionFees, setTotalCollectionFees] = useState(0)

  const searchContentValueHandler = (e) => {
    e.preventDefault()
    const filteredResults = result.data.filter((data) => {
      const createdAtMonth = new Date(data.expiration_date).getMonth() + 1
      return (
        createdAtMonth >= Number(searchContentValues.from) &&
        createdAtMonth <= Number(searchContentValues.to)
      )
    })

    //console.log(filteredResults)
    setFilteredData(filteredResults)
    calculateTotalCollectionFees(filteredResults)
  }

  const calculateTotalCollectionFees = (data) => {
    const totalFees = data.reduce((total, item) => total + item?.installment_amount, 0)
    setTotalCollectionFees(totalFees)
  }

  const navigate = useNavigate()

  const compareTimeInstallment = (t1) => {
    let resDate = new Date(t1).getTime()
    let currDate = new Date().getTime()

    //console.log(resDate, currDate)

    if (currDate > resDate) {
      return 'Month Skipped'
    } else {
      // console.log(
      //   Number(new Date(resDate).toString().split(' ')[2]),
      //   Number(new Date(currDate).toString().split(' ')[2])
      // )
      return '0 Month Skipped'
    }
  }

  // const compareTimeInstallment = (t1) => {
  //   let resDate = new Date(t1)
  //   let currDate = new Date()

  //   // Get the month of the expiration date
  //   let resMonth = resDate.getTime()

  //   // Get the month of the current date
  //   let currMonth = currDate.getTime()
  //   console.log(currMonth > resMonth)

  //   if (resMonth === currMonth) {
  //     return '0 Month Skipped'
  //   } else if (currMonth > resMonth) {
  //     return 'Month Skipped'
  //   } else {
  //     return 'No Month Skipped'
  //   }
  // }

  return (
    <div className={`card`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Monthly Collection</span>
          <p className=' mt-1 fw-semibold fs-7'>
            Total Collection Fees Rs :: {totalCollectionFees}
          </p>
        </h3>
        <div className='d-flex justify-content-center align-items-center gap-5 '>
          <label htmlFor='From'>
            From{' '}
            <select
              value={searchContentValues.from}
              onChange={(e) => setSearchContentValues((prev) => ({...prev, from: e.target.value}))}
              type='text'
              name='From'
              id='From'
              className='form-control w-auto'
            >
              <option value=''>select month</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
                <option key={month} value={month}>
                  {(() => {
                    switch (month) {
                      case 1:
                        return 'Jan'
                      case 2:
                        return 'Feb'
                      case 3:
                        return 'Mar'
                      case 4:
                        return 'Apr'
                      case 5:
                        return 'May'
                      case 6:
                        return 'Jun'
                      case 7:
                        return 'Jul'
                      case 8:
                        return 'Aug'
                      case 9:
                        return 'Sep'
                      case 10:
                        return 'Oct'
                      case 11:
                        return 'Nov'
                      case 12:
                        return 'Dec'
                      default:
                        return ''
                    }
                  })()}
                </option>
              ))}
            </select>
          </label>

          <label htmlFor='To'>
            To{' '}
            <select
              value={searchContentValues.to}
              onChange={(e) => setSearchContentValues((prev) => ({...prev, to: e.target.value}))}
              type='text'
              name='To'
              id='To'
              className='form-control w-auto'
            >
              <option value=''>select month</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
                <option key={month} value={month}>
                  {(() => {
                    switch (month) {
                      case 1:
                        return 'Jan'
                      case 2:
                        return 'Feb'
                      case 3:
                        return 'Mar'
                      case 4:
                        return 'Apr'
                      case 5:
                        return 'May'
                      case 6:
                        return 'Jun'
                      case 7:
                        return 'Jul'
                      case 8:
                        return 'Aug'
                      case 9:
                        return 'Sep'
                      case 10:
                        return 'Oct'
                      case 11:
                        return 'Nov'
                      case 12:
                        return 'Dec'
                      default:
                        return ''
                    }
                  })()}
                </option>
              ))}
            </select>
          </label>

          <button
            onClick={searchContentValueHandler}
            type='submit'
            className='btn btn-sm btn-light-primary'
          >
            Search
          </button>
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
              <tr className='fw-bold text-muted'>
                <th className='w-25px'>
                  <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
                </th>
                <th className='min-w-150px'>Roll Number</th>
                <th className='min-w-140px'>Name</th>
                <th className='min-w-120px'>Course</th>
                <th className='min-w-120px'>Time Avaiable</th>

                <th className='min-w-100px text-end'>Contact</th>
                <th className='min-w-100px text-end'>Installments</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    <h2>Loading.....</h2>
                  </td>
                  <td></td>
                  <td></td>
                </tr>
              ) : (
                filteredData?.map((data) => (
                  <React.Fragment key={data._id}>
                    {data.studentInfo !== null && (
                      <tr key={data._id}>
                        <td>
                          <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
                        </td>
                        <td>
                          <button
                            className='btn btn-link'
                            onClick={() =>
                              navigate(`/student/${data.studentInfo._id}`, {
                                state: data.studentInfo,
                              })
                            }
                          >
                            {}
                            {data?.studentInfo?.rollNumber}
                          </button>
                        </td>
                        <td>{data?.studentInfo?.name}</td>

                        <td>{data?.courseName?.courseName}</td>
                        <td>{data.studentInfo?.installmentPaymentSkipMonth} Month Skipped</td>
                        <td>
                          <div className='d-flex justify-content-end flex-shrink-0'>
                            {data?.studentInfo?.phone_number}
                          </div>
                        </td>
                        <td>
                          <div className='d-flex justify-content-end flex-shrink-0'>
                            {data?.installment_amount}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* end::Body */}
      <div></div>
    </div>
  )
}

export default MonthlyCollectionFee
