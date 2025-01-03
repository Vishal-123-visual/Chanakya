import React from 'react'
import {KTIcon} from '../../../_metronic/helpers'
import {useCustomFormFieldContext} from '../enquiry-related/dynamicForms/CustomFormFieldDataContext'
import moment from 'moment'

const PastTask = ({className}) => {
  const studentNotesCTX = useCustomFormFieldContext()
  const studentData = studentNotesCTX?.getStudentNotesListsQuery?.data?.allStudentNotes

  // Get today's date, and set it to start of the day to avoid time issues in comparison
  const today = moment().startOf('day')

  // Filter past tasks: Tasks that are before today's date
  const pastTasks = studentData?.filter((task) => {
    const taskDate = moment(task.startTime) // Convert task date to moment
    return taskDate.isBefore(today, 'day') // Check if task date is before today
  })

  // Additional filter to include tasks from the current year or previous year
  const filteredPastTasks = pastTasks?.filter((task) => {
    const taskDate = moment(task.startTime)
    return (
      taskDate.year() < today.year() || // Tasks from previous years
      (taskDate.year() === today.year() && taskDate.isBefore(today, 'day')) // Tasks before today in the current year
    )
  })

  // Get the first 4 tasks to display
  const tasksToShow = filteredPastTasks?.slice(0, 4)

  return (
    <div className='card card-xl-stretch mb-5 mb-xl-8'>
      {/* begin::Header */}
      <div className='card-header border-0'>
        <h3 className='card-title fw-bold text-dark'>Past's Task</h3>
      </div>
      {/* end::Header */}

      {/* begin::Body */}
      <div
        className='card-body pt-0'
        style={{
          maxHeight: '500px', // Adjust as needed for the desired height
          overflowY: filteredPastTasks?.length > 4 ? 'auto' : 'hidden', // Show scrollbar if more than 4 tasks
          overflowX: 'hidden',
        }}
      >
        {tasksToShow?.length === 0 ? (
          <div>No past tasks available</div>
        ) : (
          tasksToShow?.map((task) => (
            <div
              className='d-flex align-items-center bg-light-danger rounded p-5 mb-7'
              key={task._id}
            >
              {/* begin::Icon */}
              <span className='text-danger me-5'>
                <KTIcon iconName='abstract-26' className='text-danger fs-1 me-5' />
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
              <span className='fw-bold text-danger py-1'>
                {`Overdue by ${moment().diff(moment(task.startTime), 'days')} Days`}
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

export default PastTask
