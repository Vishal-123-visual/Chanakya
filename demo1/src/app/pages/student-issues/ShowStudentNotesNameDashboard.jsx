import {Fragment} from 'react'
import {KTIcon} from '../../../_metronic/helpers'
import {useAdmissionContext} from '../../modules/auth/core/Addmission'
import {useNavigate} from 'react-router-dom'

const ShowStudentNotesNameDashboard = ({className}) => {
  const context = useAdmissionContext()
  // console.log(context.studentsLists.data.users)
  const navigate = useNavigate()
  return (
    <>
      <div style={{overflowY: 'scroll'}} className={`card card-flush ${className}`}>
        <div className='card-body pt-5'>
          {context.studentsLists?.data?.users
            ?.filter((s) => s?.showNotesDashBoard === true)
            ?.map((row, index) => (
              <Fragment key={`lw26-rows-${index}`}>
                <div className='d-flex flex-stack'>
                  <a className='text-primary fw-semibold fs-6 me-2'>{row?.name}</a>
                  <button
                    onClick={() => navigate(`/profile/student/${row._id}`)}
                    type='button'
                    className='btn btn-icon btn-sm h-auto btn-color-gray-400 btn-active-color-primary justify-content-end'
                  >
                    <KTIcon iconName='exit-right-corner' className='fs-2' />
                  </button>
                </div>
                {/* <div className='separator separator-dashed my-3' /> */}
                {context.studentsLists?.data?.users?.filter((s) => s?.showNotesDashBoard === true)
                  ?.length -
                  1 >
                  index && <div className='separator separator-dashed my-3' />}
              </Fragment>
            ))}
        </div>
      </div>
    </>
  )
}
export default ShowStudentNotesNameDashboard
