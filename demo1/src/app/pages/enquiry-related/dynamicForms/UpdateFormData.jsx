import {useState, useEffect} from 'react'
import {toast} from 'react-toastify'
import {KTIcon} from '../../../../_metronic/helpers'
import PopUpModal from '../../../modules/accounts/components/popUpModal/PopUpModal'
import DynamicFields from '../DynamicFields'
import {useDynamicFieldContext} from '../DynamicFieldsContext'
import {useCompanyContext} from '../../compay/CompanyContext'
import {useNavigate, useParams} from 'react-router-dom'
import {useCustomFormFieldContext} from './CustomFormFieldDataContext'

const UpdateFormData = () => {
  const navigate = useNavigate()
  const [formFieldValues, setFormFieldValues] = useState({})
  const {
    getAllCustomFormFieldDataQuery,
    openModal: contextOpenModal,
    setOpenModal: setcontextOpenModal,
    getAllAddedFormsName,
    deleteFieldMutation,
  } = useDynamicFieldContext()
  const {useGetSingleFormValueById, updateFormFieldMutation} = useCustomFormFieldContext()
  const {getCompanyLists} = useCompanyContext()
  const params = useParams()

  const {data: singleFormValueData} = useGetSingleFormValueById(params.id)
  const companyId = singleFormValueData?.companyId
  const formId = singleFormValueData?.formId

  const id = getAllAddedFormsName?.data
    ?.filter((company) => company.companyName === companyId)
    .map((company) => ({
      companyId: company.companyName,
      formName: company.formName,
    }))

  const companyName =
    id &&
    id.length > 0 &&
    getCompanyLists?.data
      ?.filter((companyById) => companyById._id === id[0]?.companyId)
      .map((company) => company.companyName)

  useEffect(() => {
    // Initialize form field values from the existing data
    if (singleFormValueData?.formFiledValue) {
      const initialValues = singleFormValueData.formFiledValue.reduce((acc, field) => {
        acc[field.name] = field.value
        return acc
      }, {})
      setFormFieldValues(initialValues)
    }
  }, [singleFormValueData])

  const handleInputChange = (fieldName, value) => {
    // console.log(value)
    setFormFieldValues((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }))
  }

  const handleCheckboxChange = (fieldName, optionValue, checked) => {
    setFormFieldValues((prevState) => ({
      ...prevState,
      [fieldName]: {
        ...prevState[fieldName],
        [optionValue]: checked ? optionValue : '',
        // [fieldName]: [optionValue],
      },
    }))
  }

  const handleRadioChange = (fieldName, value) => {
    setFormFieldValues((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }))
  }

  const handleSelectChange = (fieldName, value) => {
    setFormFieldValues((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }))
  }

  const handleSave = async (event) => {
    event.preventDefault()
    try {
      const formattedFields = Object.entries(formFieldValues).map(([name, value]) => ({
        name,
        value,
      }))

      await updateFormFieldMutation.mutate({
        formId: formId,
        formFieldValues: formattedFields,
        id: params.id,
      })
      navigate(`/view-form-data/${companyId}`)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const fieldDeleteHandler = (fieldId) => {
    deleteFieldMutation.mutate(fieldId, {
      onSuccess: () => {
        toast.success('Field deleted successfully!')
      },
      onError: (error) => {
        // toast.error(`Error deleting form: ${error.message}`)
      },
    })
  }

  return (
    <>
      <div className='card mb-5 mb-xl-10'>
        <div className='card-header border-0 cursor-pointer'>
          <div className='card-title m-0'>
            {id && id.length > 0 ? (
              <h3 className='fw-bolder m-0 w-5'>{`${companyName} -> ${id[0]?.formName} `}</h3>
            ) : (
              <h3 className='fw-bolder m-0 w-5'>Loading...</h3>
            )}
          </div>
        </div>
        <div id='kt_account_profile_details' className='collapse show'>
          <form>
            <div className='card-body border-top p-9'>
              <div className='row'>
                {singleFormValueData?.formFiledValue
                  ?.filter((formFieldData) => formFieldData.name !== 'companyId')
                  .map((formFieldData, index) => {
                    // console.log(formFieldData)
                    if (
                      formFieldData.type === 'text' ||
                      formFieldData.type === 'url' ||
                      formFieldData.type === 'currency'
                    ) {
                      return (
                        <div className='col-6' key={index}>
                          <div className='row mb-6'>
                            <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                              {formFieldData.name}
                            </label>
                            <div className='col-lg-6 fv-row'>
                              <input
                                type='text'
                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                placeholder={formFieldData?.name}
                                name='Name'
                                value={formFieldValues[formFieldData.name] || ''}
                                onChange={(e) =>
                                  handleInputChange(formFieldData.name, e.target.value)
                                }
                              />
                            </div>
                          </div>
                        </div>
                      )
                    } else if (
                      formFieldData.type === 'date' ||
                      formFieldData.type === 'datetime-local'
                    ) {
                      return (
                        <div className='col-6' key={index}>
                          <div className='row mb-6'>
                            <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                              {formFieldData.name}
                            </label>
                            <div className='col-lg-6 fv-row'>
                              <input
                                type={formFieldData.type === 'date' ? 'date' : 'datetime-local'}
                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                placeholder={formFieldData.name}
                                name='Name'
                                value={formFieldValues[formFieldData.name] || ''}
                                onChange={(e) =>
                                  handleInputChange(formFieldData.name, e.target.value)
                                }
                              />
                            </div>
                          </div>
                        </div>
                      )
                    }
                  })}
                {getAllCustomFormFieldDataQuery.data
                  ?.filter((form) => form.formId[form.formId.length - 1] === formId)
                  .map((field, index) => {
                    switch (field.type) {
                      case 'checkbox':
                        return (
                          <div className='col-6' key={index}>
                            <div className='row mb-6'>
                              <div className='col-lg-4 d-flex align-items-center'>
                                <label
                                  htmlFor={`${field.type}-${index}`}
                                  className={`col-form-label fw-bold fs-6 ${
                                    field.mandatory === true ? 'required' : ''
                                  }`}
                                  style={{whiteSpace: 'nowrap'}}
                                >
                                  {field.name}
                                </label>
                              </div>
                              <div className='col-lg-8'>
                                <div className='row'>
                                  {field.options.map((option, optionIndex) => (
                                    <div
                                      key={optionIndex}
                                      className='col-md-6 mb-2 d-flex align-items-center'
                                    >
                                      <div className='form-check flex-grow-1'>
                                        <input
                                          type='checkbox'
                                          name={field.name}
                                          checked={
                                            formFieldValues[field.name]?.[option.value] || false
                                          }
                                          onChange={(event) => {
                                            console.log(formFieldValues[field.name]?.[option.value])
                                            handleCheckboxChange(
                                              field.name,
                                              option.value,
                                              event.target.checked
                                            )
                                          }}
                                          className='form-check-input'
                                        />
                                        <label className='form-check-label'>{option.label}</label>
                                      </div>
                                      {/* {optionIndex === field.options.length - 1 && (
                                        <button
                                          type='button'
                                          className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm ms-2'
                                          onClick={() => fieldDeleteHandler(field._id)}
                                        >
                                          <KTIcon iconName='trash' className='fs-3' />
                                        </button>
                                      )} */}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      case 'radio':
                        return (
                          <div className='col-6' key={index}>
                            <div className='row mb-6'>
                              <div className='col-lg-4 d-flex align-items-center'>
                                <label
                                  htmlFor={`${field.type}-${index}`}
                                  className={`col-form-label fw-bold fs-6 ${
                                    field.mandatory === true ? 'required' : ''
                                  }`}
                                  style={{whiteSpace: 'nowrap'}}
                                >
                                  {field.name}
                                </label>
                              </div>
                              <div className='col-lg-8'>
                                <div className='row'>
                                  {field.options.map((option, optionIndex) => (
                                    <div
                                      key={optionIndex}
                                      className='col-md-6 mb-2 d-flex align-items-center'
                                    >
                                      <div className='form-check flex-grow-1'>
                                        <input
                                          id={`${field.type}-${index}-${optionIndex}`}
                                          type='radio'
                                          name={field.name}
                                          value={option.value}
                                          checked={
                                            formFieldValues[field.name] === option.value || false
                                          }
                                          onChange={(e) =>
                                            handleRadioChange(field.name, e.target.value)
                                          }
                                          className='form-check-input'
                                        />
                                        <label
                                          htmlFor={`${field.type}-${index}-${optionIndex}`}
                                          className='form-check-label'
                                        >
                                          {option.label}
                                        </label>
                                      </div>
                                      {/* {optionIndex === field.options.length - 1 && (
                                        <button
                                          type='button'
                                          className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm ms-2'
                                          onClick={() => fieldDeleteHandler(field._id)}
                                        >
                                          <KTIcon iconName='trash' className='fs-3' />
                                        </button>
                                      )} */}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      case 'select':
                        return (
                          <div className='col-6' key={index}>
                            <div className='row mb-6'>
                              <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                                {field.name}
                              </label>
                              <div className='col-lg-6 fv-row'>
                                <select
                                  className='form-select form-select-solid'
                                  value={formFieldValues[field.name] || ''}
                                  onChange={(e) => handleSelectChange(field.name, e.target.value)}
                                >
                                  <option value=''>Select an option</option>
                                  {field.options.map((option, optionIndex) => (
                                    <option key={optionIndex} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        )
                      default:
                        return null
                      // return (
                      //   <div className='col-6' key={index}>
                      //     <div className='row mb-6'>
                      //       <label className={`col-lg-4 col-form-label fw-bold fs-6`}>
                      //         <span className={`${field.mandatory === true ? 'required' : ''}`}>
                      //           {field.name}
                      //         </span>
                      //       </label>
                      //       <div className='col-lg-8 d-flex align-items-center'>
                      //         <input
                      //           id={`${field.type}-${index}`}
                      //           type={field.type}
                      //           className='form-control form-control-lg form-control-solid flex-grow-1'
                      //           placeholder={field.name}
                      //           value={formFieldValues[field.name] || ''}
                      //           onChange={(event) =>
                      //             handleInputChange(
                      //               index,
                      //               event.target.value,
                      //               field.name,
                      //               field.type
                      //             )
                      //           }
                      //         />
                      //         <button
                      //           type='button'
                      //           className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm ms-2'
                      //           onClick={() => fieldDeleteHandler(field._id)}
                      //         >
                      //           <KTIcon iconName='trash' className='fs-3' />
                      //         </button>
                      //       </div>
                      //     </div>
                      //   </div>
                      // )
                    }
                  })}
              </div>
            </div>
            <div className='card-footer d-flex justify-content-end py-6 px-9'>
              {/* <button type='reset' className='btn btn-light btn-active-light-primary me-2'>
                Discard
              </button> */}
              <button type='button' className='btn btn-primary' onClick={handleSave}>
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
      <PopUpModal
        size='lg'
        title='Field Options'
        open={contextOpenModal}
        handleClose={() => setcontextOpenModal(false)}
        body={
          <DynamicFields
            formFieldValues={formFieldValues}
            handleInputChange={handleInputChange}
            handleCheckboxChange={handleCheckboxChange}
            handleRadioChange={handleRadioChange}
            handleSelectChange={handleSelectChange}
          />
        }
      />
    </>
  )
}

export default UpdateFormData
