import {lazy, FC, Suspense} from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'
import {MenuTestPage} from '../pages/MenuTestPage'
import {getCSSVariableValue} from '../../_metronic/assets/ts/_utils'
import {WithChildren} from '../../_metronic/helpers'
import BuilderPageWrapper from '../pages/layout-builder/BuilderPageWrapper'

const PrivateRoutes = () => {
  const GstSuggesstion = lazy(() => import('../pages/email-template/GstSuggesstion'))
  const ViewDayBookAccount = lazy(() => import('../pages/dayBook/ViewDayBookAccount'))
  const EditDayBookAccount = lazy(() => import('../pages/dayBook/EditDayBookAccount'))
  const StudentCommission = lazy(() => import('../pages/student-commission/StudentCommission'))
  const ShowSingleAccountDayBookData = lazy(
    () => import('../pages/dayBook/ShowSingleAccountDayBookData')
  )
  const ViewDayBook = lazy(() => import('../pages/dayBook/ViewDayBook'))
  const AddAccountDayBook = lazy(() => import('../pages/dayBook/AddAccountDayBook'))
  const UpdateCompany = lazy(() => import('../pages/compay/UpdateCompany'))
  const AddCompany = lazy(() => import('../pages/compay/AddCompany'))
  const Company = lazy(() => import('../pages/compay/Company'))
  const ProfilePage = lazy(() => import('../modules/profile/ProfilePage'))
  const WizardsPage = lazy(() => import('../modules/wizards/WizardsPage'))
  const AccountPage = lazy(() => import('../modules/accounts/AccountPage'))
  const WidgetsPage = lazy(() => import('../modules/widgets/WidgetsPage'))
  const ChatPage = lazy(() => import('../modules/apps/chat/ChatPage'))
  const UsersPage = lazy(() => import('../modules/apps/user-management/UsersPage'))
  const AddMissionForm = lazy(() => import('../pages/AddMissionForm'))
  const MyPage = lazy(() => import('../pages/MyPage'))
  const StudentsList = lazy(() => import('../pages/StudentsList'))
  const StudentProfile = lazy(() => import('../pages/student-profile/StudentProfile'))
  const CourseTypes = lazy(() => import('../pages/course/course-type'))
  const CourseCategory = lazy(() => import('../pages/course/category'))
  const NumberOfYearsCourse = lazy(() => import('../pages/course/Number Of Years'))
  const AddCourse = lazy(() => import('../pages/course'))
  const AddCourseEditAndAdd = lazy(() => import('../pages/course/course-type/AddCourseEditAndAdd'))
  const AddCourseTypeEdit = lazy(() => import('../pages/course/course-type/AddCourseTypeEdit'))
  const AddNumberYearCourse = lazy(
    () => import('../pages/course/Number Of Years/AddNumberYearCourse')
  )
  const AddCourseCategory = lazy(() => import('../pages/course/category/AddCategory'))
  const AddCourseUpdateAndAdd = lazy(() => import('../pages/course/AddCourse'))
  const EditCourse = lazy(() => import('../pages/course/EditCourse'))
  const ViewCourse = lazy(() => import('../pages/course/ViewCourse'))
  const MonthlyCollectionFee = lazy(() => import('../pages/payment_option/MonthlyCollectionFee'))
  const AddPaymentOption = lazy(() => import('../pages/payment_option/AddPaymentOption'))
  const EmailTemplate = lazy(() => import('../pages/email-template/EmailTemplate'))
  const SendEmailSuggestion = lazy(() => import('../pages/email-template/SendEmailSuggestion'))
  const CourseStudentSubjectMarks = lazy(
    () => import('../pages/courseStudentSubjectsMarks/CourseStudentSubjectMarks')
  )
  const StudentMarksResult = lazy(
    () => import('../pages/courseStudentSubjectsMarks/StudentMarksResult')
  )

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />
        {/* ================================  DayBook Start Here ============================== */}
        <Route
          path='/daybook/viewDaybook'
          element={
            <SuspensedView>
              <ViewDayBook />
            </SuspensedView>
          }
        />
        <Route
          path='/daybook/addAccount'
          element={
            <SuspensedView>
              <AddAccountDayBook />
            </SuspensedView>
          }
        />
        <Route
          path='/daybook/singleAccount/:id'
          element={
            <SuspensedView>
              <ShowSingleAccountDayBookData />
            </SuspensedView>
          }
        />
        <Route
          path='/daybook/editAccount/:id'
          element={
            <SuspensedView>
              <EditDayBookAccount />
            </SuspensedView>
          }
        />
        <Route
          path='/daybook/viewAccount'
          element={
            <SuspensedView>
              <ViewDayBookAccount />
            </SuspensedView>
          }
        />
        {/* ================================  DayBook End Here ============================== */}
        {/* ====================Start Course Here ==================== */}
        <Route
          path='/course/course-type'
          element={
            <SuspensedView>
              <CourseTypes className='' />
            </SuspensedView>
          }
        />
        <Route
          path='/course/course-type/editAdd/:id'
          element={
            <SuspensedView>
              <AddCourseEditAndAdd />
            </SuspensedView>
          }
        />
        <Route
          path='/course/course-type/edit/:id'
          element={
            <SuspensedView>
              <AddCourseTypeEdit />
            </SuspensedView>
          }
        />
        <Route
          path='/course/category'
          element={
            <SuspensedView>
              <CourseCategory className='' />
            </SuspensedView>
          }
        />
        <Route
          path='/course/category/add'
          element={
            <SuspensedView>
              <AddCourseCategory />
            </SuspensedView>
          }
        />
        <Route
          path='/student/commission/:companyId'
          element={
            <SuspensedView>
              <StudentCommission />
            </SuspensedView>
          }
        />
        {/* ======================================Add Number Of Years Course Type Start ============================================= */}
        <Route
          path='/course/no_of_years_course'
          element={
            <SuspensedView>
              <NumberOfYearsCourse className='' />
            </SuspensedView>
          }
        />
        <Route
          path='/course/no_of_years_course/add'
          element={
            <SuspensedView>
              <AddNumberYearCourse />
            </SuspensedView>
          }
        />
        {/* ======================================Add Number Of Years Course Type End ============================================= */}
        <Route
          path='/course/addCourse'
          element={
            <SuspensedView>
              <AddCourse className='' />
            </SuspensedView>
          }
        />
        <Route
          path='/course/viewCourses'
          element={
            <SuspensedView>
              <ViewCourse />
            </SuspensedView>
          }
        />
        <Route
          path='/course/addCourse/add'
          element={
            <SuspensedView>
              <AddCourseUpdateAndAdd />
            </SuspensedView>
          }
        />
        <Route
          path='/course/addCourse/update'
          element={
            <SuspensedView>
              <EditCourse />
            </SuspensedView>
          }
        />
        {/* ====================End Course Here ==================== */}
        <Route
          path='/my-page'
          element={
            <SuspensedView>
              <MyPage />
            </SuspensedView>
          }
        />
        <Route
          path='/addmission-form/:id'
          element={
            <SuspensedView>
              <AddMissionForm />
            </SuspensedView>
          }
        />
        <Route
          path='/students/:id'
          element={
            <SuspensedView>
              <StudentsList className='' />
            </SuspensedView>
          }
        />
        <Route
          path='/student/:id'
          element={
            <SuspensedView>
              <StudentProfile />
            </SuspensedView>
          }
        />
        {/* *************************************** Monthly Collection fees start here.. ******************************************* */}
        <Route
          path='/monthlyCollectionFees/:id'
          element={
            <SuspensedView>
              <MonthlyCollectionFee />
            </SuspensedView>
          }
        />
        {/* *************************************** Monthly Collection fees End here.. ******************************************* */}
        {/* *************************************** Payment Option start here.. ******************************************* */}

        {/* *************************************** Payment Option End here.. ******************************************* */}
        {/* ******************************......... Manage Company start here.....***************************** */}
        <Route
          path='/company'
          element={
            <SuspensedView>
              <Company />
            </SuspensedView>
          }
        />
        <Route
          path='/add-company'
          element={
            <SuspensedView>
              <AddCompany />
            </SuspensedView>
          }
        />
        <Route
          path='/update-company'
          element={
            <SuspensedView>
              <UpdateCompany />
            </SuspensedView>
          }
        />
        {/* ******************************................ Manage Company start here..............******************************************* */}
        {/* ------------------------------- Email Template Start ----------------------------------- */}
        <Route
          path='/general-settings'
          element={
            <SuspensedView>
              <div className='d-flex flex-column gap-10'>
                <SendEmailSuggestion />
                <GstSuggesstion />
                <AddPaymentOption />
                <EmailTemplate />
              </div>
            </SuspensedView>
          }
        />

        <Route
          path='/course-subjects-addMarks'
          element={
            <SuspensedView>
              <CourseStudentSubjectMarks />
            </SuspensedView>
          }
        />
        {/******************* Route for the print result ******************** */}
        {/* <Route
          path='/student-result'
          element={
            <SuspensedView>
              <StudentMarksResult />
            </SuspensedView>
          }
        /> */}
        {/* ------------------------------- Email Template End ----------------------------------- */}
        {/* <Route path='/add-user' element={<AddUser />} />
        <Route path='/user-list' element={<UserList />} /> */}
        {/* Pages */}
        <Route path='dashboard' element={<DashboardWrapper />} />
        <Route path='builder' element={<BuilderPageWrapper />} />
        <Route path='menu-test' element={<MenuTestPage />} />
        {/* Lazy Modules */}
        <Route
          path='crafted/pages/profile/*'
          element={
            <SuspensedView>
              <ProfilePage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/pages/wizards/*'
          element={
            <SuspensedView>
              <WizardsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/widgets/*'
          element={
            <SuspensedView>
              <WidgetsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/account/*'
          element={
            <SuspensedView>
              <AccountPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/chat/*'
          element={
            <SuspensedView>
              <ChatPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/user-management/*'
          element={
            <SuspensedView>
              <UsersPage />
            </SuspensedView>
          }
        />
        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({children}) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export {PrivateRoutes}
