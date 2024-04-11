import React, {useEffect, useState} from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {
  AddMissionFormInterface,
  addMissionFormInitialValues as initialValues,
} from '../../modules/accounts/components/settings/SettingsModel'
import {useAdmissionContext} from '../../modules/auth/core/Addmission'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import {KTIcon, toAbsoluteUrl} from '../../../_metronic/helpers'
import {AccountHeader} from '../../modules/accounts/AccountHeader'
import {Dropdown1} from '../../../_metronic/partials'
import {useCourseContext} from '../course/CourseContext'
import StudentCourseFee from './StudentCourseFee'

const BASE_URL = process.env.REACT_APP_BASE_URL
const BASE_URL_Image = `${BASE_URL}/images`

const addmissionFormSchema = Yup.object().shape({
  rollNumber: Yup.number().required('Roll Number is required!'),
  _id: Yup.string(),
  name: Yup.string().required('Name is required!'),
  father_name: Yup.string().required('Father Name is required!'),
  mobile_number: Yup.string().required('Mobile Number is required!'),
  phone_number: Yup.string().required('Phone Number is required!'),
  present_address: Yup.string().required('Present Address is required!'),
  permanent_address: Yup.string().required('Permanent Address is required!'),
  date_of_birth: Yup.string().required('Date of birth is required!'),
  city: Yup.string().required('city is required!'),
  email: Yup.string().required('email is required!'),
  student_status: Yup.string().required('Student status is required!'),
  education_qualification: Yup.string().required('Education qualification is required!'),
  professional_qualification: Yup.string().required('Professional Qualification is required!'),
  select_course: Yup.string().required('select course is required!'),
  name_of_person_for_commision: Yup.string().required('Name of person for commision is required!'),
  commision_paid: Yup.string().required('commision paid is required!'),
  commision_date: Yup.string().required('Commision date is required!'),
  commision_voucher_number: Yup.string().required('Commision voucher number is required!'),
  course_fees: Yup.string().required('Course fees is required!'),
  down_payment: Yup.string().required('Down Payment is required!'),
  date_of_joining: Yup.string().required('Date of joining is required!'),
  no_of_installments: Yup.string().required('Number of installments  is required!'),
})

