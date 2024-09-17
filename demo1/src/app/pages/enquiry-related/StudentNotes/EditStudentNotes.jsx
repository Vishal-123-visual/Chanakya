import {useState} from 'react'
import {useCustomFormFieldContext} from '../dynamicForms/CustomFormFieldDataContext'

const EditStudentNotes = ({studentNote, studentNoteData, setEditStudentNoteId}) => {
  const [particulars, setParticulars] = useState(studentNoteData.particulars)
  const [dateTime, setDateTime] = useState(studentNoteData.dateTime)
  const studentNoteCTX = useCustomFormFieldContext()
  // const studentIssueCTX = useCompanyContext()
  //console.log(studentIssueCTX.useUpdateStudentIssueMutation.isLoading)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!particulars) {
      alert('Please enter a particulars')
      return
    }
    studentNoteCTX.useUpdateStudentNoteMutation.mutate({
      particulars,
      dateTime,
      studentId: studentNote,
      id: studentNoteData._id,
    })
    setParticulars('')
    setEditStudentNoteId(null)
  }

  return (
    <tr>
      <td></td>
      <td></td>
      <td></td>
      <td>
        <input
          type='text'
          className='form-control'
          value={particulars}
          onChange={(e) => setParticulars(e.target.value)}
        />
      </td>
      <td>
        <input
          type='datetime-local'
          value={dateTime}
          placeholder='DD/MM/YYYY'
          onChange={(e) => setDateTime(e.target.value)}
          className='form-control'
        />
      </td>
      <td>
        <div className='d-flex justify-content-end flex-shrink-0'>
          <button
            disabled={studentNoteCTX.useUpdateStudentNoteMutation.isLoading}
            onClick={handleSubmit}
            type='submit'
            className='btn  btn-bg-dark btn-color-primary btn-active-color-info  me-1'
          >
            {studentNoteCTX.useUpdateStudentNoteMutation.isLoading ? 'Editing...' : 'Edit'}
          </button>
          <button
            onClick={() => setEditStudentNoteId(null)}
            className='btn btn-bg-dark btn-color-primary btn-active-color-info '
          >
            cancel
          </button>
        </div>
      </td>
    </tr>
  )
}
export default EditStudentNotes
