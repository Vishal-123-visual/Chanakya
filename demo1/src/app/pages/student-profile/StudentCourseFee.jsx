import React, {useEffect, useState} from 'react'
import {KTIcon, toAbsoluteUrl} from '../../../_metronic/helpers'
import moment from 'moment'
import PayStudentFee from './PayStudentFee'
import {useStudentCourseFeesContext} from '../courseFees/StudentCourseFeesContext'
import {useQuery} from 'react-query'
import axios from 'axios'
import {useAuth} from '../../modules/auth'
import {useNavigate} from 'react-router-dom'
import ReadOnlyCourseFee from './ReadOnlyCourseFee'
import EditOnlyCourseFee from './EditOnlyCourseFee'
const StudentCourseFee = ({className, studentInfoData}) => {
  //console.log(studentInfoData)
  const navigate = useNavigate()

  const [addStudentFeeFormToggle, setAddStudentFeeFormToggle] = useState(false)
  const [studentCourseFeeEditId, setStudentCourseFeesEditId] = useState(null)

  const [editStudentCourseFees, setEditStudentCourseFees] = useState({
    netCourseFees: 0,
    remainingFees: 0,
    amountPaid: '',
    amountDate: '',
    paymentOption: '',
    lateFees: '',
    reciptNumber: '',
  })

  const studentPayFeeCtx = useStudentCourseFeesContext()
  const result = studentPayFeeCtx.useSingleStudentCourseFees(studentInfoData?._id)
  console.log(result)

  const addStudentFeeFormToggleHandler = () => {
    setAddStudentFeeFormToggle((prev) => !prev)
  }

  const delelteStudentCourseFeesHandler = (id) => {
    studentPayFeeCtx.useDeleteSingleStudentCourseFees.mutate(id)
  }
  const [payStudentFeesAdd, setPayStudentFeesAdd] = useState()
  useEffect(() => {
    const initialAmountPaid = result.data?.length > 0 ? '' : Number(studentInfoData?.down_payment)

    setPayStudentFeesAdd({
      netCourseFees: studentInfoData.netCourseFees,
      remainingFees: studentInfoData.remainingCourseFees,
      amountPaid: initialAmountPaid,
      amountDate: Date.now(),
      paymentOption: '',
      lateFees: 0,
    })
  }, [result.data, studentInfoData])

  // console.log(result?.data[result?.data?.length - 1])

  //console.log(payStudentFeesAdd)

  const payStudentFeesAddHandler = (e) => {
    e.preventDefault()
    try {
      studentPayFeeCtx.createStudentCourseFeesMutation.mutate({
        ...payStudentFeesAdd,
        studentInfo: studentInfoData?._id,
      })
      setPayStudentFeesAdd({
        netCourseFees: 0,
        remainingFees: 0,
        amountPaid: 0,
        amountDate: Date.now(),
        paymentOption: '',
        lateFees: 0,
      })
      navigate(`/students`)
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }

  const editStudentCourseFessHandler = (e) => {
    e.preventDefault()
    studentPayFeeCtx.updateStudentSingleCourseFeesMutation.mutate(editStudentCourseFees)
  }

  // console.log(payStudentFeesAdd)

  // console.log(listOfFeesData)
  return (
    <div className={`card`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <div
          className='card-toolbar'
          data-bs-toggle='tooltip'
          data-bs-placement='top'
          data-bs-trigger='hover'
          title='Click to pay fees'
        >
          <button
            disabled={studentInfoData?.remainingCourseFees === 0}
            onClick={addStudentFeeFormToggleHandler}
            className='btn btn-sm btn-light-primary'
          >
            <KTIcon iconName='plus' className='fs-3' />
            {studentInfoData?.remainingCourseFees === 0 ? 'Student paid all fees' : 'Pay Fees'}
          </button>
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <form
            onSubmit={
              studentCourseFeeEditId ? editStudentCourseFessHandler : payStudentFeesAddHandler
            }
          >
            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
              {/* begin::Table head */}
              <thead>
                <tr className='fw-bold text-muted'>
                  <th className='w-25px'>
                    <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
                  </th>
                  <th className='min-w-150px'>Sr No</th>
                  <th className='min-w-150px'>Net Course Fees</th>
                  <th className='min-w-150px'>Amount Paid</th>
                  <th className='min-w-150px'>Remaining</th>
                  <th className='min-w-140px'>Date</th>
                  <th className='min-w-120px'>Recipt No</th>
                  <th className='min-w-120px'>Payment Options</th>
                  <th className='min-w-120px'>Late Fee</th>
                  <th className='min-w-100px text-end'>Actions</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}

              <tbody>
                {addStudentFeeFormToggle && (
                  <PayStudentFee
                    payStudentFeesAdd={payStudentFeesAdd}
                    setPayStudentFeesAdd={setPayStudentFeesAdd}
                    studentInfoData={studentInfoData}
                    setAddStudentFeeFormToggle={setAddStudentFeeFormToggle}
                  />
                )}
                {result.data?.length > 0 ? (
                  result.data?.map((StudentFee, index) => (
                    <React.Fragment key={index}>
                      {StudentFee._id === studentCourseFeeEditId ? (
                        <EditOnlyCourseFee
                          StudentFee={StudentFee}
                          setEditStudentCourseFees={setEditStudentCourseFees}
                          setStudentCourseFeesEditId={setStudentCourseFeesEditId}
                          editStudentCourseFees={editStudentCourseFees}
                        />
                      ) : (
                        <ReadOnlyCourseFee
                          StudentFee={StudentFee}
                          index={index}
                          delelteStudentCourseFeesHandler={delelteStudentCourseFeesHandler}
                          setStudentCourseFeesEditId={setStudentCourseFeesEditId}
                        />
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <></>
                )}
              </tbody>
              {/* end::Table body */}
            </table>
          </form>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}
    </div>
  )
}
export default StudentCourseFee
