import React from 'react'
import {KTIcon} from '../../../_metronic/helpers'
import {useCustomFormFieldContext} from '../enquiry-related/dynamicForms/CustomFormFieldDataContext'
import moment from 'moment'

const TodayTasks = ({className}) => {
  const studentNotesCTX = useCustomFormFieldContext()
  const studentData = studentNotesCTX?.getStudentNotesListsQuery?.data?.allStudentNotes

  // Get today's date (start of the day to ignore the time part)
  const today = moment().startOf('day')

  // Filter today's tasks: Compare task.date and today's date, ensuring day, month, and year are the same
  const todaysTasks = studentData?.filter(
    (task) =>
      moment(task.startTime).isSame(today, 'day') && // Ensure day, month, and year match
      moment(task.startTime).month() === today.month() && // Ensure the same month
      moment(task.startTime).year() === today.year() // Ensure the same year
  )
  //   console.log(todaysTasks)
  // Get the first 4 tasks to show
  const tasksToShow = todaysTasks?.slice(0, 4)

  return (
    <div className='card card-xl-stretch mb-5 mb-xl-8'>
      {/* begin::Header */}
      <div className='card-header border-0'>
        <h3 className='card-title fw-bold text-dark'>Today's Task</h3>
      </div>
      {/* end::Header */}

      {/* begin::Body */}
      <div
        className='card-body pt-0'
        style={{
          maxHeight: '500px', // Set the max height for the body
          overflowY: tasksToShow?.length > 4 ? 'auto' : 'hidden', // Show scrollbar if more than 4 tasks
          overflowX: 'hidden',
        }}
      >
        {tasksToShow?.length === 0 ? (
          <div>No tasks for today</div>
        ) : (
          tasksToShow?.map((task) => (
            <div
              className='d-flex align-items-center bg-light-success rounded p-5 mb-7'
              key={task._id}
            >
              {/* begin::Icon */}
              <span className='text-success me-5'>
                <KTIcon iconName='abstract-26' className='text-success fs-1 me-5' />
              </span>
              {/* end::Icon */}

              {/* begin::Title */}
              <div className='flex-grow-1 me-2'>
                <a
                  href={`/reminder-task/${task?.companyId}`}
                  target='blank'
                  className='fw-bold text-gray-800 text-hover-primary fs-6'
                >
                  <strong>{task.particulars}</strong> {/* Bold the particulars */}
                </a>
                <span className='text-muted fw-semibold d-block'>
                  <span className='text-muted'>{`Added by: ${task.addedBy}`}</span>
                </span>
              </div>
              {/* end::Title */}

              {/* begin::Label */}
              <span className='fw-bold text-success py-1'>
                Due in {moment(task.startTime).diff(moment(), 'days')} Days
              </span>
              {/* end::Label */}
            </div>
          ))
        )}
      </div>
      {/* end::Body */}
    </div>
  )
}

export default TodayTasks
