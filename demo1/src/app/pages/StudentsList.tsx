import React, {useState} from 'react'
import {KTIcon} from '../../_metronic/helpers'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {useAdmissionContext} from '../modules/auth/core/Addmission'
import moment from 'moment'
import {useCompanyContext} from './compay/CompanyContext'
import useUserRoleAccessContext from './userRoleAccessManagement/UserRoleAccessContext'
import {useAuth} from '../modules/auth'

const BASE_URL = process.env.REACT_APP_BASE_URL
const BASE_URL_Image = `${BASE_URL}/api/images`

type Props = {
  className: string
}

const StudentsList: React.FC<Props> = ({className}) => {
  const {currentUser} = useAuth()
  const [searchValue, setSearchValue] = useState('')
  const [sortOption, setSortOption] = useState('DOJ') // Default sort by Date of Joining (DOJ)
  const ctx = useAdmissionContext()
  const companyCTX = useCompanyContext()
  const params = useParams()
  const navigate = useNavigate()
  const {data: singleComapnyData} = companyCTX?.useGetSingleCompanyData(params?.id)
  const {getAllUserAccessRoleData} = useUserRoleAccessContext()

  const userRoleAccess = getAllUserAccessRoleData?.data?.roleAccessData
  // console.log(userRoleAccess)
  // console.log(currentUser)

  const dorpOutStudentHandler = (dropOutStudent, isDropOutStudent) => {
    if (!window.confirm('Are you sure do you want to drop out this student!')) {
      return
    }
    ctx.updateDropOutStudentMutation.mutate({studentId: dropOutStudent._id, isDropOutStudent})
  }

  const studentDeleteHandler = (studentId: string) => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return
    }
    ctx.deleteStudentMutation.mutateAsync(studentId)
  }

  const searchValueHandler = (value: string) => {
    setSearchValue(value)
  }

  const countStudentCompanyWise = ctx.studentsLists?.data?.users?.filter(
    (c: any) => params?.id === c?.companyName && c.dropOutStudent === false
  )

  const sortStudents = (students: any[], option: string) => {
    if (!Array.isArray(students)) return [] // Ensure students is an array
    return [...students].sort((a, b) => {
      if (option === 'Name') {
        return a.name.localeCompare(b.name)
      } else if (option === 'Course') {
        return a.select_course.localeCompare(b.select_course) // Sort by course instead of email
      } else if (option === 'DOJ') {
        return new Date(b.date_of_joining).getTime() - new Date(a.date_of_joining).getTime() // Sort by Date of Joining, newest first
      }
      return 0
    })
  }

  const filteredStudents =
    ctx.studentsLists?.data?.users
      ?.filter((c: any) => params?.id === c?.companyName && c.dropOutStudent === false)
      ?.filter(
        (searchStudent: any) =>
          searchValue.trim() === '' ||
          searchStudent?.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          searchStudent?.select_course.toLowerCase().includes(searchValue.toLowerCase())
      ) || [] // Fallback to empty array if undefined

  const sortedStudents = sortStudents(filteredStudents, sortOption)

  return (
    <div className={`card ${className}`}>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>{singleComapnyData?.companyName}</span>
          <span className='card-label fw-bold fs-3 mb-1'>
            Students {countStudentCompanyWise?.length}
          </span>
        </h3>
        <div className='search-bar'>
          <input
            type='text'
            value={searchValue}
            onChange={(e) => searchValueHandler(e.target.value)}
            className='form-control'
            placeholder='Search Student'
          />
        </div>
        <div className='search-bar'>
          <select
            name='sorting'
            className='form-select mx-3'
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)} // Set selected sorting option
          >
            <option value='Name'>Name</option>
            <option value='Course'>Course</option>
            <option value='DOJ'>Date of Joining</option> {/* Default sorting by DOJ */}
          </select>
        </div>
        <div
          className='card-toolbar'
          data-bs-toggle='tooltip'
          data-bs-placement='top'
          data-bs-trigger='hover'
          title='Click to add a user'
        >
          {userRoleAccess?.some(
            (userAccess: any) =>
              userAccess.studentControlAccess['Add Student'] === true &&
              userAccess.role === currentUser?.role
          ) && (
            <button
              className='btn btn-sm btn-light-primary'
              onClick={() => navigate(`/addmission-form/${singleComapnyData?._id}`)}
            >
              <KTIcon iconName='plus' className='fs-3' />
              Add New Student
            </button>
          )}
        </div>
      </div>
      <div className='card-body py-3'>
        <div className='table-responsive'>
          <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
            <thead>
              <tr className='fw-bold text-muted'>
                <th className='min-w-150px'>Name</th>
                <th className='min-w-140px'>Mobile Number</th>
                <th className='min-w-120px'>D.O.J</th>
                {userRoleAccess?.some(
                  (userAccess: any) =>
                    (userAccess.studentControlAccess['Edit Student'] === true ||
                      userAccess.studentControlAccess['Delete Student'] === true ||
                      userAccess.studentControlAccess['Dropout Student'] === true) &&
                    userAccess.role === currentUser?.role
                ) && <th className='min-w-100px text-end'>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {sortedStudents.length > 0 ? (
                sortedStudents.map((student: any) => (
                  <tr key={student._id}>
                    <td>
                      <div className='d-flex align-items-center'>
                        <div className='symbol symbol-45px me-5'>
                          <img src={`${BASE_URL_Image}/${student?.image}`} alt='' />
                        </div>
                        <div className='d-flex justify-content-start flex-column'>
                          <div
                            onClick={() => navigate(`/profile/student/${student?._id}`)}
                            style={{cursor: 'pointer'}}
                            className='text-dark fw-bold text-hover-primary fs-6'
                          >
                            {student?.name}
                          </div>
                          <span className='text-muted fw-semibold text-muted d-block fs-7'>
                            {student?.select_course}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div
                        onClick={() => navigate(`/profile/student/${student?._id}`)}
                        style={{cursor: 'pointer'}}
                        className='text-dark fw-bold text-hover-primary d-block fs-6'
                      >
                        +91 {student?.mobile_number}
                      </div>
                    </td>
                    <td className='text-end'>
                      <div className='d-flex flex-column w-100 me-2'>
                        <div
                          onClick={() => navigate(`/profile/student/${student?._id}`)}
                          style={{cursor: 'pointer'}}
                          className='d-flex flex-stack mb-2'
                        >
                          <span className='text-muted me-2 fs-7 fw-semibold'>
                            {moment(student?.date_of_joining).format('DD-MM-YYYY')}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className='text-end'>
                      <div className='d-flex justify-content-end flex-shrink-0'>
                        {userRoleAccess?.some(
                          (userAccess: any) =>
                            userAccess.studentControlAccess['Dropout Student'] === true &&
                            userAccess.role === currentUser?.role
                        ) && (
                          <label
                            className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                            style={{cursor: 'pointer'}}
                          >
                            <input
                              className='form-check-input me-3'
                              type='checkbox'
                              value=''
                              id='drop-out-student'
                              hidden
                              onChange={(e) => dorpOutStudentHandler(student, e.target.checked)}
                              checked={student?.dropOutStudent}
                            />
                            <KTIcon iconName='dislike' className='fs-3' />
                          </label>
                        )}
                        {userRoleAccess?.some(
                          (userAccess: any) =>
                            userAccess.studentControlAccess['Edit Student'] === true &&
                            userAccess.role === currentUser?.role
                        ) && (
                          <button
                            onClick={() =>
                              navigate(`/update-addmission-form/${student?._id}`, {
                                state: student,
                              })
                            }
                            className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                          >
                            <KTIcon iconName='pencil' className='fs-3' />
                          </button>
                        )}
                        {userRoleAccess?.some(
                          (userAccess: any) =>
                            userAccess.studentControlAccess['Delete Student'] === true &&
                            userAccess.role === currentUser?.role
                        ) && (
                          <button
                            onClick={() => studentDeleteHandler(student?._id)}
                            className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
                          >
                            <KTIcon iconName='trash' className='fs-3' />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className='text-center'>
                    <h4>
                      No Students Available?{' '}
                      <button
                        className='btn btn-sm btn-light-primary'
                        onClick={() => navigate(`/addmission-form/${singleComapnyData?._id}`)}
                      >
                        Add New Student
                      </button>
                    </h4>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default StudentsList
