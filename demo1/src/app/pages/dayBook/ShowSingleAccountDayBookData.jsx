import {useNavigate, useParams} from 'react-router-dom'
import {KTIcon, toAbsoluteUrl} from '../../../_metronic/helpers'
import {usePaymentOptionContextContext} from '../payment_option/PaymentOption.Context'
import moment from 'moment'
import {toast} from 'react-toastify'

const ShowSingleAccountDayBookData = () => {
  const dayBookAccountCtx = usePaymentOptionContextContext()
  const navigate = useNavigate()
  const {id} = useParams()
  const {data, isLoading} = dayBookAccountCtx.useGetSingleDayBookAccountNameDataQuery(id)
  // console.log('data from single day book account ', data, isLoading)
  let debitAmount = 0
  let creditAmount = 0
  if (data?.length === 0) {
    toast('You did not added data to this account. please add then check', {
      type: 'error',
      bodyStyle: {
        fontSize: '18px',
      },
    })
    navigate('/daybook/viewDaybook')
  }
  return (
    <div className={`card`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Day Book Single Account Details</span>
          <span className='text-muted mt-1 fw-semibold fs-7'></span>
        </h3>
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
                <th className='w-25px'>
                  <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
                </th>
                <th className='min-w-50px'>SR.NO</th>
                <th className='min-w-50px'>Created At</th>
                <th className='min-w-80px'>Account Name</th>
                <th className='min-w-200px'>Naretion</th>
                <th className='min-w-50px'>Credit</th>
                <th className='min-w-50px'>Debit</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {isLoading ? (
                <tr>
                  <td className='text-center' colSpan={5}>
                    <h1 className=' fw-semibold'>Loading....</h1>
                  </td>
                </tr>
              ) : (
                <>
                  {data?.map((dayBookAccountData, index) => {
                    debitAmount = debitAmount + dayBookAccountData?.debit
                    creditAmount = creditAmount + dayBookAccountData?.credit
                    return (
                      <tr>
                        <td>
                          <div className='form-check form-check-sm form-check-custom form-check-solid'>
                            {/* <input className='form-check-input widget-9-check' type='checkbox' value='1' /> */}
                          </div>
                        </td>
                        <td className='fw-bold'>{index + 1}</td>
                        <td>
                          <a href='#' className='text-dark fw-bold text-hover-primary d-block fs-6'>
                            {moment(dayBookAccountData?.dayBookDatadate).format('DD-MM-YYYY')}
                          </a>
                        </td>
                        <td>
                          <a href='#' className='text-dark fw-bold text-hover-primary d-block fs-6'>
                            {dayBookAccountData?.accountName}
                          </a>
                        </td>
                        <td>
                          <a href='#' className='text-dark fw-bold text-hover-primary d-block fs-6'>
                            {dayBookAccountData?.naretion}
                          </a>
                        </td>
                        <td>
                          <a href='#' className='text-dark fw-bold text-hover-primary d-block fs-6'>
                            {dayBookAccountData?.credit}
                          </a>
                        </td>
                        <td>
                          <a href='#' className='text-dark fw-bold text-hover-primary d-block fs-6'>
                            {dayBookAccountData?.debit}
                          </a>
                        </td>
                      </tr>
                    )
                  })}
                </>
              )}
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  <a href='#' className='text-dark fw-bold text-hover-primary d-block fs-6'>
                    {creditAmount}
                  </a>
                </td>
                <td>
                  <a href='#' className='text-dark fw-bold text-hover-primary d-block fs-6'>
                    {debitAmount}
                  </a>
                </td>
                <td>
                  <a href='#' className='text-dark fw-bold text-hover-primary d-block fs-6'>
                    {creditAmount - debitAmount}
                  </a>
                </td>
              </tr>
            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}
    </div>
  )
}
export default ShowSingleAccountDayBookData
