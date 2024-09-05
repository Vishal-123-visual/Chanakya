import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDynamicFieldContext } from '../DynamicFieldsContext'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import { useCompanyContext } from '../../compay/CompanyContext'
import { useCustomFormFieldContext } from '../dynamicForms/CustomFormFieldDataContext'
import { Formik, Form, Field, FieldArray } from 'formik'

const AddEnquiryForm = () => {
  const params = useParams()
  const { getAllCustomFormFieldDataQuery, getAllAddedFormsName } = useDynamicFieldContext()
  const { createCustomFromFieldValuesMutation } = useCustomFormFieldContext()

  const [selectedFormId, setSelectedFormId] = useState('')
  const [initialValues, setInitialValues] = useState({})

  const { getCompanyLists } = useCompanyContext()

  const formName = getAllAddedFormsName?.data
    ?.filter((company) => company.companyName === params.id)
    .map((form) => form)

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

  const handleFormSelectionChange = (event) => {
    const newFormId = event.target.value
    setSelectedFormId(newFormId)
  }

  useEffect(() => {
    if (selectedFormId) {
      // Fetch the form fields based on selectedFormId and update initial values
      const fields = getAllCustomFormFieldDataQuery.data
        ?.filter((form) => form.formId[form.formId.length - 1] === selectedFormId) || []

      const initialFormValues = fields.reduce((acc, field) => {
        if (field.type === 'checkbox') {
          acc[field.name] = field.options.reduce((optAcc, option) => {
            optAcc[option.value] = false;
            return optAcc;
          }, {});
        } else if (field.type === 'radio') {
          acc[field.name] = '';
        } else if (field.type === 'select') {
          acc[field.name] = '';
        } else {
          acc[field.name] = '';
        }
        return acc;
      }, {});


      setInitialValues(initialFormValues)
    }
  }, [selectedFormId, getAllCustomFormFieldDataQuery.data])

  const generateValidationSchema = () => {
    const fields = getAllCustomFormFieldDataQuery.data
      ?.filter((form) => form.formId[form.formId.length - 1] === selectedFormId) || []

    const shape = {
      Name: Yup.string().required('Name is required'),
      Email: Yup.string().email('Invalid email').required('Email is required'),
      ...fields.reduce((acc, field) => {
        if (field.mandatory) {
          if (field.type === 'checkbox') {
            acc[field.name] = Yup.object().shape(
              Object.fromEntries(Object.keys(initialValues[field.name] || {}).map(option => [
                option,
                Yup.boolean().required('This field is required'),
              ]))
            )
          } else if (field.type === 'radio') {
            acc[field.name] = Yup.string().required('This field is required')
          } else if (field.type === 'select') {
            acc[field.name] = Yup.string().required('This field is required')
          } else {
            acc[field.name] = Yup.string().required('This field is required')
          }
        }
        return acc
      }, {})
    }

    return Yup.object().shape(shape)
  }


  const handleSave = (values) => {
    const formattedValues = Object.keys(values).reduce((acc, key) => {
      if (typeof values[key] === 'object') {
        acc[key] = Object.entries(values[key]).reduce((objAcc, [optionValue, checked]) => {
          if (checked) {
            objAcc.push(optionValue);
          }
          return objAcc;
        }, []);
      } else {
        acc[key] = values[key];
      }
      return acc;
    }, {});

    createCustomFromFieldValuesMutation.mutate({
      ...formattedValues,
      formId: selectedFormId,
      companyId: companyId,
    });
    window.location.reload()
  }


  return (
    <>
      <div className='card mb-5 mb-xl-10'>
        <div
          className='card-header border-0 cursor-pointer'
        >
          <div className='card-title m-0'>
            <h3 className='fw-bolder m-0 w-5'>{`${companyDataNameAndId[0]?.name} -> ${formName?.find(form => form._id === selectedFormId)?.formName || ''}`}</h3>
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
            <Formik
              initialValues={initialValues}
              validationSchema={generateValidationSchema()}
              onSubmit={handleSave}
              enableReinitialize={true}
            >
              {({ errors, touched }) => (
                <Form>
                  <div className='card-body border-top p-9'>
                    <div className='row'>
                      <div className='col-6'>
                        <div className='row mb-6'>
                          <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                            Name
                          </label>
                          <div className='col-lg-6 fv-row'>
                            <Field
                              type='text'
                              name='Name'
                              className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                              placeholder='Name'
                            />
                            {touched.Name && errors.Name && (
                              <div className='fv-plugins-message-container'>
                                <div className='fv-help-block'>{errors.Name}</div>
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
                            <Field
                              type='text'
                              name='Mobile Number'
                              className='form-control form-control-lg form-control-solid'
                              placeholder='Mobile Number'
                            />
                            {touched['Mobile Number'] && errors['Mobile Number'] && (
                              <div className='fv-plugins-message-container'>
                                <div className='fv-help-block'>{errors['Mobile Number']}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='row'>
                      <div className='col-6'>
                        <div className='row mb-6'>
                          <label className='col-lg-4 col-form-label fw-bold fs-6 '>City</label>
                          <div className='col-lg-8 fv-row'>
                            <Field
                              type='text'
                              name='City'
                              className='form-control form-control-lg form-control-solid'
                              placeholder='City'
                            />
                            {touched.City && errors.City && (
                              <div className='fv-plugins-message-container'>
                                <div className='fv-help-block'>{errors.City}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className='col-6'>
                        <div className='row mb-6'>
                          <label className='col-lg-4 col-form-label fw-bold fs-6 required'>Email</label>
                          <div className='col-lg-8 fv-row'>
                            <Field
                              type='email'
                              name='Email'
                              className='form-control form-control-lg form-control-solid'
                              placeholder='Email'
                            />
                            {touched.Email && errors.Email && (
                              <div className='fv-plugins-message-container'>
                                <div className='fv-help-block'>{errors.Email}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
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
                                        className={`col-form-label fw-bold fs-6 ${field.mandatory === true ? 'required' : ''}`}
                                        style={{ whiteSpace: 'nowrap' }}
                                      >
                                        {field.name}
                                      </label>
                                    </div>
                                    <div className='col-lg-8'>
                                      <FieldArray name={field.name}>
                                        {({ push, remove }) => (
                                          <div className='row'>
                                            {field.options.map((option, optionIndex) => (
                                              <div key={optionIndex} className='col-md-6 mb-2 d-flex align-items-center'>
                                                <div className='form-check flex-grow-1'>
                                                  <Field
                                                    type='checkbox'
                                                    name={`${field.name}.${option.value}`}
                                                    className='form-check-input'
                                                  />
                                                  <label className='form-check-label'>{option.label}</label>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </FieldArray>
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
                                        className={`col-form-label fw-bold fs-6 ${field.mandatory === true ? 'required' : ''}`}
                                        style={{ whiteSpace: 'nowrap' }}
                                      >
                                        {field.name}
                                      </label>
                                    </div>
                                    <div className='col-lg-8'>
                                      <div className='row'>
                                        {field.options.map((option, optionIndex) => (
                                          <div key={optionIndex} className='col-md-6 mb-2 d-flex align-items-center'>
                                            <div className='form-check flex-grow-1'>
                                              <Field
                                                type='radio'
                                                name={field.name}
                                                value={option.value}
                                                className='form-check-input'
                                              />
                                              <label
                                                htmlFor={`${field.type}-${index}-${optionIndex}`}
                                                className='form-check-label'
                                              >
                                                {option.label}
                                              </label>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                      {touched[field.name] && errors[field.name] && (
                                        <div className='fv-plugins-message-container'>
                                          <div className='fv-help-block'>{errors[field.name]}</div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );

                            case 'select':
                              return (
                                <div className='col-6' key={index}>
                                  <div className='row mb-6'>
                                    <label className={`col-lg-4 col-form-label fw-bold fs-6`}>
                                      <span className={`${field.mandatory === true ? 'required' : ''}`}>
                                        {field.name}
                                      </span>
                                    </label>
                                    <div className='col-lg-8'>
                                      <Field
                                        as='select'
                                        name={field.name}
                                        className='form-select form-select-solid form-select-lg flex-grow-1'
                                      >
                                        <option value=''>Select an option</option>
                                        {field.options.map((option, optionIndex) => (
                                          <option key={optionIndex} value={option.value}>
                                            {option.label}
                                          </option>
                                        ))}
                                      </Field>
                                      {touched[field.name] && errors[field.name] && (
                                        <div className='fv-plugins-message-container'>
                                          <div className='fv-help-block'>{errors[field.name]}</div>
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
                                    <div className='col-lg-8'>
                                      <Field
                                        type={field.type}
                                        name={field.name}
                                        className='form-control form-control-lg form-control-solid flex-grow-1'
                                        placeholder={field.name}
                                      />
                                      {touched[field.name] && errors[field.name] && (
                                        <div className='fv-plugins-message-container'>
                                          <div className='fv-help-block'>{errors[field.name]}</div>
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
                    <button type='submit' className='btn btn-primary'>
                      Save
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        )}
      </div>
    </>
  )
}

export default AddEnquiryForm