const StudentProfile: React.FC = () => {
  const [preview, setPreview] = useState('')
  const [image, setImage] = useState<File | null>(null)

  const location = useLocation()
  const courseCtx = useCourseContext()

  const setProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0])
    }
  }

  const [updateUserId, setUpdateUserId] = useState<any>(location.state)
  //console.log(updateUserId)

  // let updateStudentId = updateUserId?._id

  let updateStudentInitialValues: AddMissionFormInterface = updateUserId
    ? updateUserId
    : initialValues

  useEffect(() => {
    if (image) {
      // setPreview(URL.createObjectURL(image))
      setPreview(URL.createObjectURL(image))
      //console.log(image.name)
    }
  }, [image])

  const navigate = useNavigate()
  const context = useAdmissionContext()
  //context.setStudentId(updateUserId?._id)
  const formik = useFormik<AddMissionFormInterface>({
    initialValues: updateStudentInitialValues,
    validationSchema: addmissionFormSchema,
    onSubmit: async (values) => {
      let formData = new FormData()

      // Append each field of values to formData
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value as string) // Ensure value is a string, adjust if needed
      })

      // Append the image to formData
      if (image) {
        formData.append('image', image)
      }

      if (updateUserId) {
        context.updateStudentMutation.mutate(formData)
      } else {
        context.createStudentMutation.mutate(formData)
      }

      navigate('/students')
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
            <h3 className='fw-bolder m-0'>
              {/* {updateUserId ? 'Edit Student Information' : 'Student Information'} */}
              Student Profile
            </h3>
          </div>
        </div>

        <div className='card mb-5 mb-xl-10'>
          <div className='card-body pt-9 pb-0'>
            <div className='d-flex flex-wrap flex-sm-nowrap mb-3'>
              <div className='me-7 mb-4'>
                <div className='symbol symbol-100px symbol-lg-160px symbol-fixed position-relative'>
                  <img src={BASE_URL_Image + `/${updateUserId?.image}`} alt='Metronic' />
                  <div className='position-absolute translate-middle bottom-0 start-100 mb-6 bg-success rounded-circle border border-4 border-white h-20px w-20px'></div>
                </div>
              </div>

              <div className='flex-grow-1'>
                <div className='d-flex justify-content-between align-items-start flex-wrap mb-2'>
                  <div className='d-flex flex-column'>
                    <div className='d-flex align-items-center mb-2'>
                      <a href='#' className='text-gray-800 text-hover-primary fs-2 fw-bolder me-1'>
                        {updateUserId?.name}
                      </a>
                      <a href='#'>
                        <KTIcon iconName='verify' className='fs-1 text-primary' />
                      </a>
                      <a
                        href='#'
                        className='btn btn-sm btn-light-success fw-bolder ms-2 fs-8 py-1 px-3'
                        data-bs-toggle='modal'
                        data-bs-target='#kt_modal_upgrade_plan'
                      >
                        Upgrade to Pro
                      </a>
                    </div>

                    <div className='d-flex flex-wrap fw-bold fs-6 mb-4 pe-2'>
                      <a
                        href='#'
                        className='d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2'
                      >
                        <KTIcon iconName='profile-circle' className='fs-4 me-1' />
                        +91 {updateUserId?.mobile_number}
                      </a>
                      <a
                        href='#'
                        className='d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2'
                      >
                        {/* <KTIcon iconName='geolocation' className='fs-4 me-1' /> */}
                        {updateUserId?.select_course}
                      </a>
                      <a
                        href='#'
                        className='d-flex align-items-center text-gray-400 text-hover-primary mb-2'
                      >
                        <KTIcon iconName='sms' className='fs-4 me-1' />
                        {updateUserId?.email}
                      </a>
                    </div>
                  </div>

                  <div className='d-flex my-4'>
                    <a href='#' className='btn btn-sm btn-light me-2' id='kt_user_follow_button'>
                      <KTIcon iconName='check' className='fs-3 d-none' />

                      <span className='indicator-label'>Follow</span>
                      <span className='indicator-progress'>
                        Please wait...
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                      </span>
                    </a>
                    <a
                      href='#'
                      className='btn btn-sm btn-primary me-3'
                      data-bs-toggle='modal'
                      data-bs-target='#kt_modal_offer_a_deal'
                    >
                      Hire Me
                    </a>
                    <div className='me-0'>
                      <button
                        className='btn btn-sm btn-icon btn-bg-light btn-active-color-primary'
                        data-kt-menu-trigger='click'
                        data-kt-menu-placement='bottom-end'
                        data-kt-menu-flip='top-end'
                      >
                        <i className='bi bi-three-dots fs-3'></i>
                      </button>
                      <Dropdown1 />
                    </div>
                  </div>
                </div>

                <div className='d-flex flex-wrap flex-stack'>
                  <div className='d-flex flex-column flex-grow-1 pe-8'>
                    <div className='d-flex flex-wrap'>
                      <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                        <div className='d-flex align-items-center'>
                          <KTIcon iconName='arrow-up' className='fs-3 text-success me-2' />
                          <div className='fs-2 fw-bolder'>Rs.{updateUserId?.course_fees}</div>
                        </div>

                        <div className='fw-bold fs-6 text-gray-400'>Total Fee</div>
                      </div>

                      <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                        <div className='d-flex align-items-center'>
                          <KTIcon iconName='arrow-down' className='fs-3 text-danger me-2' />
                          <div className='fs-2 fw-bolder'>Rs.{updateUserId?.down_payment}</div>
                        </div>

                        <div className='fw-bold fs-6 text-gray-400'>Fees Paid</div>
                      </div>

                      <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                        <div className='d-flex align-items-center'>
                          <KTIcon iconName='arrow-up' className='fs-3 text-success me-2' />
                          <div className='fs-2 fw-bolder'>
                            Rs.{updateUserId?.remainingCourseFees}
                          </div>
                        </div>

                        <div className='fw-bold fs-6 text-gray-400'>Remainig Fee</div>
                      </div>
                    </div>
                  </div>

                  <div className='d-flex align-items-center w-200px w-sm-300px flex-column mt-3'>
                    <div className='d-flex justify-content-between w-100 mt-auto mb-2'>
                      <span className='fw-bold fs-6 text-gray-400'>Profile Compleation</span>
                      <span className='fw-bolder fs-6'>50%</span>
                    </div>
                    <div className='h-5px mx-3 w-100 bg-light mb-3'>
                      <div
                        className='bg-success rounded h-5px'
                        role='progressbar'
                        style={{width: '50%'}}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9'>
              {/* ============================= Start Name here ======================== */}
              {/*========================== profile =================================== */}
              <div className='row mt-5 '>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label required fw-bold fs-6'>Image</label>
                    <div className='col-lg-6 fv-row'>
                      <input
                        disabled
                        type='file'
                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                        placeholder='Image'
                        onChange={(e) => setProfile(e)}
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                      Roll Number{' '}
                    </label>
                    <div className='col-lg-6 fv-row'>
                      <input
                        readOnly
                        type='number'
                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                        placeholder='Enter Roll Number..'
                        {...formik.getFieldProps('rollNumber')}
                      />
                      {formik.touched.rollNumber && formik.errors.rollNumber && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors?.rollNumber}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className='row'>
                {/* ================================------Name----================================== */}
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label required fw-bold fs-6'>Name</label>
                    <div className='col-lg-6 fv-row'>
                      <input
                        type='text'
                        readOnly
                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                        placeholder='Name'
                        {...formik.getFieldProps('name')}
                      />
                      {formik.touched.name && formik.errors.name && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors?.name}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* ================================------Name----================================== */}
                {/* ================================------Father Name----================================== */}
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                      Father Name
                    </label>
                    <div className='col-lg-6 fv-row'>
                      <input
                        readOnly
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Father Name'
                        {...formik.getFieldProps('father_name')}
                      />
                      {formik.touched.father_name && formik.errors.father_name && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.father_name}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* ================================------Father Name----================================== */}
              </div>

              {/* ========================  Contact Number ============================= */}

              <div className='row'>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                      Mobile Number
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <input
                        readOnly
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Mobile Number'
                        {...formik.getFieldProps('mobile_number')}
                      />
                      {formik.touched.mobile_number && formik.errors.mobile_number && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.mobile_number}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className='required'>Phone Number</span>
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <input
                        readOnly
                        type='tel'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Phone number'
                        {...formik.getFieldProps('phone_number')}
                      />
                      {formik.touched.phone_number && formik.errors.phone_number && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.phone_number}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ========================  Contact Number ============================= */}

              {/* =================================Address Information==================================== */}

              <div className='row'>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className='required'>Present Address</span>
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <input
                        readOnly
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Present Address'
                        {...formik.getFieldProps('present_address')}
                      />
                      {formik.touched.present_address && formik.errors.present_address && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.present_address}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className='required'>Permanent Address</span>
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <input
                        readOnly
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Permanent Address'
                        {...formik.getFieldProps('permanent_address')}
                      />
                      {formik.touched.permanent_address && formik.errors.permanent_address && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.permanent_address}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* =================================Address Information==================================== */}

              {/* ============================== Email and City ==================================== */}

              <div className='row'>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className='required'>City</span>
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <input
                        readOnly
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='City'
                        {...formik.getFieldProps('city')}
                      />
                      {formik.touched.city && formik.errors.city && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.city}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className='required'>Email</span>
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <input
                        type='email'
                        readOnly
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Email'
                        {...formik.getFieldProps('email')}
                      />
                      {formik.touched.email && formik.errors.email && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.email}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* ============================== Email and City ==================================== */}
              {/* ============================== DOB and Student Status ==================================== */}
              <div className='row'>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className='required'>DOB</span>
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <DatePicker
                        readOnly
                        selected={formik.values.date_of_birth}
                        onChange={(date) => formik.setFieldValue('date_of_birth', date)}
                        dateFormat='dd/MM/yyyy'
                        className='form-control form-control-lg form-control-solid'
                        placeholderText='DD/MM/YYYY'
                      />
                      {formik.touched.date_of_birth && formik.errors.date_of_birth && (
                        <div className='fv-plugins-message-container'>
                          {/* <div className='fv-help-block'>{formik.errors.date_of_birth}</div> */}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                      Student Status
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <select
                        disabled
                        className='form-select form-select-solid form-select-lg'
                        {...formik.getFieldProps('student_status')}
                      >
                        <option value=''>select--</option>
                        <option value='A'>A</option>
                        <option value='B'>B</option>
                      </select>
                      {formik.touched.student_status && formik.errors.student_status && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.student_status}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* ============================== DOB and Student Status ==================================== */}

              {/* -----------------QUALIFICATION START HERE ------------------ */}
              <div className='row'>
                <div
                  className='card-header border-1 cursor-pointer'
                  role='button'
                  // data-bs-toggle='collapse'
                  // data-bs-target='#kt_account_profile_details'
                  aria-expanded='true'
                  aria-controls='kt_account_profile_details'
                >
                  <div className='card-title m-0'>
                    <h3 className='fw-bolder m-0'>Qualification</h3>
                  </div>
                </div>
                <div className='col-6 mt-5'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                      Education Qualification
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <select
                        disabled
                        className='form-select form-select-solid form-select-lg'
                        {...formik.getFieldProps('education_qualification')}
                      >
                        <option value=''>-select-</option>
                        {/* <option value='10th'>10th</option> */}
                        <option value='10th'>10th</option>
                        <option value='10+2'>10+2</option>
                      </select>
                      {formik.touched.education_qualification &&
                        formik.errors.education_qualification && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>
                              {formik.errors.education_qualification}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
                <div className='col-6 mt-5'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                      Professional Qualification
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <select
                        disabled
                        className='form-select form-select-solid form-select-lg'
                        {...formik.getFieldProps('professional_qualification')}
                      >
                        <option value=''>-select-</option>
                        {[
                          'None',
                          'Aviation',
                          'B.A',
                          'B.Arch',
                          'B.B.A',
                          'B.Com',
                          'B.E/B.Tech',
                          'BHM',
                          'BL/LLB',
                          'B.Pharm',
                          'B.Sc',
                          'BSW',
                          'CA',
                          'CA Inter',
                          'Class 12',
                          'CS',
                          'Diploma',
                          'DSW',
                          'ICWA',
                          'ICWA Inter',
                          'MA',
                          'M.Arch',
                          'M.Arch',
                          'MBA',
                          'MBBS',
                          'MCA',
                          'M.Com',
                          'MD/MS',
                          'M.Ed',
                          'M.E/M.Tech/MS',
                          'ML/LLM',
                          'M.Pharma',
                          'MPhil',
                          'M.Sc',
                          'MSW',
                          'PGDCA',
                          'PG Diploma',
                          'PGDM',
                          'Phd',
                          'other',
                        ]?.map((c, i) => (
                          <option key={i} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      {formik.touched.professional_qualification &&
                        formik.errors.professional_qualification && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>
                              {formik.errors.professional_qualification}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
              {/* ---------------------------QUALIFICATION END HERE ----------------------- */}

              {/* ---------------------------COURSE START HERE ----------------------- */}
              <div className='row'>
                <div
                  className='card-header border-1 cursor-pointer'
                  role='button'
                  // data-bs-toggle='collapse'
                  // data-bs-target='#kt_account_profile_details'
                  aria-expanded='true'
                  aria-controls='kt_account_profile_details'
                >
                  <div className='card-title m-0'>
                    <h3 className='fw-bolder m-0'>Course</h3>
                  </div>
                </div>

                <div className='col-6 mt-5'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                      Select Course
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <select
                        disabled
                        className='form-select form-select-solid form-select-lg'
                        {...formik.getFieldProps('select_course')}
                      >
                        <option value=''>-select-</option>
                        {courseCtx.getCourseLists?.data?.map((c: any) => (
                          <option key={c._id} value={c.courseName}>
                            {c.courseName}
                          </option>
                        ))}
                      </select>
                      {formik.touched.select_course && formik.errors.select_course && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.select_course}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className='row'>
                <div
                  className='card-header border-1 cursor-pointer'
                  role='button'
                  // data-bs-toggle='collapse'
                  // data-bs-target='#kt_account_profile_details'
                  aria-expanded='true'
                  aria-controls='kt_account_profile_details'
                >
                  <div className='card-title m-0'>
                    <h3 className='fw-bolder m-0'>Commision</h3>
                  </div>
                </div>

                <div className='col-6 mt-5'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className='required'>Name of Person for Commision</span>
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <input
                        readOnly
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Name of Person For Commision'
                        {...formik.getFieldProps('name_of_person_for_commision')}
                      />
                      {formik.touched.name_of_person_for_commision &&
                        formik.errors.name_of_person_for_commision && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>
                              {formik.errors.name_of_person_for_commision}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ---------------------------COURSE END HERE ----------------------- */}
              {/* ---------------------------Commision Start HERE ----------------------- */}

              {/* ---------------------------Commision End HERE ----------------------- */}
              <div className='row'>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className='required'>Commision Com. Paid</span>
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <input
                        readOnly
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Commision Com. Paid'
                        {...formik.getFieldProps('commision_paid')}
                      />
                      {formik.touched.commision_paid && formik.errors.commision_paid && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.commision_paid}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className='required'>Commision Date</span>
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <DatePicker
                        readOnly
                        selected={formik.values.commision_date}
                        onChange={(date) => formik.setFieldValue('commision_date', date)}
                        dateFormat='dd/MM/yyyy'
                        className='form-control form-control-lg form-control-solid'
                        placeholderText='DD/MM/YYYY'
                      />
                      {formik.touched.commision_date && formik.errors.commision_date && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.commision_date}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className='row'>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className='required'>Commision Voucher No</span>
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <input
                        readOnly
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Commision Voucher No'
                        {...formik.getFieldProps('commision_voucher_number')}
                      />
                      {formik.touched.commision_voucher_number &&
                        formik.errors.commision_voucher_number && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>
                              {formik.errors.commision_voucher_number}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                <div
                  className='card-header border-1 cursor-pointer'
                  role='button'
                  // data-bs-toggle='collapse'
                  // data-bs-target='#kt_account_profile_details'
                  aria-expanded='true'
                  aria-controls='kt_account_profile_details'
                >
                  <div className='card-title m-0'>
                    <h3 className='fw-bolder m-0'>For Office Use Only</h3>
                  </div>
                </div>
              </div>

              <>
                <div className='row mt-5'>
                  <div className='col-6'>
                    <div className='row mb-6'>
                      <label className='col-lg-4 col-form-label fw-bold fs-6'>
                        <span className='required'>Course Fees</span>
                        {/* <p>(including 14% service Tax)</p> */}
                      </label>

                      <div className='col-lg-8 fv-row'>
                        <input
                          type='text'
                          className='form-control form-control-lg form-control-solid'
                          placeholder='Course Fees'
                          {...formik.getFieldProps('course_fees')}
                          readOnly
                        />
                        {formik.touched.course_fees && formik.errors.course_fees && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>{formik.errors.course_fees}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className='col-6'>
                    <div className='row mb-6'>
                      <label className='col-lg-4 col-form-label fw-bold fs-6'>
                        <span className='required'>Course Fees Discount</span>
                      </label>

                      <div className='col-lg-8 fv-row'>
                        <input
                          type='number'
                          min={0}
                          max={20}
                          className='form-control form-control-lg form-control-solid'
                          placeholder='Course Fees'
                          readOnly
                          {...formik.getFieldProps('discount')}
                        />
                        {formik.touched.discount && formik.errors.discount && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>{formik.errors.discount}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-6'>
                    <div className='row mb-6'>
                      <label className='col-lg-4 col-form-label fw-bold fs-6'>
                        <span className='required'>Net Course Fees</span>
                      </label>

                      <div className='col-lg-8 fv-row'>
                        <input
                          type='number'
                          className='form-control form-control-lg form-control-solid'
                          placeholder='Net Course Fees'
                          {...formik.getFieldProps('netCourseFees')}
                          readOnly
                        />
                        {formik.touched.netCourseFees && formik.errors.netCourseFees && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>{formik.errors.netCourseFees}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className='col-6'>
                    <div className='row mb-6'>
                      <label className='col-lg-4 col-form-label fw-bold fs-6'>
                        <span className='required'>Down Payment</span>
                      </label>

                      <div className='col-lg-8 fv-row'>
                        <input
                          type='number'
                          className='form-control form-control-lg form-control-solid'
                          placeholder='Down Payment'
                          readOnly
                          {...formik.getFieldProps('down_payment')}
                        />
                        {formik.touched.down_payment && formik.errors.down_payment && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>{formik.errors.down_payment}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-6'>
                    <div className='row mb-6'>
                      <label className='col-lg-4 col-form-label fw-bold fs-6'>
                        <span className='required'>Remaining Fee</span>
                      </label>

                      <div className='col-lg-8 fv-row'>
                        <input
                          type='number'
                          readOnly
                          className='form-control form-control-lg form-control-solid'
                          placeholder='Remaining Fees'
                          {...formik.getFieldProps('remainingCourseFees')}
                        />
                        {formik.touched.remainingCourseFees && formik.errors.remainingCourseFees && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>{formik.errors.remainingCourseFees}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>

              <div className='row'>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className='required'>D.O.J</span>
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <DatePicker
                        readOnly
                        selected={formik.values.date_of_joining}
                        onChange={(date) => formik.setFieldValue('date_of_joining', date)}
                        dateFormat='dd/MM/yyyy'
                        className='form-control form-control-lg form-control-solid'
                        placeholderText='DD/MM/YYYY'
                      />

                      {formik.touched.date_of_joining && formik.errors.date_of_joining && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.date_of_joining}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                      No. of Installments
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <select
                        disabled
                        className='form-select form-select-solid form-select-lg'
                        {...formik.getFieldProps('no_of_installments')}
                      >
                        <option value=''>-select-</option>
                        {Array.from({length: 60}, (_, index) => (
                          <option key={index} value={index + 1}>
                            {index + 1}
                          </option>
                        ))}
                      </select>
                      {formik.touched.no_of_installments && formik.errors.no_of_installments && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.no_of_installments}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ---------------------------FOR OFFICE USE ONLY END HERE ----------------------- */}
            </div>
          </form>
        </div>
      </div>
      <StudentCourseFee className={''} studentInfoData={updateUserId} />
    </>
  )
}

export default StudentProfile
