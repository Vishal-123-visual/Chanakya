import moment from 'moment'
import {KTIcon, toAbsoluteUrl} from '../../../_metronic/helpers'

const ReadPaymentOptionOnly = ({
  paymentOption,
  index,
  deletePaymentOptionHandler,
  handleEditPaymentOption,
}) => {
  return (
    <tr key={paymentOption._id}>
      <td>
        <div className='form-check form-check-sm form-check-custom form-check-solid'>
          {/* <input className='form-check-input widget-9-check' type='checkbox' value='1' /> */}
        </div>
      </td>
      <td>{index + 1}</td>
      <td>{paymentOption.name}</td>
      <td>{paymentOption.createdBy}</td>
      <td>{moment(paymentOption.date).format('DD/MM/YYYY')}</td>

      <td>
        <div className='d-flex justify-content-end flex-shrink-0'>
          <button
            onClick={() => handleEditPaymentOption(paymentOption._id, paymentOption)}
            type='button'
            className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
          >
            <KTIcon iconName='pencil' className='fs-3' />
          </button>
          <button
            onClick={(e) => deletePaymentOptionHandler(e, paymentOption._id)}
            type='button'
            className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
          >
            <KTIcon iconName='trash' className='fs-3' />
          </button>
        </div>
      </td>
    </tr>
  )
}
export default ReadPaymentOptionOnly
