import {useEffect, useState} from 'react'
import {toAbsoluteUrl} from '../../../../_metronic/helpers'
import {useAttendanceContext} from '../AttendanceContext'
import {useLocation, useParams} from 'react-router-dom'

const BASE_URL_IMAGE = `${process.env.REACT_APP_BASE_URL}/api/images`

const EditTrainer = ({trainer, setOpenModal}) => {
  const location = useLocation()
  const [preview, setPreview] = useState('')
  const {useGetSingleTrainerDataById, updateTrainerDataMutation} = useAttendanceContext()
  const [imageFile, setImageFile] = useState(null)
  const {data} = useGetSingleTrainerDataById(trainer)
  const [trainerData, setTrainerData] = useState({})

  useEffect(() => {
    if (data?.trainer) {
      setTrainerData(data?.trainer)
      // Set initial preview to the already uploaded image
      setPreview(`${BASE_URL_IMAGE}/${data?.trainer?.trainerImage}`)
    }
  }, [data])

  //console.log('image files ', imageFile)

  useEffect(() => {
    if (imageFile) {
      setPreview(URL.createObjectURL(imageFile))
    } else if (trainerData?.trainerImage) {
      setPreview(`${BASE_URL_IMAGE}/${trainerData?.trainerImage}`)
    }
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [imageFile, trainerData])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setImageFile(file)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('traninerName', trainerData?.trainerName)
      formData.append('trainerEmail', trainerData?.trainerEmail)
      formData.append('trainerDesignation', trainerData?.trainerDesignation)
      formData.append('trainerImage', imageFile)
      formData.append('CompanyId', trainerData?.CompanyId)
      formData.append('id', trainer)
      //const trainerImage = imageFile ? imageFile : trainerData?.trainerImage
      await updateTrainerDataMutation.mutate(formData)
      setOpenModal(false)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const handleInputChange = (e) => {
    const {name, value} = e.target
    setTrainerData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  return (
    <form className='dynamic-form'>
      <div className='symbol symbol-100px symbol-lg-160px symbol-fixed position-relative d-flex justify-content-center'>
        <img src={preview || toAbsoluteUrl('/media/avatars/300-1.jpg')} alt='Trainer Image' />
      </div>
      <label className='col-lg-4 col-form-label required fw-bold fs-6'>Image</label>
      <input
        type='file'
        // disabled
        className='form-control form-control-lg form-control-solid'
        onChange={handleImageChange}
        placeholder='Image'
      />
      <label className='col-lg-4 col-form-label required fw-bold fs-6'>Trainer Name</label>
      <input
        type='text'
        name='trainerName'
        value={trainerData?.trainerName || ''}
        onChange={handleInputChange}
        className='form-control form-control-lg form-control-solid'
        placeholder='Trainer Name'
      />
      <label className='col-lg-4 col-form-label required fw-bold fs-6'>Trainer Email</label>
      <input
        type='email'
        name='trainerEmail'
        value={trainerData?.trainerEmail || ''}
        onChange={handleInputChange}
        className='form-control form-control-lg form-control-solid'
        placeholder='Trainer Email'
      />
      <label className='col-lg-4 col-form-label required fw-bold fs-6'>Trainer Designation</label>
      <input
        type='text'
        name='trainerDesignation'
        value={trainerData?.trainerDesignation || ''}
        onChange={handleInputChange}
        className='form-control form-control-lg form-control-solid'
        placeholder='Trainer Designation'
      />
      <div className='card-footer d-flex justify-content-end py-2'>
        <button
          type='button'
          className='btn btn-primary d-flex justify-content-end top-5'
          onClick={handleUpdate}
        >
          Update
        </button>
      </div>
    </form>
  )
}

export default EditTrainer
