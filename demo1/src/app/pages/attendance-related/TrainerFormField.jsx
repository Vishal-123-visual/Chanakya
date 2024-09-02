import {useState} from 'react'
import {toAbsoluteUrl} from '../../../_metronic/helpers'
import {useAttendanceContext} from './AttendanceContext'

const TrainerFormField = ({setOpenModal}) => {
  const [formData, setFormData] = useState({
    trainerName: '',
    trainerEmail: '',
    trainerDesignation: '',
  })
  const [preview, setPreview] = useState('')

  const {createTrainerData} = useAttendanceContext()

  const handleInputChange = (e) => {
    const {name, value} = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  // console.log(handleInputChange)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setPreview((prevData) => ({
      ...prevData,
      image: file,
    }))
  }

  const handleSubmit = () => {
    createTrainerData.mutate({...formData})
    setOpenModal(false)
  }

  return (
    <form className='dynamic-form'>
      <div className='symbol symbol-100px symbol-lg-160px symbol-fixed position-relative d-flex justify-content-center'>
        <img src={toAbsoluteUrl('/media/avatars/300-1.jpg')} alt='Metronic' />
      </div>
      <label className='col-lg-4 col-form-label required fw-bold fs-6'>Image</label>
      <input
        type='file'
        className='form-control form-control-lg form-control-solid'
        onChange={handleImageChange}
        placeholder='Image'
      />
      <label className='col-lg-4 col-form-label required fw-bold fs-6'>Trainer Name</label>
      <input
        type='text'
        name='trainerName'
        value={formData.trainerName}
        onChange={handleInputChange}
        className='form-control form-control-lg form-control-solid'
        placeholder='Trainer Name'
      />
      <label className='col-lg-4 col-form-label required fw-bold fs-6'>Trainer Email</label>
      <input
        type='email'
        name='trainerEmail'
        value={formData.trainerEmail}
        onChange={handleInputChange}
        className='form-control form-control-lg form-control-solid'
        placeholder='Trainer Email'
      />
      <label className='col-lg-4 col-form-label required fw-bold fs-6'>Trainer Designation</label>
      <input
        type='text'
        name='trainerDesignation'
        value={formData.trainerDesignation}
        onChange={handleInputChange}
        className='form-control form-control-lg form-control-solid'
        placeholder='Trainer Designation'
      />
      <div className='card-footer d-flex justify-content-end py-2'>
        <button
          type='button'
          className='btn btn-primary d-flex justify-content-end top-5'
          onClick={handleSubmit}
        >
          Save
        </button>
      </div>
    </form>
  )
}

export default TrainerFormField
