import {useState} from 'react'
import {useCustomFormFieldContext} from '../dynamicForms/CustomFormFieldDataContext'

const AddUserNotes = ({userId}) => {
  const [particulars, setParticulars] = useState('')
  const [dateTime, setDateTime] = useState('')
  const studentNotesCTX = useCustomFormFieldContext()
  // console.log(remainder)
  // console.log(particulars)
  //   console.log(studentNotesCTX.createStudentNoteMutation.isLoading)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!particulars) {
      alert('Please enter a particulars')
      return
    }
    studentNotesCTX.createStudentNoteMutation.mutate({particulars, dateTime, userId: userId})
    setParticulars('')
    setDateTime('')
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
          placeholder='Add Particulars...'
          onChange={(e) => setParticulars(e.target.value)}
        />
      </td>
      <td>
        <input
          type='datetime-local'
          value={dateTime}
          placeholder='DD/MM/YYYY HH:MM'
          onChange={(e) => setDateTime(e.target.value)}
          className='form-control'
        />
      </td>
      <td></td>
      <td>
        <button
          disabled={studentNotesCTX.createStudentNoteMutation.isLoading}
          onClick={handleSubmit}
          type='submit'
          className='btn btn-success'
        >
          {studentNotesCTX.createStudentNoteMutation.isLoading ? 'Adding...' : 'Add'}
        </button>
      </td>
    </tr>
  )
}
export default AddUserNotes
