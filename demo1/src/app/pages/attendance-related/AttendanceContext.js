import {createContext, useContext} from 'react'
import {useAuth} from '../../modules/auth'
import {useMutation, useQueryClient} from 'react-query'
import {toast} from 'react-toastify'
import axios from 'axios'

const attendanceContext = createContext()
const BASE_URL = process.env.REACT_APP_BASE_URL

export const AttendanceContextProvider = ({children}) => {
  const queryClient = useQueryClient()
  const {auth} = useAuth()
  let config = {
    headers: {
      Authorization: `Bearer ${auth?.api_token}`,
    },
  }

  const createTrainerData = useMutation({
    mutationFn: async (data) => {
      // console.log(data)
      return axios.post(`${BASE_URL}/api/add-trainer`, data, config)
    },
    onMutate: () => {
      //console.log('mutate')
    },

    onError: () => {
      //console.log('error')
    },

    onSuccess: () => {
      //alert('Added Course  Successfully!')
    },

    onSettled: async (_, error) => {
      //console.log('settled')
      if (error) {
        //console.log(error)
        toast.error(error.response.data.error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getTrainerData']})
      }
    },
  })

  return (
    <attendanceContext.Provider value={{createTrainerData}}>{children}</attendanceContext.Provider>
  )
}

export const useAttendanceContext = () => {
  const context = useContext(attendanceContext)
  if (!context) {
    throw new Error('useAttendanceContext must be used within attendanceContextProvider')
  }
  return context
}
