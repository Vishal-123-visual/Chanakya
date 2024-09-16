import {useState} from 'react'
import {useCustomFormFieldContext} from '../dynamicForms/CustomFormFieldDataContext'

const AddUserNotes = ({userId}) => {
  const [particulars, setParticulars] = useState('')
  const studentNotesCTX = useCustomFormFieldContext()
  //   console.log(studentNotesCTX.createStudentNoteMutation.isLoading)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!particulars) {
      alert('Please enter a particulars')
      return
    }
    studentNotesCTX.createStudentNoteMutation.mutate({particulars, userId: userId})
    setParticulars('')
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
