import moment from 'moment'
import {KTIcon, toAbsoluteUrl} from '../../../_metronic/helpers'
import {useAuth} from '../../modules/auth/core/Auth'
const ReadOnlyCourseFee = ({
  StudentFee,
  index,
  setStudentCourseFeesEditId,
  delelteStudentCourseFeesHandler,
}) => {
  //console.log(StudentFee)
  const {auth} = useAuth()

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
      <td>{StudentFee?.paymentOption}</td>
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
