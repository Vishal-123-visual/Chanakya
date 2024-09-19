import React, {useState, useEffect} from 'react'
import {toast} from 'react-toastify'
import {KTIcon} from '../../../../_metronic/helpers'
import {useCustomFormFieldContext} from '../dynamicForms/CustomFormFieldDataContext'
import {useNavigate, useParams} from 'react-router-dom'
import {useDynamicFieldContext} from '../DynamicFieldsContext'
import {useCompanyContext} from '../../compay/CompanyContext'
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd'
import PopUpModal from '../../../modules/accounts/components/popUpModal/PopUpModal'
import UpdateFormData from '../dynamicForms/UpdateFormData'
import OnlyViewFormData from '../dynamicForms/OnlyViewFormData'

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

const reorderRows = (rows, reorderedColumns) => {
  return rows.map((row) => {
    const reorderedFields = reorderedColumns.map((colName) =>
      row.fields.find((field) => field.name === colName)
    )
    return {
      ...row,
      fields: reorderedFields.filter(Boolean), // Filter out undefined fields
    }
  })
}

const grid = 8

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  background: isDragging ? 'grey' : 'white',
  ...draggableStyle,
})

export default function ViewAllEnquiryFormsData() {
  const navigate = useNavigate()
  const {
    getAllFormsFieldValue,
    deleteFormDataMutation,
    useSaveReorderedColumns,
    useSaveReorderedRows,
    getReorderedColumnData,
    getReorderedRowData,
    deleteReorderedColumnsMutation,
    deleteSingleRowDataMutation,
  } = useCustomFormFieldContext()
  const {
    getAllAddedFormsName,
    openModal: contextOpenModal,
    setOpenModal: setcontextOpenModal,
  } = useDynamicFieldContext()
  const companyCTX = useCompanyContext()
  const params = useParams()
  const companyId = params?.id

  // const {data} = getAllFormsFieldValue

  // const singleFormFieldId = data?.formFieldValues
  // console.log(singleFormFieldId)

  // console.log(useReorderedRowData)
  // console.log(object)

  const {data: companyInfo} = companyCTX?.useGetSingleCompanyData(companyId)
  const [selectedFormId, setSelectedFormId] = useState('')
  const [selectId, setSelectId] = useState(null)
  const [viewSelectId, setViewSelectId] = useState(null)
  const [modalMode, setModalMode] = useState('view')
  const [filteredData, setFilteredData] = useState([])
  const [formOptions, setFormOptions] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [uniqueFieldNames, setUniqueFieldNames] = useState([])

  // Hooks for saving reordered columns and rows
  const saveReorderedColumns = useSaveReorderedColumns()
  const saveReorderedRows = useSaveReorderedRows()

  useEffect(() => {
    const fetchData = async () => {
      const forms = getAllAddedFormsName?.data
        ?.filter((form) => form.companyName === companyId)
        .map((form) => ({
          id: form._id,
          name: form.formName,
        }))

      setFormOptions(forms || [])

      if (forms?.length > 0) {
        if (!selectedFormId) {
          setSelectedFormId(forms[0].id)
        }

        const filteredFormData = getAllFormsFieldValue?.data?.formFieldValues
          ?.filter(
            (formData) => formData.companyId === companyId && formData.formId === selectedFormId
          )
          .map((formData) => ({
            id: formData._id,
            fields: formData.formFiledValue,
          }))

        setFilteredData(filteredFormData || [])

        if (filteredFormData?.length > 0) {
          const allFields = filteredFormData
            .map((entry) => entry.fields.filter((form) => form.name !== 'companyId'))
            .flat()

          const uniqueNames = Array.from(new Set(allFields?.map((field) => field.name)))
          setUniqueFieldNames(uniqueNames)
        } else {
          setUniqueFieldNames([])
        }
      } else {
        setSelectedFormId('')
        setFilteredData([])
        setUniqueFieldNames([])
      }
    }

    fetchData()
  }, [selectedFormId, getAllFormsFieldValue, getAllAddedFormsName, companyId])

  const viewFormDataModal = (rowId) => {
    setModalMode('view')
    setViewSelectId(rowId)
    setcontextOpenModal(true)
  }
  const openEditFormData = (rowId) => {
    // console.log(field)
    setModalMode('edit')
    setSelectId(rowId)
    setcontextOpenModal(true)
  }

  const fetchUpdatedData = async () => {
    if (selectedFormId && companyId) {
      try {
        // Fetch all the rowData
        const allRowData = getReorderedRowData?.data?.rowData || []
        // console.log(allRowData);
        // Ensure that allRowData is an array
        if (!Array.isArray(allRowData)) {
          // console.error('Expected rowData to be an array, but got:', typeof allRowData)
          return
        }

        // console.log('All Row Data:', allRowData)

        // Filter the rowData based on the selected formId and companyId
        const filteredRowData = allRowData.filter(
          (form) => form.formId === selectedFormId && form.companyId === companyId
        )

        // If no data is found, log a warning and return early
        if (filteredRowData.length === 0) {
          // console.warn('No data found for the given formId and companyId.')
          return
        }

        // Map the filteredRowData to extract relevant fields
        const updatedFilteredFormData = filteredRowData.map((row) => ({
          id: row?._id,
          fields: row.rows ? row?.rows?.flatMap((r) => r?.fields || []) : [],
        }))
        // console.log(updatedFilteredFormData)
        // Log the updated filtered form data for debugging
        // console.log('Updated Filtered Form Data:', updatedFilteredFormData)

        // Extract all fields, filtering out the 'companyId' field
        const allFields = updatedFilteredFormData
          .flatMap((entry) => entry?.fields)
          .filter((field) => field?.name !== 'companyId')
        // console.log(allFields)
        // Create a set of unique field names
        const uniqueNames = Array.from(new Set(allFields.map((field) => field?.name)))

        // Log unique field names for debugging
        // console.log('Unique Field Names:', uniqueNames)
        // setFilteredData(updatedFilteredFormData)
        setUniqueFieldNames(uniqueNames)
        // console.log(uniqueNames)
        // No further actions, just reading and logging data
      } catch (error) {
        // Show an error toast if something goes wrong
        // toast.error(`Error fetching updated data: ${error.message}`)
      }
    }
  }

  const allRowData = getReorderedRowData?.data?.rowData
    ?.filter((form) => form.formId === selectedFormId)
    ?.map((id) => id._id)
  // console.log(allRowData)

  let allRowsId
  if (allRowData && allRowData.length > 0) {
    allRowsId = allRowData[0]
  } else {
    // console.warn('allRowData is undefined or empty')
    // allRowsId = null // or set a default value
  }

  // console.log(allRowsId)

  const allColumnsData = getReorderedColumnData?.data?.columnData
    ?.filter((form) => form.formId === selectedFormId)
    ?.map((id) => id._id)
  // Store the first element in a variable if it exists
  let firstColumnData

  if (allColumnsData && allColumnsData.length > 0) {
    firstColumnData = allColumnsData[0]
  } else {
    // console.warn('allColumnsData is undefined or empty')
    firstColumnData = null // or set a default value
  }

  // console.log(firstColumnData)

  useEffect(() => {
    fetchUpdatedData()
  }, [
    selectedFormId,
    companyId,
    getAllFormsFieldValue,
    getReorderedColumnData,
    getReorderedRowData,
  ])

  const formDataDeleteHandler = (formDataId) => {
    // if (!window.confirm('Are you sure you want to delete this Form Data?')) {
    //   return
    // }

    deleteFormDataMutation.mutate(formDataId, {
      onSuccess: () => {
        toast.success('Form Data deleted successfully!')

        // Remove the deleted data from the filtered data
        const updatedFilteredData = filteredData.filter((item) => item.id !== formDataId)
        setFilteredData(updatedFilteredData)

        // If no data is left for the selected form, you can either keep it or switch forms
        if (updatedFilteredData.length === 0) {
          // Option 1: Keep the selected form even if it's empty
          setSelectedFormId(selectedFormId)
          setFilteredData([])

          // Option 2: Switch to another form if no data is left (uncomment below to use this)
          // const remainingForms = formOptions.filter((form) => form.id !== selectedFormId)
          // if (remainingForms.length > 0) {
          //   setSelectedFormId(remainingForms[0].id)
          // } else {
          //   setSelectedFormId('')
          // }
        }
      },
      onError: (error) => {
        // toast.error(`Error deleting Data: ${error.message}`)
      },
    })
  }

  // const columnsDeleteHandler = (columnsId) => {
  //   deleteReorderedColumnsMutation.mutate(columnsId, {
  //     onSuccess: () => {
  //       // toast.success('Field deleted successfully!')
  //     },
  //     onError: (error) => {
  //       toast.error(`Error deleting form: ${error.message}`)
  //     },
  //   })
  // }

  const filteredGroupedData = filteredData
    ?.map((entry) => ({
      id: entry.id,
      fields: entry.fields.filter((field) => field.name !== 'companyId'),
    }))
    ?.filter((rowData) =>
      rowData.fields.some((field) => {
        return (
          searchValue.trim() === '' ||
          (typeof field.value === 'string' &&
            field.value.toLowerCase().includes(searchValue.toLowerCase()))
        )
      })
    )
  // const formRowDataBeforeDragging = filteredGroupedData?.map((rowData) => rowData.id)
  // console.log(formRowDataBeforeDragging)

  const rowsDeleteHandler = (rowsId, columnsId, formDataId) => {
    if (!window.confirm('Are you sure you want to delete All this Row Fields?')) {
      return
    }
    deleteSingleRowDataMutation.mutate(rowsId, {
      onSuccess: () => {
        toast.success('Field deleted successfully!')
      },
      onError: (error) => {
        // toast.error(`Error deleting form: ${error.message}`)
      },
    })

    deleteReorderedColumnsMutation.mutate(columnsId, {
      onSuccess: () => {
        // toast.success('Field deleted successfully!')
      },
      onError: (error) => {
        // toast.error(`Error deleting form: ${error.message}`)
      },
    })

    const formDataIds = filteredData.map((item) => item.id)

    formDataIds.forEach((formDataId) => {
      deleteFormDataMutation.mutate(formDataId, {
        onSuccess: () => {
          toast.success(`All Form Field Data Deleted SuccessFully !!`)

          // Remove the deleted data from the filtered data
          const updatedFilteredData = filteredData.filter((item) => item.id !== formDataId)
          setFilteredData(updatedFilteredData)

          // If no data is left for the selected form, update the state accordingly
          if (updatedFilteredData.length === 0) {
            setSelectedFormId('')
            setFilteredData([])
            setUniqueFieldNames([])
          }
        },
        onError: (error) => {
          // toast.error(`Error deleting Data: ${error.message}`)
        },
      })
    })
  }

  const onDragEnd = async (result) => {
    const {source, destination, type} = result

    if (!destination) return

    if (type === 'COLUMN') {
      // Reorder columns
      const reorderedColumns = reorder(uniqueFieldNames, source.index, destination.index)
      const reorderedRows = reorderRows(filteredGroupedData, reorderedColumns)

      try {
        // Save all rows with the new column order
        await saveReorderedRows.mutateAsync({
          formId: selectedFormId,
          companyId: companyId,
          reorderedRows: reorderedRows,
        })

        // Save reordered columns
        await saveReorderedColumns.mutateAsync({
          formId: selectedFormId,
          companyId: companyId,
          reorderedColumns,
        })

        // Refetch data to ensure the state is in sync with the backend
        await fetchUpdatedData()

        toast.success('Reordered columns and rows saved and updated successfully!')
      } catch (error) {
        // toast.error(`Error saving reordered columns and rows: ${error.message}`)
      }
    }
  }
  // console.log(filteredGroupedData)

  return (
    <div className='card'>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>All Enquiry Forms</span>
        </h3>
        {formOptions?.length > 0 && (
          <>
            <div className='search-bar'>
              <input
                type='text'
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className='form-control'
                placeholder='Search'
              />
            </div>
            <div className='d-flex justify-content-center'>
              <select
                className='form-select form-select-solid form-select-lg'
                onChange={(e) => setSelectedFormId(e.target.value)}
                value={selectedFormId}
              >
                {formOptions?.map((form) => (
                  <option key={form?.id} value={form?.id}>
                    {form?.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>
      <div className='card-body py-3'>
        <div className='table-responsive'>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId='droppable-columns' direction='horizontal' type='COLUMN'>
              {(provided) => (
                <table
                  className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4 '
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <thead>
                    {filteredGroupedData.length > 0 ? (
                      <div className='d-flex justify-content-start flex-shrink-0'>
                        <a
                          className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm'
                          onClick={() =>
                            rowsDeleteHandler(
                              allRowsId,
                              firstColumnData
                              // formRowDataBeforeDragging
                            )
                          }
                        >
                          <KTIcon iconName='trash' className='fs-2' />
                        </a>
                      </div>
                    ) : (
                      ''
                    )}
                    <tr className='fw-bold text-muted'>
                      <th>
                        <div className='form-check form-check-sm form-check-custom form-check-solid'>
                          <input
                            className='form-check-input widget-9-check'
                            type='checkbox'
                            value='1'
                          />
                        </div>
                      </th>
                      {uniqueFieldNames.length > 0 && (
                        <th className='min-w-100px text-start'>Actions</th>
                      )}
                      {/* <th className='w-25px'></th> */}
                      {uniqueFieldNames.map((fieldName, index) => (
                        <Draggable key={fieldName} draggableId={fieldName} index={index}>
                          {(provided, snapshot) => {
                            // Check if the fieldName is "Name" or "Mobile" and apply fixed styles
                            const isFixedColumn =
                              fieldName === 'Name' || fieldName === 'Mobile Number'

                            // Define custom styles for fixed columns
                            const fixedStyles =
                              fieldName === 'Name'
                                ? {left: 0, zIndex: 2, position: 'sticky', background: 'white'}
                                : {
                                    left: '150px',
                                    zIndex: 2,
                                    position: 'sticky',
                                    background: 'white',
                                  }

                            // Merge custom styles for "Name" and "Mobile"
                            const mergedStyles = isFixedColumn
                              ? {
                                  ...getItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                  ),
                                  ...fixedStyles,
                                }
                              : getItemStyle(snapshot.isDragging, provided.draggableProps.style)

                            return (
                              <th
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={mergedStyles}
                                className={`min-w-150px ${isFixedColumn ? 'fixed-column' : ''}`}
                              >
                                {fieldName}
                              </th>
                            )
                          }}
                        </Draggable>
                      ))}
                    </tr>
                  </thead>
                  <tbody id='droppableId'>
                    {filteredGroupedData.length > 0 ? (
                      filteredGroupedData?.map((rowData) => (
                        <tr key={rowData?.id}>
                          <td>
                            <div className='form-check form-check-sm form-check-custom form-check-solid'>
                              <input
                                className='form-check-input widget-9-check'
                                type='checkbox'
                                value='1'
                              />
                            </div>
                          </td>
                          <td>
                            {' '}
                            <div className='d-flex justify-content-start flex-shrink-0'>
                              <a
                                className='btn btn-icon btn-bg-light btn-active-color-info btn-sm me-1'
                                onClick={() => viewFormDataModal(rowData.id)}
                              >
                                <KTIcon iconName='eye' className='fs-3' />
                              </a>
                              <a
                                onClick={() => openEditFormData(rowData.id)}
                                className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                              >
                                <KTIcon iconName='pencil' className='fs-3' />
                              </a>
                              <a
                                className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm'
                                onClick={() => {
                                  // console.log(rowData.id)
                                  formDataDeleteHandler(rowData.id)
                                }}
                              >
                                <KTIcon iconName='trash' className='fs-3' />
                              </a>
                            </div>
                          </td>
                          {uniqueFieldNames.map((fieldName) => {
                            const fieldData = rowData.fields.find(
                              (field) => field.name === fieldName
                            )

                            // Check if the field is "Name" or "Mobile"
                            const isFixedField =
                              fieldName === 'Name' || fieldName === 'Mobile Number'

                            return (
                              <td
                                onClick={() =>
                                  fieldData && fieldData.name === 'Name'
                                    ? openEditFormData(rowData.id)
                                    : ''
                                }
                                key={fieldName}
                                className={`cursor-pointer ${isFixedField ? 'fixed-column' : ''}`}
                                style={
                                  isFixedField
                                    ? {
                                        position: 'sticky',
                                        left: fieldName === 'Name' ? '0' : '150px',
                                        zIndex: 1,
                                        backgroundColor: 'white',
                                      }
                                    : {}
                                }
                              >
                                {fieldData
                                  ? typeof fieldData?.value === 'object'
                                    ? Object.keys(fieldData.value).map((key) => (
                                        <span key={key}>{fieldData?.value[key]} </span>
                                      ))
                                    : fieldData?.value
                                  : ''}
                              </td>
                            )
                          })}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={uniqueFieldNames.length + 2} className='text-center'>
                          No Data Found
                        </td>
                      </tr>
                    )}
                    {/* Placeholder added here */}
                    {provided.placeholder}
                  </tbody>
                </table>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
      <PopUpModal show={contextOpenModal} handleClose={() => setcontextOpenModal(false)}>
        {modalMode === 'view' && (
          <OnlyViewFormData
            setOpenModal={setcontextOpenModal}
            openEditFormData={openEditFormData}
            rowId={viewSelectId}
          />
        )}
        {modalMode === 'edit' && (
          <UpdateFormData setOpenModal={setcontextOpenModal} rowId={selectId} />
        )}
      </PopUpModal>
    </div>
  )
}
