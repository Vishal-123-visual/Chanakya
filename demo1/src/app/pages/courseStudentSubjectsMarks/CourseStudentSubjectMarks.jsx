import {NavLink, useLocation, useNavigate} from 'react-router-dom'
import {useCourseSubjectContext} from '../course/course_subject/CourseSubjectContext'
import {useState} from 'react'
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
const BASE_URL = 'http://your-api-url.com' // Replace with your actual base URL

const CourseStudentSubjectMarks = () => {
  const courseSubjectsCtx = useCourseSubjectContext()
  const [activeTab, setActiveTab] = useState(1)
  const [marksData, setMarksData] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const {data, error, isLoading} = courseSubjectsCtx.useSubjectsBasedOnCourse(
    location?.state?.updateUserId?.courseName._id
  )

  // console.log('student id --->>', location?.state?.updateUserId)

  if (location?.state?.updateUserId === undefined) {
    navigate(-1)
    return null
  }

  // console.log(data)

  const YearandSemesterSets = Array.from(new Set(data?.map((item) => item.semYear) || []))

  const handleTabClick = (index) => {
    setActiveTab(index)
  }

  const handleInputChange = (e, id) => {
    // console.log(id)
    const {name, value} = e.target
    setMarksData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [name]: value,
      },
    }))
  }

  //console.log(marksData)

  const handleSubmit = () => {
    try {
      setIsSubmitting(true)
      Object.keys(marksData).forEach((id) => {
        courseSubjectsCtx.updateCourseSubjectMarksMutation.mutate({
          _id: id,
          ...marksData[id],
          courseId: location.state.updateUserId.courseName._id,
        })
      })
      window.alert('Added marks successfully!')
      setIsSubmitting(false)
    } catch (error) {
      console.log(error)
    }
  }

  // Group Subject by Semester
  const groupSubjectsBySemester = YearandSemesterSets.reduce((acc, semYear) => {
    acc[semYear] = data.filter((subject) => subject.semYear === semYear) || []
    return acc
  }, {})

  //console.log(groupSubjectsBySemester)

  return (
    <div className='card'>
      {/* begin::Header */}
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
      {/* end::Header */}

      {/* begin::Body */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error loading data</div>
          ) : (
            <>
              <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
                {/* begin::Table head */}
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
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody>
                  {data
                    ?.filter((subject) => subject.semYear === YearandSemesterSets[activeTab - 1])
                    ?.map((yearWiseSubject, indexValue) => (
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
                                  defaultValue={yearWiseSubject?.theory}
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
                                  defaultValue={yearWiseSubject?.practical}
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
                                  defaultValue={yearWiseSubject?.totalMarks}
                                  onChange={(e) => handleInputChange(e, yearWiseSubject._id)}
                                />
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
                {/* end::Table body */}
              </table>
              <hr />
              <div className='d-flex align-items-center gap-5'>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className='btn btn-primary text-uppercase'
                >
                  {isSubmitting ? 'Marks Added' : 'Submit Marks'}
                </button>
                {/* {JSON.stringify(groupSubjectsBySemester[YearandSemesterSets[activeTab - 1]], 4)} */}
                <button className='btn btn-info text-uppercase '>result</button>
                <button className='btn btn-danger text-uppercase '>print result</button>
              </div>{' '}
              <hr />
            </>
          )}
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* end::Body */}
    </div>
  )
}

export default CourseStudentSubjectMarks
