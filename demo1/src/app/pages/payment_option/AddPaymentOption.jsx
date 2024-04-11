/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState} from 'react'
import {KTIcon, toAbsoluteUrl} from '../../../_metronic/helpers'
import moment from 'moment'
import PaymentOptionForm from './PaymentOptionForm'
import {usePaymentOptionContextContext} from './PaymentOption.Context'

const AddPaymentOption = ({}) => {
  const paymentOptionCtx = usePaymentOptionContextContext()

  console.log(paymentOptionCtx.getPaymentOptionsData.data)

  const [paymentOptions, setPaymentOptions] = useState([
    {
      id: 1,
      name: 'Google Pay',
      createdBy: 'Arvind K',
      date: Date.now(),
    },
    {
      id: 2,
      name: 'Payment UPI',
      createdBy: 'Arvind K',
      date: Date.now(),
    },
    {
      id: 3,
      name: 'Paytm',
      createdBy: 'Arvind K',
      date: Date.now(),
    },
    {
      id: 4,
      name: 'Card',
      createdBy: 'Arvind K',
      date: Date.now(),
    },
    {
      id: 5,
      name: 'Cash',
      createdBy: 'Arvind K',
      date: Date.now(),
    },
  ])

  const [paymentOptionForm, setPaymentOptionForm] = useState(false)

  const [addPaymentOption, setAddPaymentOption] = useState({
    name: 'Google Pay',
    date: Date.now(),
  })

  const paymentOptionformToggleHandler = () => {
    setPaymentOptionForm((prev) => !prev)
  }

  const addPaymentOptionSubmitHandler = (e) => {
    e.preventDefault()
    paymentOptionCtx.createNewPaymentOptionMutation.mutate(addPaymentOption)
    setPaymentOptionForm(false)
  }

  return (
    <div className={`card `}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Payment Options</span>
          <span className='text-muted mt-1 fw-semibold fs-7'></span>
        </h3>
        <div
          className='card-toolbar'
          data-bs-toggle='tooltip'
          data-bs-placement='top'
          data-bs-trigger='hover'
          title='Click to add a payment that you want'
        >
          <button onClick={paymentOptionformToggleHandler} className='btn btn-sm btn-light-primary'>
            <KTIcon iconName='plus' className='fs-3' />
            New Payment
          </button>
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <form onSubmit={addPaymentOptionSubmitHandler}>
            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
              {/* begin::Table head */}
              <thead>
                <tr className='fw-bold text-muted'>
                  <th className='w-25px'>
                    <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
                  </th>
                  <th className='min-w-150px'>Sr.No</th>
                  <th className='min-w-140px'>Payment Name</th>
                  <th className='min-w-120px'>Created By </th>
                  <th className='min-w-120px'>Date </th>
                  <th className='min-w-100px text-end'>Actions</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody>
                {paymentOptionForm && (
                  <PaymentOptionForm
                    addPaymentOption={addPaymentOption}
                    setAddPaymentOption={setAddPaymentOption}
                    setPaymentOptionForm={setPaymentOptionForm}
                  />
                )}
                {paymentOptionCtx.getPaymentOptionsData.data &&
                  paymentOptionCtx.getPaymentOptionsData.data.map((paymentOption, index) => (
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
                            type='button'
                            className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                          >
                            <KTIcon iconName='pencil' className='fs-3' />
                          </button>
                          <button
                            type='button'
                            className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
                          >
                            <KTIcon iconName='trash' className='fs-3' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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

export default AddPaymentOption
