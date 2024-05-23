import {NavLink, useLocation, useNavigate} from 'react-router-dom'
import {useCourseSubjectContext} from '../course/course_subject/CourseSubjectContext'
import {useState, useEffect} from 'react'

import {useAuth} from '../../modules/auth'

const CourseStudentSubjectMarks = () => {
  const courseSubjectsCtx = useCourseSubjectContext()
  const [activeTab, setActiveTab] = useState(1)
  const [marksData, setMarksData] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const {auth} = useAuth()
  //console.log(auth.role === 'Admin')

  const {data, error, isLoading} = courseSubjectsCtx.useSubjectsBasedOnCourse(
    location?.state?.updateUserId?.courseName._id
  )

  //console.log(location?.state?.updateUserId)

  const {
    data: studentSubjectMarksData,
    error: studentSubjectMarksError,
    isLoading: studentSubjectMarksIsLoading,
  } = courseSubjectsCtx.useGetStudentSubjectsMarksBasedOnCourse(location?.state?.updateUserId?._id)

  useEffect(() => {
    if (studentSubjectMarksData) {
      const initialMarksData = studentSubjectMarksData.reduce((acc, marksData) => {
        acc[marksData.Subjects._id] = {
          theory: marksData.theory,
          practical: marksData.practical,
          totalMarks: marksData.theory + marksData.practical,
        }
        return acc
      }, {})
      setMarksData(initialMarksData)
    }
  }, [studentSubjectMarksData])

  if (location?.state?.updateUserId === undefined) {
    navigate(-1)
    return null
  }

  const YearandSemesterSets = Array.from(new Set(data?.map((item) => item?.semYear) || []))

  const handleTabClick = (index) => {
    setActiveTab(index)
  }

  const handleInputChange = (e, id) => {
    const {name, value} = e.target
    const parsedValue = parseInt(value) || 0

    setMarksData((prev) => {
      const updatedData = {
        ...prev,
        [id]: {
          ...prev[id],
          [name]: parsedValue,
        },
      }

      const theory = updatedData[id]?.theory || 0
      const practical = updatedData[id]?.practical || 0
      updatedData[id].totalMarks = theory + practical
      // console.log(updatedData)

      return updatedData
    })
  }

  const handleEditStudentMarks = (marksData2) => {
    // console.log(marksData2)
    try {
      courseSubjectsCtx.updateStudentSubjectMarksMutation.mutate({
        marksId: marksData2._id,
        subjectId: marksData2.Subjects._id,
        courseId: marksData2.course._id,
        studentId: marksData2?.studentInfo._id,
        theory: marksData[marksData2.Subjects._id]?.theory,
        practical: marksData[marksData2.Subjects._id]?.practical,
        totalMarks: marksData[marksData2.Subjects._id]?.totalMarks,
      })
      window.alert('Update results marks successfully')
    } catch (error) {
      window.alert(error)
    }
  }

  const handleSubmit = () => {
    try {
      setIsSubmitting(true)
      Object.keys(marksData).forEach((id) => {
        courseSubjectsCtx.updateCourseSubjectMarksMutation.mutate({
          subjectId: id,
          ...marksData[id],
          courseId: location.state.updateUserId.courseName._id,
          studentId: location.state.updateUserId._id,
        })
      })
      window.alert('Added marks successfully!')
      setIsSubmitting(false)
    } catch (error) {
      console.log(error)
    }
  }

  const groupSubjectsBySemester = YearandSemesterSets.reduce((acc, semYear) => {
    acc[semYear] =
      studentSubjectMarksData?.filter((subject) => subject?.Subjects?.semYear === semYear) || []
    return acc
  }, {})

  // console.log(groupSubjectsBySemester)
  //console.log(groupSubjectsBySemester[YearandSemesterSets[activeTab - 1]])

  return (
    <div className='card'>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Course Subjects</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>Over 500 Students</span>
        </h3>

        <div className='card-toolbar'>
          <ul className='nav p-5'>
            {YearandSemesterSets.length > 0 &&
              YearandSemesterSets.map((itemSubject, i) => (
                <li key={i} style={{borderBottom: activeTab === i + 1 ? '2px solid red' : ''}}>
                  <NavLink
                    className={`nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary ${
                      activeTab === i + 1 ? 'active bg-red' : ''
                    }`}
                    data-bs-toggle='tab'
                    to={`#kt_table_widget_5_tab_${i + 1}`}
                    onClick={() => handleTabClick(i + 1)}
                  >
                    {itemSubject}
                  </NavLink>
                </li>
              ))}
          </ul>
        </div>
      </div>

      <div className='card-body py-3'>
        <div className='table-responsive'>
          {isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error loading data</div>
          ) : (
            <>
              <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
                <thead>
                  <tr className='fw-bold text-muted'>
                    <th className='w-25px'>
                      <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
                    </th>
                    <th className='min-w-150px'>Sr.No</th>
                    <th className='min-w-140px'>Subject Name</th>
                    <th className='min-w-120px'>Subject Code</th>
                    <th className='min-w-120px'>Full Marks</th>
                    <th className='min-w-120px'>Pass Marks</th>
                    <th className='min-w-120px'>Theory</th>
                    <th className='min-w-120px'>Practical</th>
                    <th className='min-w-120px'>Total Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {data
                    ?.filter((subject) => subject.semYear === YearandSemesterSets[activeTab - 1])
                    ?.map((yearWiseSubject, indexValue) => {
                      const studentMarks = studentSubjectMarksData?.find(
                        (singleStudentMarksData) =>
                          singleStudentMarksData.Subjects._id === yearWiseSubject._id
                      )

                      return (
                        <tr key={yearWiseSubject._id}>
                          <td>
                            <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
                          </td>
                          <td>
                            <div className='d-flex align-items-center'>
                              <div className='symbol symbol-45px me-5'></div>
                              <div className='d-flex justify-content-start flex-column'>
                                <span className='text-muted fw-semibold text-muted d-block fs-7'>
                                  {indexValue + 1}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <button className='btn text-dark fw-bold text-hover-primary d-block fs-6'>
                              {yearWiseSubject.subjectName}
                            </button>
                          </td>
                          <td className='text-end'>
                            <div className='d-flex flex-column w-100 me-2'>
                              <div className='d-flex flex-stack mb-2'>
                                <span className='text-muted me-2 fs-7 fw-semibold'>
                                  {yearWiseSubject.subjectCode}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className='text-end'>
                            <div className='d-flex flex-column w-100 me-2'>
                              <div className='d-flex flex-stack mb-2'>
                                <span className='text-muted me-2 fs-7 fw-semibold'>
                                  {yearWiseSubject.fullMarks}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className='text-end'>
                            <div className='d-flex flex-column w-100 me-2'>
                              <div className='d-flex flex-stack mb-2'>
                                <span className='text-muted me-2 fs-7 fw-semibold'>
                                  {yearWiseSubject.passMarks}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className='text-end'>
                            <div className='d-flex flex-column w-100 me-2'>
                              <div className='d-flex flex-stack mb-2'>
                                <span className='text-muted me-2 fs-7 fw-semibold'>
                                  <input
                                    type='text'
                                    name='theory'
                                    className='form-control w-auto'
                                    id={`theory_${yearWiseSubject._id}`}
                                    defaultValue={studentMarks?.theory}
                                    onChange={(e) => handleInputChange(e, yearWiseSubject._id)}
                                  />
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className='text-end'>
                            <div className='d-flex flex-column w-100 me-2'>
                              <div className='d-flex flex-stack mb-2'>
                                <span className='text-muted me-2 fs-7 fw-semibold'>
                                  <input
                                    type='text'
                                    name='practical'
                                    className='form-control w-auto'
                                    id={`practical_${yearWiseSubject._id}`}
                                    defaultValue={studentMarks?.practical}
                                    onChange={(e) => handleInputChange(e, yearWiseSubject._id)}
                                  />
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className='text-end'>
                            <div className='d-flex flex-column w-100 me-2'>
                              <div className='d-flex flex-stack mb-2'>
                                <span className='text-muted me-2 fs-7 fw-semibold'>
                                  <input
                                    type='text'
                                    name='totalMarks'
                                    className='form-control w-auto'
                                    id={`totalMarks_${yearWiseSubject._id}`}
                                    value={
                                      marksData[yearWiseSubject._id]?.totalMarks ||
                                      studentMarks?.totalMarks ||
                                      0
                                    }
                                    readOnly
                                  />
                                </span>
                              </div>
                            </div>
                          </td>
                          {/* <td>
                            <button
                              onClick={() => handleEditStudentMarks(studentMarks)}
                              className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                            >
                              <KTIcon iconName='pencil' className='fs-3' />
                            </button>
                          </td> */}
                        </tr>
                      )
                    })}
                </tbody>
              </table>
              <hr />
              <div className='d-flex align-items-center gap-5'>
                {auth.role === 'Admin' && 'SuperAdmin' && (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className='btn btn-primary text-uppercase'
                  >
                    {isSubmitting ? 'Marks Added' : 'Submit Marks'}
                  </button>
                )}

                <button
                  className='btn btn-info text-uppercase'
                  onClick={() =>
                    navigate('/student-result', {
                      state: groupSubjectsBySemester[YearandSemesterSets[activeTab - 1]],
                    })
                  }
                >
                  result
                </button>
                <button className='btn btn-danger text-uppercase '>print result</button>
              </div>
              <hr />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CourseStudentSubjectMarks
