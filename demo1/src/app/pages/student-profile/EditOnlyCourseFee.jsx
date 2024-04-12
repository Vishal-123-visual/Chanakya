import {useEffect, useState} from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'
import {usePaymentOptionContextContext} from '../payment_option/PaymentOption.Context'

const EditOnlyCourseFee = ({
  StudentFee,
  setStudentCourseFeesEditId,
  setEditStudentCourseFees,
  editStudentCourseFees,
}) => {
  useEffect(() => {
    setEditStudentCourseFees(StudentFee)
  }, [])

  const remainingFeesHandler = (e) => {
    setEditStudentCourseFees((prev) => {
      return {
        ...prev,
        amountPaid: Number(e.target.value),
        remainingFees: Number(prev.netCourseFees) - Number(e.target.value),
      }
    })
  }

  const paymentOptionCtx = usePaymentOptionContextContext()
  console.log(paymentOptionCtx.getPaymentOptionsData.data)

  return (
    <tr>
      <td>
        <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
      </td>
      <td></td>
      <td>
        <input
          type='text'
          className='form-control w-auto'
          onChange={(e) =>
            setEditStudentCourseFees({
              ...editStudentCourseFees,
              netCourseFees: Number(e.target.value),
            })
          }
          value={editStudentCourseFees.netCourseFees}
        />
      </td>
      <td>
        <input
          type='text'
          className='form-control w-auto'
          onChange={remainingFeesHandler}
          value={editStudentCourseFees.amountPaid}
        />
      </td>
      <td>
        <input
          className='form-control w-auto'
          type='text'
          value={editStudentCourseFees.remainingFees}
          readOnly
        />
      </td>
      <td>
        <DatePicker
          selected={moment(Date(StudentFee?.amountDate)).format('DD/MM/YYYY')}
          onChange={(date) =>
            setEditStudentCourseFees({...editStudentCourseFees, amountDate: date})
          }
          dateFormat='dd/MM/yyyy'
          className='form-control form-control-lg form-control-solid'
          placeholderText='DD/MM/YYYY'
        />
      </td>
      <td>
        <input
          type='text'
          readOnly
          value={editStudentCourseFees.reciptNumber}
          className='form-control w-auto'
        />
      </td>
      <td>
        <select
          className='form-select form-select-solid form-select-lg'
          value={editStudentCourseFees.paymentOption}
          onChange={(e) =>
            setEditStudentCourseFees({
              ...editStudentCourseFees,
              paymentOption: e.target.value,
            })
          }
        >
          <option value=''>select payment option</option>
          {/* <option value='cash'>Cash</option>
          <option value='google pay'>Google Pay</option>
          <option value='paytm'>Paytm</option>
          <option value='card'>Card</option>
          <option value='debit card'>Debit Card</option> */}

          {paymentOptionCtx.getPaymentOptionsData.data?.map((paymentOpt) => (
            <option key={paymentOpt._id} value={paymentOpt._id}>
              {paymentOpt.name}
            </option>
          ))}
        </select>
      </td>
      <td>
        <input
          type='text'
          className='form-control w-auto'
          value={editStudentCourseFees.lateFees}
          onChange={(e) =>
            setEditStudentCourseFees({
              ...editStudentCourseFees,
              lateFees: Number(e.target.value),
            })
          }
        />
      </td>
      <td>
        <div className='d-flex justify-content-end flex-shrink-0'>
          <button
            type='submit'
            className='btn btn-success btn btn-success btn-active-color-primary btn-sm me-1 px-5'
          >
            Edit
          </button>
          <button
            type='button'
            onClick={() => setStudentCourseFeesEditId(null)}
            className='btn btn-danger btn btn-success btn-active-color-primary btn-sm me-1 px-5'
          >
            cancel
          </button>
        </div>
      </td>
    </tr>
  )
}

export default EditOnlyCourseFee
