import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toAbsoluteUrl} from '../../../_metronic/helpers'
import {useCompanyContext} from './CompanyContext'

const CourseSchema = Yup.object().shape({
  companyName: Yup.string().required('Company Name is required'),
  companyAddress: Yup.string().required('Company Address is required'),
  email: Yup.string().required('Company Email Address  is required'),
  companyPhone: Yup.string().required('Company Phone Number is required'),
  companyWebsite: Yup.string().required('Company Website is required'),
  reciptNumber: Yup.string().required('Company recipt number'),
  gst: Yup.number(),
})

const AddCompany = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [preview, setPreview] = useState('')
  const [logo, setLogo] = useState(null)
  const companyCTX = useCompanyContext()
  //console.log(companyCTX)
  //console.log(getCourseCategoryLists)

  const setProfile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setLogo(e.target.files[0])
    }
    //console.log(logo)
  }

  useEffect(() => {
    if (logo) {
      // setPreview(URL.createObjectURL(logo))
      setPreview(URL.createObjectURL(logo))
      //console.log(logo.name)
    }
  }, [logo])

  let initialValues = {
    companyName: '',
    companyPhone: '',
    companyWebsite: '',
    companyAddress: '',
    reciptNumber: '',
    gst: '',
    email: '',
  }

  const formik = useFormik({
    initialValues,
    validationSchema: CourseSchema,
    onSubmit: async (values) => {
      setLoading(true)
      let formData = new FormData()
      //console.log(values)

      // Append each field of values to formData
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value) // Ensure value is a string, adjust if needed
      })

      // Append the image to formData
      if (logo) {
        formData.append('logo', logo)
      }
      companyCTX.createAddCompanyMutation.mutate(formData)
      navigate('/company')
    },
  })
  return (
    <>
      <div className='card mb-5 mb-xl-10'>
        <div
          className='card-header border-0 cursor-pointer'
          role='button'
          data-bs-toggle='collapse'
          data-bs-target='#kt_account_profile_details'
          aria-expanded='true'
          aria-controls='kt_account_profile_details'
        >
          <div className='card-title m-0'>
            <h3 className='fw-bolder m-0'>Add Company</h3>
          </div>
        </div>

        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9'>
              <div className='d-flex align-items-center  justify-content-between '>
                <img
                  src={preview ? preview : toAbsoluteUrl('/media/avatars/300-1.jpg')}
                  alt=''
                  width={100}
                  className='img-thumbnail flex-1'
                />
                <label className='col-6 col-form-label fw-bold fs-6 flex-4'>
                  Logo{' '}
                  <div className='fv-row mt-5 '>
                    <input
                      type='file'
                      name='logo' // Add the name attribute
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      onChange={(e) => setProfile(e)}
                    />
                  </div>
                </label>
              </div>
              <div className='row mb-6'>
                <label className='col-6 col-form-label fw-bold fs-6'>
                  Company Name{' '}
                  <div className='fv-row mt-5 '>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      placeholder='Enter Company Name..'
                      {...formik.getFieldProps('companyName')}
                    />
                    {formik.touched.companyName && formik.errors.companyName && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors?.companyName}</div>
                      </div>
                    )}
                  </div>
                </label>

                {/* ----------------------- Company Email Field Start----------------------------- */}
                <label className='col-6 col-form-label fw-bold fs-6'>
                  Company Email{' '}
                  <div className='fv-row mt-5 '>
                    <input
                      type='email'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      placeholder='Enter Company Email Address..'
                      {...formik.getFieldProps('email')}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors?.email}</div>
                      </div>
                    )}
                  </div>
                </label>
                {/* ----------------------- Company Email Field End ----------------------------- */}

                {/* ----------------------- Company Phone Field Start----------------------------- */}
                <label className='col-6 col-form-label fw-bold fs-6'>
                  Company Phone{' '}
                  <div className='fv-row mt-5 '>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      placeholder='Enter Company Phone Number..'
                      {...formik.getFieldProps('companyPhone')}
                    />
                    {formik.touched.companyPhone && formik.errors.companyPhone && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors?.companyPhone}</div>
                      </div>
                    )}
                  </div>
                </label>
                {/* ----------------------- Company Phone Field End ----------------------------- */}

                {/* ----------------------- Company Website Field Start----------------------------- */}
                <label className='col-6 col-form-label fw-bold fs-6'>
                  Company Website{' '}
                  <div className='fv-row mt-5 '>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      placeholder='Enter Company website'
                      {...formik.getFieldProps('companyWebsite')}
                    />
                    {formik.touched.companyWebsite && formik.errors.companyWebsite && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors?.companyWebsite}</div>
                      </div>
                    )}
                  </div>
                </label>
                {/* ----------------------- Company Website Field End ----------------------------- */}

                {/* ============================ Start course fees==================== */}
                <label className='col-6 col-form-label fw-bold fs-6'>
                  Company Address{' '}
                  <div className='fv-row mt-5 '>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      placeholder='Enter Company Address'
                      {...formik.getFieldProps('companyAddress')}
                    />
                    {formik.touched.companyAddress && formik.errors.companyAddress && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors?.companyAddress}</div>
                      </div>
                    )}
                  </div>
                </label>
                <label className='col-6 col-form-label fw-bold fs-6'>
                  Recipt Number (example : ILS-100)
                  <div className='fv-row mt-5 '>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      placeholder='Enter recipt Number'
                      {...formik.getFieldProps('reciptNumber')}
                    />
                    {formik.touched.reciptNumber && formik.errors.reciptNumber && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors?.reciptNumber}</div>
                      </div>
                    )}
                  </div>
                </label>
                <label className='col-6 col-form-label fw-bold fs-6'>
                  GST{' '}
                  <div className='fv-row mt-5 '>
                    <input
                      type='number'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      placeholder='Enter GST number'
                      {...formik.getFieldProps('gst')}
                      min={0}
                    />
                    {formik.touched.gst && formik.errors.gst && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors?.gst}</div>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>

            <div className='card-footer d-flex justify-content-end py-6 px-9'>
              <button type='submit' className='btn btn-primary' disabled={loading}>
                {!loading && 'Save Changes'}
                {loading && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    {/* Please wait...{' '} */}
                    Added
                    {/* <span className='spinner-border spinner-border-sm align-middle ms-2'></span> */}
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
export default AddCompany
