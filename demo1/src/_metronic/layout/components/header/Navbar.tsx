import clsx from 'clsx'
import {KTIcon, toAbsoluteUrl} from '../../../helpers'
import {HeaderUserMenu, ThemeModeSwitcher} from '../../../partials'
import {useLayout} from '../../core'
import {useAuth} from '../../../../app/modules/auth'
import {useAdmissionContext} from '../../../../app/modules/auth/core/Addmission'
import {useCompanyContext} from '../../../../app/pages/compay/CompanyContext'
import {useNavigate} from 'react-router-dom'

const itemClass = 'ms-1 ms-md-4'
const btnClass =
  'btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px'
const userAvatarClass = 'symbol-35px'
const btnIconClass = 'fs-2'

const BASE_URL = process.env.REACT_APP_BASE_URL
const BASE_URL_Image = `${BASE_URL}/api/images`

const Navbar = () => {
  const {config} = useLayout()
  const {currentUser} = useAuth()
  //console.log(currentUser?.role)
  const context = useCompanyContext()
  const {data: studentIssuesLists} = context.useGetAllStudentIssueStatusQuery
  //console.log(studentIssuesLists)
  const navigate = useNavigate()

  const studentCTX = useAdmissionContext()
  const filteredData = studentIssuesLists?.filter((s) => s?.showStudent === true)
  // console.log(filteredData?.length)

  // Fetch current student data based on currentUser's email
  const currentStudent = studentCTX?.useGetSingleStudentUsingWithEmail(currentUser?.email)

  return (
    <div className='app-navbar flex-shrink-0'>
      <div className={clsx('app-navbar-item', itemClass)} style={{position: 'relative'}}>
        <button
          type='button'
          className='btn btn-icon btn-sm h-auto btn-color-gray-400 btn-active-color-primary justify-content-end'
          style={{position: 'relative'}}
        >
          <KTIcon iconName='flag' className='fs-1 text-danger' />
          <span
            style={{
              position: 'absolute',
              top: '-4px', // Adjust as needed
              right: '-1px', // Adjust as needed
              backgroundColor: 'red',
              color: 'white',
              fontSize: '10px', // Adjust as needed
              fontWeight: 'bold',
              borderRadius: '50%',
              width: '13px', // Adjust as needed
              height: '13px', // Adjust as needed
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            3
          </span>
        </button>
        <ThemeModeSwitcher toggleBtnClass={clsx('btn-active-light-primary btn-custom')} />
      </div>

      <div className={clsx('app-navbar-item', itemClass)}>
        <div
          className={clsx('cursor-pointer symbol', userAvatarClass)}
          data-kt-menu-trigger="{default: 'click'}"
          data-kt-menu-attach='parent'
          data-kt-menu-placement='bottom-end'
        >
          <img
            src={
              currentStudent?.data?.image
                ? BASE_URL_Image + '/' + currentStudent?.data?.image
                : '/300-1.jpg'
            }
            alt=''
          />
        </div>
        {currentStudent && <HeaderUserMenu currentStudent={currentStudent?.data} />}
      </div>

      {config.app?.header?.default?.menu?.display && (
        <div className='app-navbar-item d-lg-none ms-2 me-n3' title='Show header menu'>
          <div
            className='btn btn-icon btn-active-color-primary w-35px h-35px'
            id='kt_app_header_menu_toggle'
          >
            <KTIcon iconName='text-align-left' className={btnIconClass} />
          </div>
        </div>
      )}
    </div>
  )
}

export {Navbar}
