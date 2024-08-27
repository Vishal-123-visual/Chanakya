import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDynamicFieldContext } from '../DynamicFieldsContext'
import PopUpModal from '../../../modules/accounts/components/popUpModal/PopUpModal'
// import PopUpModal from ""
import DynamicFields from "../DynamicFields"
import { KTIcon } from '../../../../_metronic/helpers'
import { useCompanyContext } from '../../compay/CompanyContext'
import { toast } from 'react-toastify'
import { useCustomFormFieldContext } from './CustomFormFieldDataContext'

export default function AddForm() {
  const [inputData, setInputData] = useState('')
  const [open, setOpen] = useState(true)

  const [isCreatingNewForm, setIsCreatingNewForm] = useState(false)
  const { deleteFieldMutation } = useDynamicFieldContext()

  const navigate = useNavigate()
  const companyCTX = useCompanyContext()
  const params = useParams()
  const companyId = params?.id

  const { data } = companyCTX?.useGetSingleCompanyData(companyId)
  // console.log(data)

  const fieldDeleteHandler = (fieldId) => {
    deleteFieldMutation.mutate(fieldId, {
      onSuccess: () => {
        // toast.success('Field deleted successfully!')
      },
      onError: (error) => {
        toast.error(`Error deleting form: ${error.message}`)
      },
    })
  }

  const {
    setFields,
    getAllCustomFormFieldDataQuery,
    openModal: contextOpenModal,
    setOpenModal: setcontextOpenModal,
    createaddFormFieldData,
    getAllAddedFormsName,
  } = useDynamicFieldContext()

  const {
    handleSelectChange,
    handleCheckboxChange,
    handleOptionChange,
    handleInputChange,
    fieldValues,
    input,
    setInput,
    setFormData,
    formData,
    setFieldValues,
    createCustomFromFieldValuesMutation,
  } = useCustomFormFieldContext()

  const inputChangeHandler = (index, event, fieldName, type) => {
    handleInputChange(index, event, fieldName, type)
  }
  // const radioChangeHandler = (index, event, fieldName, type) => {
  //   handleInputChange(index, event, fieldName, type)
  // }
  const checkboxChangeHandler = (index, optionValue, event, fieldName, type) => {
    //console.log('check box change handler ', optionValue)
    handleCheckboxChange(index, optionValue, event, fieldName, type)
  }
  const radioChangeHandler = (index, event, fieldName, type, optionValue) => {
    //console.log(optionValue)
    handleOptionChange(index, event, fieldName, type, optionValue)
  }
  const selectChangeHandler = (index, event, fieldName, type) => {
    //console.log(event.target.value, fieldName, type)
    handleSelectChange(index, event, fieldName, type)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setInput((prevInput) => ({ ...prevInput, [name]: value, newValue: value }))
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  // const [fieldValues, setFieldValues] = useState(
  //   getAllCustomFormFieldDataQuery?.data?.map((field) => field.value) || []
  // )

  // useEffect(() => {
  //   if (getAllCustomFormFieldDataQuery?.data) {
  //     setFieldValues(getAllCustomFormFieldDataQuery.data.map((field) => field.value))
  //   }
  // }, [getAllCustomFormFieldDataQuery?.data])

  // Function to handle the change
  // const handleInputChange = (index, newValue, fieldName) => {
  //   const updatedValues = [...fieldValues]
  //   updatedValues[index] = newValue
  //   setFieldValues(updatedValues)

  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     [fieldName]: newValue,
  //   }))
  // }

  // const handleOptionChange = (index, event, fieldName) => {
  //   const {value} = event.target
  //   const values = [...fields]

  //   // Ensure the name is correctly applied
  //   const updatedField = {
  //     ...values[index],
  //     value: value,
  //     name: fieldName || values[index].name, // Fallback to existing name if not provided
  //   }

  //   values[index] = updatedField
  //   setFields(values)

  //   // Update form data
  //   setFormData({
  //     ...formData,
  //     [updatedField.name]: updatedField.value,
  //   })
  // }

  // const handleCheckboxChange = (index, optionValue, event, fieldName) => {
  //   // console.log('Handling checkbox change...')
  //   // console.log('Index:', index)
  //   // console.log('Option Value:', optionValue)
  //   // console.log('Checked:', event.target.checked)
  //   // console.log('Name:', fieldName)

  //   const values = [...fields]
  //   const updatedField = {...values[index], name: fieldName || values[index].name}
  //   // Ensure updatedField.value is always an array
  //   if (!Array.isArray(updatedField.value)) {
  //     updatedField.value = []
  //   }

  //   if (event.target.checked) {
  //     // Add optionValue if it is checked
  //     updatedField.value = [...updatedField.value, optionValue]
  //   } else {
  //     // Remove optionValue if it is unchecked
  //     updatedField.value = updatedField.value.filter((val) => val !== optionValue)
  //   }

  //   // Update fields state
  //   values[index] = updatedField
  //   setFields(values)

  //   // Update formData state
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     [updatedField.name]: updatedField.value,
  //   }))
  // }

  // const handleSelectChange = (index, event, fieldName) => {
  //   const selectedValue = event.target.value
  //   // console.log('Handling select change...')
  //   // console.log('Index:', index)
  //   // console.log('Selected Value:', selectedValue)
  //   // console.log('Namwe', fieldName)

  //   const values = [...fields]
  //   const updatedField = {...values[index], name: fieldName || values[index].name}

  //   // Update the value for the select field
  //   updatedField.value = selectedValue

  //   // Update fields state
  //   values[index] = updatedField
  //   setFields(values)

  //   // Update formData state
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     [updatedField.name]: selectedValue,
  //   }))
  // }

  const formList = getAllAddedFormsName?.data?.filter((form) => form?.companyName === data?._id)
  const formId = formList?.length > 0 ? formList[formList?.length - 1]?._id : undefined

  // console.log(formId)

  const handleSubmit = () => {
    //console.log('form data from ', formData)
    if (inputData.trim() !== '') {
      createaddFormFieldData.mutate({ formName: inputData, companyName: companyId })
      setIsCreatingNewForm(false)
      setInputData('')
      setFieldValues([{}])
    }
  }

  const handleNewForm = () => {
    setInputData('')
    setIsCreatingNewForm(true)
  }

  const updateForm =
    getAllAddedFormsName.data &&
    getAllAddedFormsName.data.length > 0 &&
    getAllAddedFormsName.data[getAllAddedFormsName.data.length - 1]
  // console.log(getAllAddedFormsName.data)

  const formNameAdded =
    getAllAddedFormsName.data &&
      getAllAddedFormsName.data.length > 0 &&
      getAllAddedFormsName.data[getAllAddedFormsName.data.length - 1].companyName.toString() ===
      companyId.toString()
      ? getAllAddedFormsName.data[getAllAddedFormsName.data.length - 1].formName
      : ''

  const handleSave = (event) => {
    event.preventDefault()

    // Save the form data
    createCustomFromFieldValuesMutation.mutate({ ...formData, formId, companyId })
    // navigate(`/view-form-data/${companyId}`)
    window.location.reload()
  }

  return (
    <>
      <div className='card mb-5 mb-xl-10'>
        <div className='card-header border-0 cursor-pointer'>
          <div className='card-title m-0'>
            <h3 className='fw-bolder m-0 w-5'>{`${data?.companyName} -> `}</h3>
            <div className='card-title mx-2'>
              {isCreatingNewForm || !formNameAdded ? (
                <>
                  <input
                    type='text'
                    placeholder='Enter form name'
                    className='form-control form-control-solid mb-3'
                    value={inputData}
                    onChange={(e) => setInputData(e.target.value)}
                    onClick={() => setOpen(true)}
                  />
                  <button className='btn btn-sm btn-light-primary mx-4 mb-1' onClick={handleSubmit}>
                    <KTIcon iconName='plus' className='fs-3' />
                  </button>
                </>
              ) : (
                <>
                  <h3 style={{ fontWeight: 'bolder', margin: 0 }}>{formNameAdded}</h3>
                  <button
                    className='btn btn-sm btn-light-primary mx-4 mb-1'
                    onClick={() => navigate(`/update-form/${updateForm._id}`)}
                  >
                    <KTIcon iconName='pencil' className='fs-3' />
                  </button>
                </>
              )}
            </div>
          </div>
          {formNameAdded && !isCreatingNewForm && (
            <div
              className='card-toolbar'
              data-bs-toggle='tooltip'
              data-bs-placement='top'
              data-bs-trigger='hover'
              title='Click to add a user'
            >
              <button className='btn btn-sm btn-light-primary' onClick={handleNewForm}>
                <KTIcon iconName='plus' className='fs-3' />
                Create New Form
              </button>
            </div>
          )}
        </div>
        <div id='kt_account_profile_details' className='collapse show'>
          <form>
            <div className='card-body border-top p-9'>
              <div className='row'>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label required fw-bold fs-6'>Name</label>
                    <div className='col-lg-6 fv-row'>
                      <input
                        type='text'
                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                        placeholder='Name'
                        name='Name'
                        value={input}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                      Mobile Number
                    </label>
                    <div className='col-lg-8 fv-row'>
                      <input
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Mobile Number'
                        name='Mobile Number'
                        value={input}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className='row'>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span>City</span>
                    </label>
                    <div className='col-lg-8 fv-row'>
                      <input
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='City'
                        name='City'
                        value={input}
                        onChange={handleChange}
                      />
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
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Email'
                        name='Email'
                        value={input}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* ------------------------------- FOOTER STARTS HERE ------------------------------- */}
            </div>
          </form>
        </div>
      </div>

      {/* ------------------------------- CUSTOM FIELDS STARTS HERE ------------------------------- */}

      <div className='card mb-5 mb-xl-10'>
        <div className='card-header border-0 cursor-pointer'>
          <div className='card-title m-0'>
            <h3 className='fw-bolder m-0'>{` ${data?.companyName} -> ${formNameAdded ? `${formNameAdded} ->` : ''
              } Customized Fields `}</h3>
          </div>
        </div>
        <div id='kt_account_profile_details' className='collapse show'>
          <div className='card-body border-top p-9'>
            <form>
              <div className='row'>
                {getAllCustomFormFieldDataQuery.data
                  ?.filter((form) => form.formId[form.formId.length - 1] === formId)
                  .map((field, index) => {
                    switch (field.type) {
                      case 'checkbox':
                        //console.log(field)
                        return (
                          <div className='col-6' key={index}>
                            <div className='row mb-6'>
                              <div className='col-lg-4 d-flex align-items-center'>
                                <label
                                  htmlFor={`${field.type}-${index}`}
                                  className={`col-form-label fw-bold fs-6 ${field.mandatory === true ? 'required' : ''
                                    }`}
                                  style={{ whiteSpace: 'nowrap' }}
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
                                          //value={field.value || false}
                                          checked={field?.value && field?.value[optionIndex]}
                                          onChange={(event) =>
                                            checkboxChangeHandler(
                                              index,
                                              option.value,
                                              event,
                                              field.name,
                                              field.type
                                            )
                                          }
                                          className='form-check-input'
                                        />
                                        <label className='form-check-label'>{option.label}</label>
                                      </div>
                                      {/* Display the delete button only for the last option */}
                                      {optionIndex === field.options.length - 1 && (
                                        <button
                                          type='button'
                                          className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm ms-2'
                                          onClick={() => fieldDeleteHandler(field._id)}
                                        >
                                          <KTIcon iconName='trash' className='fs-3' />
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      case 'radio':
                        //console.log('from, radio', field)
                        return (
                          <div className='col-6' key={index}>
                            <div className='row mb-6'>
                              <div className='col-lg-4 d-flex align-items-center'>
                                <label
                                  htmlFor={`${field.type}-${index}`}
                                  className={`col-form-label fw-bold fs-6 ${field.mandatory === true ? 'required' : ''
                                    }`}
                                  style={{ whiteSpace: 'nowrap' }}
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
                                          value={field?.value}
                                          //checked={field.value}
                                          onChange={(e) =>
                                            radioChangeHandler(
                                              index,
                                              e,
                                              field.name,
                                              field.type,
                                              option.value
                                            )
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
                                      {/* Display the delete button only for the last option */}
                                      {optionIndex === field.options.length - 1 && (
                                        <button
                                          type='button'
                                          className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm ms-2'
                                          onClick={() => fieldDeleteHandler(field._id)}
                                        >
                                          <KTIcon iconName='trash' className='fs-3' />
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )

                      case 'select':
                        //console.log('from select', field)
                        return (
                          <div className='col-6' key={index}>
                            <div className='row mb-6'>
                              <label className={`col-lg-4 col-form-label fw-bold fs-6 `}>
                                <span className={`${field.mandatory === true ? 'required' : ''}`}>
                                  {field.name}
                                </span>
                              </label>
                              <div className='col-lg-8 d-flex align-items-center'>
                                <select
                                  id={`${field.type}-${index}`}
                                  name={field.name}
                                  className='form-select form-select-solid form-select-lg flex-grow-1'
                                  value={field.selectValue}
                                  onChange={(event) => {
                                    selectChangeHandler(index, event, field.name, field.type)
                                  }}
                                >
                                  <option value=''>Select an option</option>
                                  {field.options.map((option, optionIndex) => (
                                    <option key={optionIndex} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  type='button'
                                  className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm ms-2'
                                  onClick={() => fieldDeleteHandler(field._id)}
                                >
                                  <KTIcon iconName='trash' className='fs-3' />
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      default:
                        return (
                          <div className='col-6' key={index}>
                            <div className='row mb-6'>
                              <label className={`col-lg-4 col-form-label fw-bold fs-6`}>
                                <span className={`${field.mandatory === true ? 'required' : ''}`}>
                                  {field.name}
                                </span>
                              </label>
                              <div className='col-lg-8 d-flex align-items-center'>
                                <input
                                  id={`${field.type}-${index}`}
                                  type={field.type}
                                  className='form-control form-control-lg form-control-solid flex-grow-1'
                                  placeholder={field.name}
                                  value={fieldValues[index]}
                                  onChange={(event) =>
                                    inputChangeHandler(
                                      index,
                                      event.target.value,
                                      field.name,
                                      field.type
                                    )
                                  }
                                />
                                <button
                                  type='button'
                                  className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm ms-2'
                                  onClick={() => fieldDeleteHandler(field._id)}
                                >
                                  <KTIcon iconName='trash' className='fs-3' />
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                    }
                  })}
              </div>
            </form>
          </div>
          {/* ------------------------------- FOOTER STARTS HERE ------------------------------- */}
          <div className='card card-footer'>
            <div className='d-flex justify-content-between'>
              <button
                type='button'
                className='btn btn-info'
                onClick={() => setcontextOpenModal(true)}
              >
                Add Field
              </button>
              <button className='btn btn-primary' onClick={handleSave}>
                Save
              </button>
              <PopUpModal show={contextOpenModal} handleClose={() => setcontextOpenModal(false)}>
                <DynamicFields companyName={data?._id} formId={formId} />
              </PopUpModal>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
