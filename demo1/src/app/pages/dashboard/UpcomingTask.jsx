import React from 'react'
import {KTIcon} from '../../../_metronic/helpers'
import {useCustomFormFieldContext} from '../enquiry-related/dynamicForms/CustomFormFieldDataContext'
import moment from 'moment'

const UpcomingTask = ({className}) => {
  const studentNotesCTX = useCustomFormFieldContext()
  const studentData = studentNotesCTX?.getStudentNotesListsQuery?.data?.allStudentNotes

  // Get today's date, and set it to start of the day to avoid time issues in comparison
  const today = moment().startOf('day')

  // Filter upcoming tasks: Tasks where the startTime is in the future
  const upcomingTasks = studentData?.filter((task) => {
    const taskDate = moment(task.startTime) // Convert task startTime to moment
    return taskDate.isAfter(today, 'day') // Check if task startTime is after today
  })

  // Get the first 4 tasks to display
  const tasksToShow = upcomingTasks?.slice(0, 4)

  return (
    <div className='card card-xl-stretch mb-5 mb-xl-8'>
      {/* begin::Header */}
      <div className='card-header border-0'>
        <h3 className='card-title fw-bold text-dark'>Upcoming Tasks</h3>
      </div>
      {/* end::Header */}

      {/* begin::Body */}
      <div
        className='card-body pt-0'
        style={{
          maxHeight: '500px', // Adjust as needed for the desired height
          overflowY: upcomingTasks?.length > 4 ? 'auto' : 'hidden', // Show scrollbar if more than 4 tasks
          overflowX: 'hidden',
        }}
      >
        {tasksToShow?.length === 0 ? (
          <div>No upcoming tasks</div>
        ) : (
          tasksToShow?.map((task) => {
            const taskDate = moment(task.startTime)
            const dueInDays = taskDate.diff(today, 'days') // Calculate how many days until the task

            return (
              <div
                className='d-flex align-items-center bg-light-warning rounded p-5 mb-7'
                key={task._id}
              >
                {/* begin::Icon */}
                <span className='text-warning me-5'>
                  <KTIcon iconName='abstract-26' className='text-warning fs-1 me-5' />
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
                    {`Added By: ${task.addedBy}`}
                  </span>
                </div>
                {/* end::Title */}

                {/* begin::Label */}
                <span className='fw-bold text-warning py-1'>
                  {`Due in ${dueInDays} Days`} {/* Display due in days */}
                </span>
                {/* end::Label */}
              </div>
            )
          })
        )}
      </div>
      {/* end::Body */}
    </div>
  )
}

export default UpcomingTask
