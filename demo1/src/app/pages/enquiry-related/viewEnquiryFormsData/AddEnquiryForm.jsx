import {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {useDynamicFieldContext} from '../DynamicFieldsContext'
import {useCompanyContext} from '../../compay/CompanyContext'
import {useCustomFormFieldContext} from '../dynamicForms/CustomFormFieldDataContext'

const AddEnquiryForm = () => {
  const [isTouched, setIsTouched] = useState(false)
  const params = useParams()
  const {getAllCustomFormFieldDataQuery, getAllAddedFormsName, fields} = useDynamicFieldContext()
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
    createCustomFromFieldValuesMutation,
  } = useCustomFormFieldContext()

  const [selectedFormId, setSelectedFormId] = useState('')

  const inputChangeHandler = (index, event, fieldName, type) => {
    handleInputChange(index, event, fieldName, type)
  }
  const checkboxChangeHandler = (index, optionValue, event, fieldName, type) => {
    handleCheckboxChange(index, optionValue, event, fieldName, type)
  }
  const radioChangeHandler = (index, event, fieldName, type, optionValue) => {
    handleOptionChange(index, event, fieldName, type, optionValue)
  }

  // console.log(selectedFormId)

  // const selectChangeHandler = (index, event, fieldName, type) => {
  //   handleSelectChange(index, event, fieldName, type)
  // }

  const {getCompanyLists} = useCompanyContext()

  const formName = getAllAddedFormsName?.data
    ?.filter((company) => company.companyName === params.id)
    .map((form) => form)
  // console.log(formName)

  const companyDataNameAndId =
    getCompanyLists?.data
      ?.filter((company) => company._id === params.id)
      ?.map((companyData) => ({
        name: companyData.companyName,
        id: companyData._id,
      })) || []

  const companyId =
    companyDataNameAndId.length > 0
      ? getCompanyLists?.data
          ?.filter((companyNameById) => companyNameById?._id === companyDataNameAndId[0]?.id)
          .map((company) => company._id)
      : []

  const formNameById = getAllAddedFormsName?.data
    ?.filter((formId) => formId._id === selectedFormId)
    .map((form) => form.formName)
  // console.log(formNameById)

  const handleChange = (event) => {
    const {name, value} = event.target
    setInput((prevInput) => ({...prevInput, [name]: value}))
    setFormData((prev) => ({...prev, [name]: value}))
  }

  const handleBlur = () => {
    setIsTouched(true)
  }

  const handleSave = (event) => {
    event.preventDefault()
    createCustomFromFieldValuesMutation.mutate({
      ...formData,
      formId: selectedFormId,
      companyId: companyId,
    })
    window.location.reload()
  }

  const handleFormSelectionChange = (event) => {
    const newFormId = event.target.value
    setSelectedFormId(newFormId)
  }

  useEffect(() => {
    if (selectedFormId) {
      // Fetch or update form fields based on selectedFormId
    }
  }, [selectedFormId])

  // const select = fields?.map((value) => value)
  // console.log(select)

  return (
    <>
      <div className='card mb-5 mb-xl-10'>
        <div className='card-header border-0 cursor-pointer'>
          <div className='card-title m-0'>
            <h3 className='fw-bolder m-0 w-5'>{`${companyDataNameAndId[0]?.name} -> ${formNameById}   `}</h3>
          </div>
          <div className='d-flex justify-content-end'>
            <select
              className='form-select form-select-solid form-select-lg'
              onChange={handleFormSelectionChange}
              value={selectedFormId}
            >
              <option value=''>Select a form</option>
              {formName?.map((form) => (
                <option key={form._id} value={form._id}>
                  {form.formName}
                </option>
              ))}
            </select>
          </div>
        </div>
        {selectedFormId && (
          <div id='kt_account_profile_details' className='collapse show'>
            <form>
              <div className='card-body border-top p-9'>
                <>
                  <div className='row'>
                    <div className='col-6'>
                      <div className='row mb-6'>
                        <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                          Name
                        </label>
                        <div className='col-lg-6 fv-row'>
                          <input
                            type='text'
                            className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                            placeholder='Name'
                            name='Name'
                            value={input.Name || ''}
                            onClick={() => setIsTouched(true)}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {!input.Name && isTouched && (
                            <div className='fv-plugins-message-container mx-5'>
                              <div className='fv-help-block' style={{whiteSpace: 'nowrap'}}>
                                Name is required!
                              </div>
                            </div>
                          )}
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
                            value={input['Mobile Number'] || ''}
                            onChange={handleChange}
                            onClick={() => setIsTouched(true)}
                            onBlur={handleBlur}
                          />
                          {!input['Mobile Number'] && isTouched && (
                            <div className='fv-plugins-message-container mx-5'>
                              <div className='fv-help-block' style={{whiteSpace: 'nowrap'}}>
                                Mobile Number is required!
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-6'>
                      <div className='row mb-6'>
                        <label className='col-lg-4 col-form-label fw-bold fs-6'>City</label>
                        <div className='col-lg-8 fv-row'>
                          <input
                            type='text'
                            className='form-control form-control-lg form-control-solid'
                            placeholder='City'
                            name='City'
                            value={input.City || ''}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='col-6'>
                      <div className='row mb-6'>
                        <label className='col-lg-4 col-form-label fw-bold fs-6'>Email</label>
                        <div className='col-lg-8 fv-row'>
                          <input
                            type='email'
                            className='form-control form-control-lg form-control-solid'
                            placeholder='Email'
                            name='Email'
                            value={input.Email || ''}
                            onChange={handleChange}
                            onClick={() => setIsTouched(true)}
                            onBlur={handleBlur}
                          />
                          {!input.Email && isTouched && (
                            <div className='fv-plugins-message-container mx-5'>
                              <div className='fv-help-block' style={{whiteSpace: 'nowrap'}}>
                                Email is required!
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>

                {/* Dynamically render form fields based on selected form ID */}
                <div className='row'>
                  {getAllCustomFormFieldDataQuery.data
                    ?.filter((form) => form.formId[form.formId.length - 1] === selectedFormId)
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
                                            onBlur={handleBlur}
                                            onClick={() => setIsTouched(true)}
                                            className='form-check-input'
                                          />
                                          <label className='form-check-label'>{option.label}</label>
                                        </div>
                                        {/* Display the delete button only for the last option */}
                                      </div>
                                    ))}
                                    {!field.value === true &&
                                      field.mandatory === true &&
                                      isTouched && (
                                        <div className='fv-plugins-message-container mx-5'>
                                          <div
                                            className='fv-help-block'
                                            style={{whiteSpace: 'nowrap'}}
                                          >
                                            {`${field.name} is Required`}
                                          </div>
                                        </div>
                                      )}
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
                                            onBlur={handleBlur}
                                            onClick={() => setIsTouched(true)}
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
                                      </div>
                                    ))}
                                    {!field.value && field.mandatory === true && isTouched && (
                                      <div className='fv-plugins-message-container mx-5'>
                                        <div
                                          className='fv-help-block'
                                          style={{whiteSpace: 'nowrap'}}
                                        >
                                          {`${field.name} is Required`}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        case 'select':
                          return (
                            <div className='col-6' key={index}>
                              <div className='row mb-6'>
                                <div className='col-lg-4 d-flex align-items-center'>
                                  <label
                                    className={`col-form-label fw-bold fs-6 ${
                                      field.mandatory ? 'required' : ''
                                    }`}
                                  >
                                    {field.name}
                                  </label>
                                </div>
                                <div className='col-lg-8 d-flex flex-column'>
                                  <select
                                    id={`${field.type}-${index}`}
                                    name={field.name}
                                    className='form-select form-select-solid form-select-lg flex-grow-1'
                                    value={field.selectValue}
                                    onBlur={handleBlur}
                                    onClick={() => setIsTouched(true)}
                                    onChange={(event) => {
                                      // console.log(event.target.value)
                                      handleSelectChange(index, event, field.name, field.type)
                                    }}
                                  >
                                    <option value=''>Select an option</option>
                                    {field.options.map((option, optionIndex) => (
                                      <option key={optionIndex} value={option.value}>
                                        {option.value} {/* Display the option label or value */}
                                      </option>
                                    ))}
                                  </select>
                                  {/* Error message displayed below the select field */}
                                  {isTouched && field.mandatory === true && !field.selectValue && (
                                    <div className='fv-plugins-message-container mt-2'>
                                      <div className='fv-help-block' style={{whiteSpace: 'nowrap'}}>
                                        {`${field.name} is required!`}
                                      </div>
                                    </div>
                                  )}
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
                                    onBlur={handleBlur}
                                    onClick={() => setIsTouched(true)}
                                  />
                                  {!fieldValues[index] && field.mandatory === true && isTouched && (
                                    <div className='fv-plugins-message-container mx-5'>
                                      <div className='fv-help-block' style={{whiteSpace: 'nowrap'}}>
                                        {`${field.name} is Required`}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                      }
                    })}
                </div>
              </div>
              <div className='card-footer d-flex justify-content-end py-6 px-9'>
                <button type='button' onClick={handleSave} className='btn btn-primary'>
                  Save
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  )
}

export default AddEnquiryForm
