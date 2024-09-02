import { useState, useEffect } from 'react';
import { toAbsoluteUrl } from '../../../../_metronic/helpers';
import { useAttendanceContext } from '../AttendanceContext';
import { useLocation, useParams } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const BASE_URL_Image = `${BASE_URL}/api/images`;

const TrainerFormField = ({ setOpenModal }) => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    trainerName: '',
    trainerEmail: '',
    trainerDesignation: '',
  });
  const [preview, setPreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [updateUserId, setUpdateUserId] = useState(location.state);
  const params = useParams()
  const companyId = params?.id

  const { createTrainerData } = useAttendanceContext();

  useEffect(() => {
    if (imageFile) {
      setPreview(URL.createObjectURL(imageFile));
    } else {
      setPreview('');
    }
    // Clean up URL object when component unmounts or imageFile changes
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [imageFile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file); // Store the selected image file
  };

  const handleSubmit = () => {
    const data = new FormData();
    data.append('trainerName', formData.trainerName);
    data.append('trainerEmail', formData.trainerEmail);
    data.append('trainerDesignation', formData.trainerDesignation);
    data.append('companyId', companyId)
    if (imageFile) {
      data.append('trainerImage', imageFile);
    }

    // Send the form data and image to the backend
    createTrainerData.mutate(data, {
      onSuccess: () => {
        setOpenModal(false);
      },
      onError: (error) => {
        console.error('Error saving trainer data:', error);
      },
    });
  };

  return (
    <form className='dynamic-form'>
      <div className='symbol symbol-100px symbol-lg-160px symbol-fixed position-relative d-flex justify-content-center'>
        {updateUserId ? (
          <img
            src={preview ? preview : `${BASE_URL_Image}/${updateUserId?.image}`}
            alt='Metronic'
          />
        ) : (
          <img src={preview ? preview : toAbsoluteUrl('/media/avatars/300-1.jpg')} alt='Metronic' />
        )}
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
  );
};

export default TrainerFormField;
