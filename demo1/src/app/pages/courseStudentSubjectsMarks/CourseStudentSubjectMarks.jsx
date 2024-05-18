import {NavLink, useLocation} from 'react-router-dom'
import {KTIcon, toAbsoluteUrl} from '../../../_metronic/helpers'
import {useCourseSubjectContext} from '../course/course_subject/CourseSubjectContext'
import {useState} from 'react'

const CourseStudentSubjectMarks = () => {
  const courseSubjectsCtx = useCourseSubjectContext()
  const [activeTab, setActiveTab] = useState(1)
  console.log(typeof activeTab)
  const location = useLocation()

  const handleTabClick = (index) => {
    //console.log(index)
    setActiveTab(index)
  }
  console.log(location.state)
  console.log(courseSubjectsCtx.getCourseSubjectLists.data)
  return (
    <div className={`card`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Course Subjects</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>Over 500 Students</span>
        </h3>

        <div className='card-toolbar'>
          <ul className='nav p-5'>
            {courseSubjectsCtx.getCourseSubjectLists.data && (
              <>
                {courseSubjectsCtx.getCourseSubjectLists.data?.map((itemSubject, i) => (
                  <li
                    // className={`nav-item`}
                    key={i}
                    style={{borderBottom: activeTab === i + 1 ? '2px solid red' : ''}}
                  >
                    <NavLink
                      className={`nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary active fw-bold px-4 me-1 ${
                        activeTab === i + 1 ? 'active bg-red' : ''
                      }`}
                      data-bs-toggle='tab'
                      to={`#kt_table_widget_5_tab_${i + 1}`}
                      onClick={() => handleTabClick(i + 1)}
                    >
                      {itemSubject.semYear}
                    </NavLink>
                  </li>
                ))}
              </>
            )}
          </ul>
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      {
        <div className='card-body py-3'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
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
              {courseSubjectsCtx.getCourseSubjectLists.data.map(
                (yearWiseSubject, indexValue) =>
                  Number(yearWiseSubject.semYear.split(' ')[1]) === activeTab && (
                    <tbody key={indexValue}>
                      <tr>
                        <td>
                          <div className='form-check form-check-sm form-check-custom form-check-solid'>
                            {/* <input
                              className='form-check-input widget-9-check'
                              type='checkbox'
                              value='1'
                            /> */}
                          </div>
                        </td>
                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='symbol symbol-45px me-5'>
                              {/* <img src={toAbsoluteUrl('/media/avatars/300-14.jpg')} alt='' /> */}
                            </div>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-muted fw-semibold text-muted d-block fs-7'>
                                {indexValue + 1}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <a href='#' className='text-dark fw-bold text-hover-primary d-block fs-6'>
                            {yearWiseSubject.subjectName}
                          </a>
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
                                {yearWiseSubject.passMarks}
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
                                {yearWiseSubject.passMarks}
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  )
              )}
              {/* end::Table body */}
            </table>
            {/* end::Table */}
          </div>
          {/* end::Table container */}
        </div>
      }
      {/* begin::Body */}
    </div>
  )
}
export default CourseStudentSubjectMarks
