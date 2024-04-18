import {KTIcon, toAbsoluteUrl} from '../../../_metronic/helpers'
import {useStudentCourseFeesContext} from '../courseFees/StudentCourseFeesContext'
const MonthlyCollectionFee = () => {
  const ctx = useStudentCourseFeesContext()
  const result = ctx.useGetStudentMonthlyCourseFeesCollection()
  //console.log(result)
  return (
    <div className={`card`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Monthly Collection</span>
        </h3>
        <div className='d-flex justify-content-center align-items-center  gap-5 '>
          <label htmlFor='From'>
            From <input type='text' name='From' id='From' className='form-control w-auto' />
          </label>
          <label htmlFor='TO'>
            To <input type='text' name='TO' id='TO' className='form-control w-auto' />
          </label>

          <button className='btn btn-sm btn-light-primary'>Search</button>
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
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
                <th className='min-w-150px'>Roll Number</th>
                <th className='min-w-140px'>Name</th>
                <th className='min-w-120px'>Course</th>
                <th className='min-w-100px text-end'>Contact</th>
                <th className='min-w-100px text-end'>Installments</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {result?.data?.map((data) => (
                <tr key={data._id}>
                  <td></td>
                  <td>{data.studentInfo.rollNumber}</td>
                  <td>{data.studentInfo.name}</td>
                  <td>{data.courseName.courseName}</td>
                  <td></td>
                  <td>{data.studentInfo.phone_number}</td>
                  <td>{data.studentInfo.no_of_installments_amount}</td>
                </tr>
              ))}
            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}
    </div>
  )
}
export default MonthlyCollectionFee
