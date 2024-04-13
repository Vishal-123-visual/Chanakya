import {useEffect, Fragment} from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {usePaymentOptionContextContext} from '../payment_option/PaymentOption.Context'

const PayStudentFee = ({payStudentFeesAdd, setPayStudentFeesAdd, setAddStudentFeeFormToggle}) => {
  //console.log(payStudentFeesAdd)
  const remainingFeesHandler = (e) => {
    setPayStudentFeesAdd((prev) => {
      return {
        ...prev,
        amountPaid: Number(e.target.value),
        remainingFees: Number(prev.netCourseFees) - Number(e.target.value),
      }
    })

    //console.log(payStudentFeesAdd)
  }

  const paymentOptionCtx = usePaymentOptionContextContext()
  //console.log(paymentOptionCtx.getPaymentOptionsData.data[4])

  return (
    <tr>
      <td>
        <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
      </td>
      <td></td>
      <td>
        <input
          type='text'
          className='form-control w-auto '
          onChange={(e) =>
            setPayStudentFeesAdd({...payStudentFeesAdd, netCourseFees: Number(e.target.value)})
          }
          value={payStudentFeesAdd.netCourseFees}
        />
      </td>
      <td>
        <input
          type='text'
          className='form-control w-auto '
          onChange={remainingFeesHandler}
          value={payStudentFeesAdd.amountPaid}
        />
      </td>
      <td>
        <input
          className='form-control w-auto '
          type='text'
          value={payStudentFeesAdd.remainingFees}
          readOnly
        />
      </td>
      <td>
        <DatePicker
          selected={payStudentFeesAdd.amountDate}
          onChange={(date) => setPayStudentFeesAdd({...payStudentFeesAdd, amountDate: date})}
          dateFormat='dd/MM/yyyy'
          className='form-control form-control-lg form-control-solid'
          placeholderText='DD/MM/YYYY'
        />
      </td>
      {/* <td>
        <input
          type='text'
          readOnly
          value={payStudentFeesAdd.reciptNumber}
          className='form-control w-auto '
        />
      </td> */}
      <td></td>
      <td>
        <select
          className='form-select form-select-solid form-select-lg'
          value={payStudentFeesAdd.paymentOption}
          onChange={(e) =>
            setPayStudentFeesAdd({...payStudentFeesAdd, paymentOption: e.target.value})
          }
        >
          {' '}
          <option>select payment option</option>
          {paymentOptionCtx.getPaymentOptionsData.data?.map((paymentOpt) => (
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
          className='form-control w-auto '
          value={payStudentFeesAdd.lateFees}
          onChange={(e) =>
            setPayStudentFeesAdd({...payStudentFeesAdd, lateFees: Number(e.target.value)})
          }
        />
      </td>
      <td>
        <div className='d-flex justify-content-end flex-shrink-0'>
          <button
            type='submit'
            className='btn btn-success btn btn-success btn-active-color-primary btn-sm me-1 px-5'
          >
            Pay
          </button>
          <button
            type='button'
            onClick={() => setAddStudentFeeFormToggle(false)}
            className='btn btn-danger btn btn-success btn-active-color-primary btn-sm me-1 px-5'
          >
            cancel
          </button>
        </div>
      </td>
    </tr>
  )
}
export default PayStudentFee
