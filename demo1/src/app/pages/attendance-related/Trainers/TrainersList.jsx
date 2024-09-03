import { useState } from 'react'
import { KTIcon, toAbsoluteUrl } from '../../../../_metronic/helpers'
import PopUpModal from '../../../modules/accounts/components/popUpModal/PopUpModal'
import TrainerFormField from './TrainerFormField'
import { useAttendanceContext } from '../AttendanceContext'
import { useCompanyContext } from '../../compay/CompanyContext'
import { useParams } from 'react-router-dom'

const BASE_URL_IMAGE = `${process.env.REACT_APP_BASE_URL}/api/images/default-image.jpg`

const TrainersList = () => {
  const [openModal, setOpenModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { getAllTrainersData, deleteTrainerDataMutation } = useAttendanceContext()
  const companyCTX = useCompanyContext()
  const params = useParams()
  const companyId = params?.id
  // Function to handle image URL
  const getTrainerImageUrl = (image) => {
    return image ? `${process.env.REACT_APP_BASE_URL}/api/images/${image}` : BASE_URL_IMAGE
  }

  const { data: companyInfo } = companyCTX?.useGetSingleCompanyData(companyId)

  // Function to filter trainers based on search term
  const filteredTrainers = getAllTrainersData?.data?.filter(trainer =>
    trainer?.trainerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer?.trainerDesignation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer?.trainerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const deleteHandler = (trainerId) => {
    deleteTrainerDataMutation.mutate(trainerId)
  }

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold fs-3 mb-1'>Trainers</span>
            <span className='card-label fw-bold fs-3 mb-1'>
              {/* Students {countStudentCompanyWise?.length} */}
            </span>
          </h3>
          <div className='search-bar'>
            <input
              type='text'
              className='form-control'
              placeholder='Search Trainer'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div
            className='card-toolbar'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-trigger='hover'
            title='Click to add a user'
          >
            <button
              className='btn btn-sm btn-light-primary'
              onClick={() => setOpenModal(true)}
            // data-bs-toggle='modal'
            // data-bs-target='#kt_modal_invite_friends'
            >
              <KTIcon iconName='plus' className='fs-3' />
              Add New Trainer
            </button>
          </div>
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
                <tr className='fw-bold text-muted'>
                  <th className='w-25px'></th>
                  <th className='min-w-150px'>Trainer's Name</th>
                  <th className='min-w-140px'>Trainer Designation</th>
                  <th className='min-w-140px'>Trainer Email</th>
                  <th className='min-w-120px'>Company</th>
                  <th className='min-w-100px text-end'>Actions</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody>
                {
                  filteredTrainers?.filter((company) => company.companyId === companyId).map((trainer) =>
                    <tr key={trainer._id}>
                      <td>
                        <div className='form-check form-check-sm form-check-custom form-check-solid'>
                          {/* <input className='form-check-input widget-9-check' type='checkbox' value='1' /> */}
                        </div>
                      </td>
                      <td>
                        <div className='d-flex align-items-center'>
                          <div className='symbol symbol-45px me-5'>
                            <img src={getTrainerImageUrl(trainer?.trainerImage)} alt='image' className='w-100' />
                          </div>
                          <div className='d-flex justify-content-start flex-column'>
                            <div
                              style={{ cursor: 'pointer' }}
                              className='text-dark fw-bold text-hover-primary fs-6'
                            >
                              {trainer?.trainerName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div
                          style={{ cursor: 'pointer' }}
                          className='text-dark fw-bold text-hover-primary d-block fs-6'
                        >
                          {trainer?.trainerDesignation}
                        </div>
                      </td>
                      <td>
                        <div
                          style={{ cursor: 'pointer' }}
                          className='text-dark fw-bold text-hover-primary d-block fs-6'
                        >
                          {trainer?.trainerEmail}
                        </div>
                      </td>
                      <td className='text-end'>
                        <div className='d-flex flex-column w-100 me-2'>
                          <div style={{ cursor: 'pointer' }} className='d-flex flex-stack mb-2'>
                            <span className='text-muted me-2 fs-7 fw-semibold'>{companyInfo?.companyName}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className='d-flex justify-content-end flex-shrink-0'>
                          <button className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'>
                            <KTIcon iconName='pencil' className='fs-3' />
                          </button>
                          <button onClick={deleteHandler(trainer?.id)} className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'>
                            <KTIcon iconName='trash' className='fs-3' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                }
                <tr>
                  <td></td>
                  <td></td>
                  {/* <td>
                  <h4 className='text-center'>
                    No Student Available ? <b>Create Student</b>
                  </h4>
              </td> */}
                  <td></td>
                  <td></td>
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
      <PopUpModal show={openModal} handleClose={() => setOpenModal(false)}>
        <TrainerFormField setOpenModal={setOpenModal} />
      </PopUpModal>
    </>
  )
}

export default TrainersList
