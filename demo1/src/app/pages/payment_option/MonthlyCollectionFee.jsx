import {Link, useNavigate, useParams} from 'react-router-dom'
import {useStudentCourseFeesContext} from '../courseFees/StudentCourseFeesContext'
import React, {useState} from 'react'
import moment from 'moment'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {useCompanyContext} from '../compay/CompanyContext'
import {useCourseContext} from '../course/CourseContext'

const MonthlyCollectionFee = () => {
  const [fromDate, setFromDate] = useState(new Date())
  const [toDate, setToDate] = useState(new Date())
  const [searchValue, setSearchValue] = useState('')
  const paramsData = useParams()
  const ctx = useStudentCourseFeesContext()
  const studentCourseCTX = useCourseContext()
  const {data, isLoading} = ctx.useGetStudentMonthlyCourseFeesCollection(paramsData?.id)

  // Fetch all courses data at once
  const {data: coursesData} = studentCourseCTX.getCourseLists // Assuming there's a hook to fetch all courses

  // Map course IDs to names for quick lookup
  const courseIdToName = coursesData?.reduce((acc, course) => {
    acc[course._id] = course.courseName
    return acc
  }, {})

  // Filter data based on installments
  const filteredData = data?.filter(
    (item) =>
      item?.studentInfo?.no_of_installments === item?.installment_number &&
      item.dropOutStudent === false
  )

  const companyCTX = useCompanyContext()
  const params = useParams()
  const {data: CompanyInfo} = companyCTX?.useGetSingleCompanyData(params?.id)

  const collectionFeesBalance = filteredData?.reduce((acc, cur) => acc + cur?.installment_amount, 0)
  //console.log(filteredData)
  const navigate = useNavigate()

  const calculateMonthDiff = (expireDate) => {
    const currentDate = moment() // Current date
    const expireDateObj = moment(expireDate) // Expiry date
    // Get the difference in total months
    let monthsDiff = currentDate.diff(expireDateObj, 'months', true) // 'true' for floating point number
    // Round down to get the full month difference
    monthsDiff = Math.floor(monthsDiff)
    return monthsDiff < 0 ? 0 : monthsDiff + 1
  }

  return (
    <div className={`card`}>
      {/* Header */}
      <div className='card-header border-0 pt-5 d-flex align-items-center'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>{CompanyInfo?.companyName}</span>
          <span className='card-label fw-bold fs-3 mb-1'>Students {filteredData?.length}</span>
          <p className=' mt-1 fw-semibold fs-7'>
            Total Collection Fees Rs :: {collectionFeesBalance?.toFixed(2)}
          </p>
        </h3>
        <div className=''>
          <input
            type='text'
            placeholder='search student'
            className='form-control'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
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

      {/* Body */}
      <div className='card-body py-3'>
        <div className='table-responsive'>
          <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
            <thead>
              <tr className='fw-bold fs-5'>
                <th className='w-25px'>
                  <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
                </th>
                <th className='min-w-150px'>Roll Number</th>
                <th className='min-w-140px'>Name</th>
                <th className='min-w-120px'>Course</th>
                <th className='min-w-120px'>Missing Month</th>
                <th className='min-w-100px text-end'>Contact</th>
                <th className='min-w-100px text-end'>Installments</th>
              </tr>
            </thead>
            <tbody>
              {filteredData?.length === 0 ? (
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    <h3>No Student Payment Installments available</h3>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              ) : (
                filteredData
                  ?.filter((dropStud) => dropStud.dropOutStudent === false)
                  ?.filter((searchStudent) => {
                    return (
                      searchValue?.trim() === '' ||
                      searchStudent?.studentInfo?.name
                        ?.toLowerCase()
                        ?.includes(searchValue.toLowerCase()) ||
                      searchStudent?.studentInfo?.rollNumber?.toString()?.includes(searchValue) ||
                      searchStudent?.courseName?.courseName
                        ?.toLowerCase()
                        ?.includes(searchValue.toLowerCase()) ||
                      searchStudent?.studentInfo?.mobile_number?.includes(searchValue)
                    )
                  })
                  ?.map((collectionFees) => (
                    <tr key={collectionFees?._id} className='fs-5 fw-bold'>
                      <td>
                        <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
                      </td>
                      <td>
                        <Link
                          to={`/profile/student/${collectionFees?.studentInfo?._id}`}
                          target='_blank'
                          className='btn btn-link'
                        >
                          {collectionFees?.studentInfo?.rollNumber}
                        </Link>
                      </td>
                      <td>{collectionFees?.studentInfo.name}</td>
                      <td>{courseIdToName[collectionFees?.studentInfo?.courseName]}</td>
                      <td
                        className={
                          calculateMonthDiff(
                            collectionFees?.studentInfo?.no_of_installments_expireTimeandAmount
                          ) > 0
                            ? 'text-danger text-decoration-underline'
                            : ''
                        }
                      >
                        {calculateMonthDiff(
                          collectionFees?.studentInfo?.no_of_installments_expireTimeandAmount
                        )}
                      </td>
                      <td>
                        <div className='d-flex justify-content-end flex-shrink-0'>
                          {collectionFees?.studentInfo?.mobile_number}
                        </div>
                      </td>
                      <td>
                        <div className='d-flex justify-content-end flex-shrink-0'>
                          {collectionFees?.installment_amount.toFixed(2)}
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default MonthlyCollectionFee
