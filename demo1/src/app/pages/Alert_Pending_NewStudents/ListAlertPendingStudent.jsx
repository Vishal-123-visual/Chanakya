import moment from 'moment'
import {KTIcon} from '../../../_metronic/helpers'
import {useAdmissionContext} from '../../modules/auth/core/Addmission'
import {Dropdown1} from './DropDown1'

const ListAlertPendingStudent = () => {
  const studentCTX = useAdmissionContext()
  console.log(studentCTX.getAlertStudentPendingFeesQuery?.data)

  return (
    <div className={`card`}>
      {/* begin::Header */}
      <div className='card-header border-0'>
        <h3 className='card-title fw-bold text-dark'>Alert Student Pending Fees</h3>
        <div className='card-toolbar'>
          {/* begin::Menu */}
          {/* <button
            type='button'
            className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='top-end'
          >
            <KTIcon iconName='category' className='fs-2' />
          </button> */}
          {/* <Dropdown1 onSave={getStatus} /> */}
          {/* end::Menu */}
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body pt-2'>
        {/* begin::Item */}
        {studentCTX.getAlertStudentPendingFeesQuery?.data
          ?.filter((alertStudent) => alertStudent?.Status === 'pending')
          ?.map((studentAlertData) => {
            return (
              <div className='d-flex align-items-center mb-8' key={studentAlertData?._id}>
                <span className='bullet bullet-vertical h-40px bg-danger'></span>
                <div className='form-check form-check-custom form-check-solid mx-5'></div>
                <div className='flex-grow-1'>
                  <a className='text-gray-800 text-hover-primary fw-bold fs-6'>
                    {studentAlertData?.particulars}
                  </a>
                  <span className='text-muted fw-semibold d-block'>
                    Due in {moment(studentAlertData?.RemainderDateAndTime).date() - moment().date()}{' '}
                    Days
                  </span>
                </div>
                <span className='badge badge-light-danger fs-8 fw-bold'>
                  {studentAlertData?.Status}
                </span>
              </div>
            )
          })}

        {/* end:Item */}
      </div>
      {/* end::Body */}
    </div>
  )
}
export default ListAlertPendingStudent
