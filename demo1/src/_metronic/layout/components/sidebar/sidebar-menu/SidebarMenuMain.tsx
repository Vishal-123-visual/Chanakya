/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
import {useIntl} from 'react-intl'
import {KTIcon} from '../../../../helpers'
import {SidebarMenuItemWithSub} from './SidebarMenuItemWithSub'
import {SidebarMenuItem} from './SidebarMenuItem'
import {useCompanyContext} from '../../../../../app/pages/compay/CompanyContext'
import {useAuth} from '../../../../../app/modules/auth'

const SidebarMenuMain = () => {
  const intl = useIntl()

  const companyCTX = useCompanyContext()
  const {currentUser} = useAuth()

  return (
    <>
      <SidebarMenuItem
        to='/dashboard'
        icon='element-11'
        title={intl.formatMessage({id: 'MENU.DASHBOARD'})}
        fontIcon='bi-app-indicator'
      />

      {currentUser?.role !== 'Student' ? (
        <>
          {/* ----------------------------- Company Menu Start Here ............................... */}
          {companyCTX.getCompanyLists?.data?.map((CompanyListData: any, index: number) => (
            <React.Fragment key={index}>
              <SidebarMenuItemWithSub
                key={CompanyListData?._id}
                to='/apps/chat'
                title={CompanyListData.companyName}
                fontIcon='bi-chat-left'
                icon='message-text-2'
              >
                <SidebarMenuItemWithSub
                  to=''
                  title={'Students'}
                  fontIcon='bi-chat-left'
                  icon='message-text-2'
                >
                  <SidebarMenuItem
                    to={`/students/${CompanyListData?._id}`}
                    title='All Students'
                    hasBullet={true}
                  />
                  <SidebarMenuItem
                    to={`/drop-out-students/${CompanyListData?._id}`}
                    title='Drop Out Students'
                    hasBullet={true}
                  />

                  <SidebarMenuItem
                    to={`/students-remainingFee/${CompanyListData?._id}`}
                    title='Pending Students'
                    hasBullet={true}
                  />
                  <SidebarMenuItem
                    to={`/students-clearFee/${CompanyListData?._id}`}
                    title='Clear Students'
                    hasBullet={true}
                  />
                </SidebarMenuItemWithSub>

                <SidebarMenuItemWithSub
                  to='/apps/chat'
                  title={'Forms'}
                  fontIcon='bi-chat-left'
                  icon='message-text-2'
                >
                  <SidebarMenuItem
                    to={`/add-form/${CompanyListData?._id}`}
                    title='Add Forms'
                    hasBullet={true}
                  />
                  <SidebarMenuItem
                    to={`/view-form/${CompanyListData?._id}`}
                    title='View Forms'
                    hasBullet={true}
                  />
                </SidebarMenuItemWithSub>
                <SidebarMenuItemWithSub
                  to='/apps/chat'
                  title={'View All Enquirys'}
                  fontIcon='bi-chat-left'
                  icon='message-text-2'
                >
                  <SidebarMenuItem
                    to={`/add-enquiry/${CompanyListData?._id}`}
                    title='Add Enquirys'
                    hasBullet={true}
                  />
                  <SidebarMenuItem
                    to={`/view-form-data/${CompanyListData?._id}`}
                    title='View All Enquiry Forms'
                    hasBullet={true}
                  />
                </SidebarMenuItemWithSub>
                <SidebarMenuItemWithSub
                  to='/apps/chat'
                  title={'Attendance'}
                  fontIcon='bi-chat-left'
                  icon='message-text-2'
                >
                  <SidebarMenuItem
                    to={`/add-trainer/${CompanyListData?._id}`}
                    title='Add Trainers'
                    hasBullet={true}
                  />
                  <SidebarMenuItem
                    to={`/add-lab/${CompanyListData?._id}`}
                    title='Add Labs'
                    hasBullet={true}
                  />
                </SidebarMenuItemWithSub>

                <SidebarMenuItem
                  to={`/monthlyCollectionFees/${CompanyListData?._id}`}
                  title='Monthly Collections'
                  hasBullet={true}
                />
                <SidebarMenuItem
                  to={`/student/commission/${CompanyListData?._id}`}
                  title='Commission'
                  hasBullet={true}
                />
                <SidebarMenuItem
                  to={`/addmission-form/${CompanyListData?._id}`}
                  title='Admission Form'
                  hasBullet={true}
                />

                {/* ------------------------------------ Start Day Book here ---------------------------------- */}
                <SidebarMenuItemWithSub
                  to='/apps/chat'
                  title='Day Book'
                  fontIcon='bi-chat-left'
                  icon='message-text-2'
                >
                  <SidebarMenuItem
                    to={`/daybook/viewDaybook/${CompanyListData._id}`}
                    title='View DayBook'
                    hasBullet={true}
                  />
                  <SidebarMenuItem
                    to={`/daybook/addAccount/${CompanyListData._id}`}
                    title='Add Account'
                    hasBullet={true}
                  />
                  <SidebarMenuItem
                    to={`/daybook/viewAccount/${CompanyListData._id}`}
                    title='View Account'
                    hasBullet={true}
                  />
                </SidebarMenuItemWithSub>
                {/* ------------------------------------ End Day Book here ---------------------------------- */}
              </SidebarMenuItemWithSub>
            </React.Fragment>
          ))}
          {/* ----------------------------- Company Menu END Here ............................... */}

          {/* ************* Manage Courses Start   ****************** */}
          <SidebarMenuItemWithSub
            to='/apps/chat'
            title='Manage Courses'
            fontIcon='bi-chat-left'
            icon='message-text-2'
          >
            <SidebarMenuItem to='/course/course-type' title='Add Course Type' hasBullet={true} />
            <SidebarMenuItem to='/course/category' title='Add Course Category' hasBullet={true} />
            <SidebarMenuItem
              to='/course/no_of_years_course'
              title='Add Course Number Of Years'
              hasBullet={true}
            />
            <SidebarMenuItem to='/course/addCourse' title='Add Course' hasBullet={true} />
            <SidebarMenuItem to='/course/viewCourses' title='View All Courses' hasBullet={true} />
            {/* <SidebarMenuItem to='/addmission-form' title='Add Course Category' hasBullet={true} /> */}
          </SidebarMenuItemWithSub>
          {/* ************* Manage Courses END   ****************** */}

          {/* ************************************* Manage Company Start ******************************** */}
          <SidebarMenuItemWithSub
            to='/apps/chat'
            title='Manage Company'
            fontIcon='bi-chat-left'
            icon='message-text-2'
          >
            <SidebarMenuItem to='/company' title='Company' hasBullet={true} />
            <SidebarMenuItem to='/add-company' title='Add Company' hasBullet={true} />
          </SidebarMenuItemWithSub>
          {/* *************************************  Manage Company End ******************************** */}

          {/* ------------------------------ Settings Page Start ----------------------------------------- */}
          <SidebarMenuItemWithSub
            to='/apps/chat'
            title='Settings'
            fontIcon='bi-chat-left'
            icon='abstract-29'
          >
            <SidebarMenuItem to='/general-settings' title='General Settings' hasBullet={true} />
          </SidebarMenuItemWithSub>
          {/* ------------------------------ Settings Page End ------------------------------------------- */}

          <SidebarMenuItem
            to='/apps/user-management/users'
            icon='abstract-28'
            title='User management'
            fontIcon='bi-layers'
          />
        </>
      ) : (
        <>
          <SidebarMenuItem
            to='/student'
            icon='abstract-28'
            title='Student Profile'
            fontIcon='bi-layers'
          />
        </>
      )}
    </>
  )
}

export {SidebarMenuMain}
