import {useParams} from 'react-router-dom'
import {useDynamicFieldContext} from '../DynamicFieldsContext'

const EditDynamicFields = ({trainer}) => {
  const {
    handleChange,
    handlePropertyChange,
    handleRemoveOption,
    handleAddOption,
    handleFieldTypeChange,
    handleRadioChange,
    handleCheckboxChange,
    fields,
    setFields,
    newOption,
    setNewOption,
    newOptionIndex,
    setNewOptionIndex,
    useGetSingleCustomFieldById,
    updateFieldMutation,
    setOpenModal,
  } = useDynamicFieldContext()
  const params = useParams()

  const fieldId = useGetSingleCustomFieldById(trainer._id)
  const currentField = fieldId?.data?.customField
  // console.log(fieldId)

  const handleSelectTypeChange = () => {}

  const isAddButtonDisabled =
    !fields[0].name ||
    (['select', 'checkbox', 'radio'].includes(fields[0].type) && fields[0].options.length === 0)

  return (
    <>
      <form className='dynamic-form'>
        <div className='field-container'>
          <select
            className='form-select form-select-solid form-select-lg'
            value={currentField?.type || ''}
            onChange={(event) => {
              handleFieldTypeChange(event.target.value)
              handleFieldTypeChange(event.target.value)
            }}
          >
            <option value='text'>Text Field</option>
            <option value='checkbox'>Checkbox</option>
            <option value='radio'>Radio</option>
            <option value='select'>Select</option>
            <option value='date'>Date</option>
            <option value='number'>Number</option>
            <option value='datetime-local'>DateTime Local</option>
            <option value='textarea'>Textarea</option>
            <option value='url'>URL</option>
            <option value='currency'>Currency</option>
          </select>
          <input
            type='text'
            name='name'
            className='form-control form-control-lg form-control-solid'
            placeholder='Field Name'
            value={currentField?.name || ''}
            onChange={(event) => {
              const values = [...fields]
              values[0].name = event.target.value
              setFields(values)
            }}
          />

          {currentField?.type === 'text' && (
            <input
              type='text'
              name={currentField.name}
              className='form-control form-control-lg form-control-solid'
              placeholder='Field Value'
              value={fields[0]?.value || ''}
              onChange={(event) => handleChange(0, event, fields[0].type)}
            />
          )}

          {currentField?.type === 'checkbox' &&
            currentField?.options &&
            currentField.options.map((option, optionIndex) => (
              <div key={optionIndex} className='position-relative checkbox-option'>
                <input
                  type='checkbox'
                  id={`checkbox-${0}-${optionIndex}`}
                  name={currentField.name}
                  value={option.value}
                  className='form-check-input'
                  checked={Array.isArray(fields[0].value) && fields[0].value.includes(option.value)}
                  onChange={(event) =>
                    handleCheckboxChange(0, option.value, event, currentField.type)
                  }
                />
                <label htmlFor={`checkbox-${0}-${optionIndex}`}>{option.label}</label>
                <i
                  className='bi bi-x-circle position-absolute top-0 end-0 m-2 cursor-pointer'
                  onClick={() => handleRemoveOption(option._id)}
                ></i>
              </div>
            ))}

          {currentField?.type === 'radio' &&
            currentField?.options &&
            currentField.options.map((option, optionIndex) => (
              <div key={optionIndex} className='position-relative radio-option'>
                <input
                  type='radio'
                  id={`radio-${0}-${optionIndex}`}
                  name={currentField.name}
                  value={option.value}
                  className='form-check-input'
                  checked={fields[0].value === option.value}
                  onChange={() => handleRadioChange(0, option.value, currentField.type)}
                />
                <label htmlFor={`radio-${0}-${optionIndex}`}>{option.label}</label>
                <i
                  className='bi bi-x-circle position-absolute end-0 m-2 cursor-pointer'
                  onClick={() => handleRemoveOption(option._id)}
                ></i>
              </div>
            ))}

          {currentField?.type === 'select' && (
            <div>
              <select
                name={currentField.name}
                className='form-select form-select-solid form-select-lg'
                value={fields[0]?.value || ''}
                onChange={(event) => handleChange(0, event, currentField.type)}
              >
                <option value=''>Select an option</option>
                {currentField?.options &&
                  currentField.options.map((option, optionIndex) => (
                    <option key={optionIndex} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </select>
              <div className='mt-2'>
                {currentField.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className='d-flex justify-content-between align-items-center'
                  >
                    <span>{option.label}</span>
                    <i
                      className='bi bi-x-circle cursor-pointer'
                      onClick={() => handleRemoveOption(option._id)}
                    ></i>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentField?.type === 'textarea' && (
            <textarea
              name={currentField.name}
              className='form-control form-control-lg form-control-solid'
              placeholder='Field Value'
              value={fields[0]?.value || ''}
              onChange={(event) => handleChange(0, event, currentField.type)}
            />
          )}

          {currentField?.type === 'url' && (
            <input
              type='url'
              name={currentField.name}
              className='form-control form-control-lg form-control-solid'
              placeholder='Field Value'
              value={fields[0]?.value || ''}
              onChange={(event) => handleChange(0, event, currentField.type)}
            />
          )}

          {currentField?.type === 'currency' && (
            <input
              type='number'
              step='0.01'
              name={currentField.name}
              className='form-control form-control-lg form-control-solid'
              placeholder='Field Value'
              value={fields[0]?.value || ''}
              onChange={(event) => handleChange(0, event, currentField.type)}
            />
          )}

          {currentField?.type === 'date' && (
            <input
              type='date'
              name={currentField.name}
              className='form-control form-control-lg form-control-solid'
              value={fields[0]?.value || ''}
              onChange={(event) => handleChange(0, event, currentField.type)}
            />
          )}

          {currentField?.type === 'number' && (
            <input
              type='number'
              name={currentField.name}
              className='form-control form-control-lg form-control-solid'
              value={fields[0]?.value || ''}
              onChange={(event) => handleChange(0, event, currentField.type)}
            />
          )}

          {currentField?.type === 'datetime-local' && (
            <input
              type='datetime-local'
              name={currentField.name}
              className='form-control form-control-lg form-control-solid'
              value={fields[0]?.value || ''}
              onChange={(event) => handleChange(0, event, currentField.type)}
            />
          )}

          {['checkbox', 'radio', 'select'].includes(currentField?.type) && (
            <div>
              <input
                type='text'
                placeholder='New Option'
                value={newOptionIndex === 0 ? newOption : ''}
                onChange={(event) => {
                  setNewOption(event.target.value)
                  setNewOptionIndex(0)
                }}
                className='form-control form-control-lg form-control-solid mt-2'
              />
              <button
                type='button'
                onClick={() => handleAddOption(currentField?.options?._id)}
                className='btn btn-primary mt-2'
              >
                <i className='bi bi-plus-circle'></i> Add Option
              </button>
            </div>
          )}
          <div className='field-properties'>
            <h4 className='text-center mb-4'>Enable / Disable field properties</h4>
            <div className='d-flex flex-wrap gap-3'>
              <div className='form-check'>
                <input
                  type='checkbox'
                  id={`mandatory-${0}`}
                  checked={currentField?.mandatory || false}
                  onChange={() => handlePropertyChange(0, 'mandatory')}
                  className='form-check-input'
                />
                <label htmlFor={`mandatory-${0}`} className='form-check-label'>
                  Mandatory Field
                </label>
              </div>
            </div>
          </div>
        </div>

        <button
          type='submit'
          disabled={isAddButtonDisabled}
          className='btn btn-primary btn-lg mt-4'
        >
          Update
        </button>
      </form>
    </>
  )
}

export default EditDynamicFields
