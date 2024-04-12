import moment from 'moment'
import React from 'react'
import {KTIcon, toAbsoluteUrl} from '../../../_metronic/helpers'
import {useAuth} from '../../modules/auth/core/Auth'
import {usePaymentOptionContextContext} from '../payment_option/PaymentOption.Context'
const ReadOnlyCourseFee = ({
  StudentFee,
  index,
  setStudentCourseFeesEditId,
  delelteStudentCourseFeesHandler,
}) => {
  //console.log(StudentFee)
  const {auth} = useAuth()

  const paymentOptionCtx = usePaymentOptionContextContext()
  //console.log(paymentOptionCtx.getPaymentOptionsData.data)

  //onsole.log(StudentFee.paymentOption)

  return (
    <tr key={StudentFee._id}>
      <td>
        <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
      </td>
      <td>{index + 1}</td>
      <td>{StudentFee?.netCourseFees}</td>
      <td>{StudentFee?.amountPaid}</td>
      <td>{StudentFee?.remainingFees}</td>
      <td>{moment(Date(StudentFee?.amountDate)).format('DD/MM/YYYY')}</td>
      <td>{StudentFee?.reciptNumber}</td>

      <td>
        {paymentOptionCtx.getPaymentOptionsData.data?.map((paymentOpt) => (
          <React.Fragment key={paymentOpt._id}>
            {StudentFee.paymentOption === paymentOpt._id && paymentOpt.name}
          </React.Fragment>
        ))}
      </td>

      <td>{StudentFee?.lateFees}</td>

      <td>
        {auth.role === 'Admin' && (
          <div className='d-flex justify-content-end flex-shrink-0'>
            <button
              onClick={() => setStudentCourseFeesEditId(StudentFee?._id)}
              type='button'
              className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
            >
              <KTIcon iconName='pencil' className='fs-3' />
            </button>
            <button
              onClick={() => delelteStudentCourseFeesHandler(StudentFee?._id)}
              type='button'
              className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
            >
              <KTIcon iconName='trash' className='fs-3' />
            </button>
          </div>
        )}
      </td>
    </tr>
  )
}
export default ReadOnlyCourseFee
