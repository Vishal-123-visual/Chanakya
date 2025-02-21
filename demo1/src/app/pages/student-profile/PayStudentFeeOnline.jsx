import {Fragment, useEffect} from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {toast} from 'react-toastify'
import {usePaymentOptionContextContext} from '../payment_option/PaymentOption.Context'
import {useAuth} from '../../modules/auth'

const PayStudentFeeOnline = ({
  payStudentFeesAdd,
  setPayStudentFeesAdd,
  setAddOnlineStudentFeeFormToggle,
  studentInfoData,
}) => {
  const {currentUser} = useAuth()
  const paymentOptionCtx = usePaymentOptionContextContext()
  useEffect(() => {
    if (!payStudentFeesAdd.amountDate) {
      setPayStudentFeesAdd((prev) => ({...prev, amountDate: new Date()}))
    }
  }, [payStudentFeesAdd.amountDate, setPayStudentFeesAdd])

  useEffect(() => {
    if (!studentInfoData?.installment_duration) {
      toast.info('First add the installment due date of student !!')
    }
  }, [studentInfoData?.installment_duration])

  const remainingFeesHandler = (e) => {
    setPayStudentFeesAdd((prev) => ({
      ...prev,
      amountPaid: Number(e.target.value),
      remainingFees: (Number(prev.netCourseFees) - Number(e.target.value)).toFixed(2),
    }))
  }

  const handleDateChange = (date) => {
    setPayStudentFeesAdd((prevState) => ({
      ...prevState,
      amountDate: date,
    }))
  }

  return (
    <tr>
      <td></td>
      <td></td>
      <td>
        <input
          type='text'
          className='form-control min-w-150px'
          onChange={(e) =>
            setPayStudentFeesAdd({...payStudentFeesAdd, netCourseFees: Number(e.target.value)})
          }
          value={payStudentFeesAdd.netCourseFees}
          readOnly
        />
      </td>
      <td>
        <input
          type='number'
          placeholder='Enter Amount...'
          className='form-control min-w-150px'
          onChange={remainingFeesHandler}
          value={payStudentFeesAdd.amountPaid}
        />
        <input
          type='text'
          placeholder='Enter Narration...'
          onChange={(e) => setPayStudentFeesAdd({...payStudentFeesAdd, narration: e.target.value})}
          value={payStudentFeesAdd.narration}
          className='form-control min-w-150px'
        />
      </td>
      <td>
        <input
          className='form-control min-w-150px'
          type='text'
          value={payStudentFeesAdd.remainingFees}
          readOnly
        />
      </td>
      <td>
        <DatePicker
          selected={payStudentFeesAdd.amountDate}
          onChange={handleDateChange}
          dateFormat='dd/MM/yyyy'
          className='form-control form-control-lg form-control-solid min-w-150px'
          placeholderText='DD/MM/YYYY'
        />
      </td>
      <td className='min-w-0px'></td>
      <td>
        <select
          className='form-select form-select-solid form-select-lg min-w-150px'
          value={payStudentFeesAdd.paymentOption}
          onChange={(e) =>
            setPayStudentFeesAdd({...payStudentFeesAdd, paymentOption: e.target.value})
          }
        >
          <option>select payment option</option>
          {currentUser?.role === 'Student'
            ? paymentOptionCtx.getPaymentOptionsData.data
                ?.filter((pay) => pay.name !== 'Cash' && pay.name !== 'Cheque')
                .map((paymentOpt) => (
                  <Fragment key={paymentOpt._id}>
                    <option key={paymentOpt._id} value={paymentOpt._id}>
                      {paymentOpt.name}
                    </option>
                  </Fragment>
                ))
            : paymentOptionCtx.getPaymentOptionsData.data?.map((paymentOpt) => (
                <Fragment key={paymentOpt._id}>
                  <option key={paymentOpt._id} value={paymentOpt._id}>
                    {paymentOpt.name}
                  </option>
                </Fragment>
              ))}
        </select>
      </td>
      <td>
        <input
          type='text'
          className='form-control w-min-100px'
          value={payStudentFeesAdd.lateFees}
          onChange={(e) =>
            setPayStudentFeesAdd({...payStudentFeesAdd, lateFees: Number(e.target.value)})
          }
        />
      </td>
      <td>
        <div className='d-flex justify-content-end flex-shrink-0'>
          {!studentInfoData?.installment_duration ? null : ( // No toast here, handled in useEffect
            <button
              type='submit'
              className='btn btn-success btn-active-color-primary btn-sm me-1 px-5'
            >
              Pay
            </button>
          )}
          <button
            type='button'
            onClick={() => setAddOnlineStudentFeeFormToggle(false)}
            className='btn btn-danger btn-active-color-primary btn-sm me-1 px-5'
          >
            Cancel
          </button>
        </div>
      </td>
    </tr>
  )
}

export default PayStudentFeeOnline
