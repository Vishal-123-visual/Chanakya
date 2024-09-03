import {createContext, useContext} from 'react'
import {useAuth} from '../../modules/auth'
import {useMutation, useQuery, useQueryClient} from 'react-query'
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

  const getAllTrainersData = useQuery({
    queryKey: ['getTrainerData'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/add-trainer`, config)
        // console.log(response.data.trainers)
        return response.data.trainers
      } catch (error) {
        throw new Error('Error fetching student data: ' + error.message)
      }
    },
  })

  const useGetSingleTrainerDataById = (id) => {
    return useQuery({
      queryKey: ['getTrainerData', id],
      queryFn: async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/add-Tainer-/${id}`, config)
          return response.data
          //console.log(response)
        } catch (error) {
          throw new Error('Error fetching student data: ' + error.message)
        }
      },
    })
  }

  const updateTrainerDataMutation = useMutation({
    mutationFn: async (id) => {
      // Perform the PUT request using the `id`
      return axios.put(`${BASE_URL}/api/add-trainer/${id.id}`, id, config).then((res) => res.data)
    },

    onSuccess: () => {
      toast.success('Form Updated Successfully !!')
    },
    onSettled: async (_, error) => {
      if (error) {
        toast.error('Error while updating form:', error)
      } else {
        await queryClient.invalidateQueries({
          queryKey: ['getTrainerData'],
        })
      }
    },
  })

  const deleteTrainerDataMutation = useMutation({
    mutationFn: async (id) => {
      return axios.delete(`${BASE_URL}/api/add-trainer/${id}`, config).then((res) => res.data)
    },
    onSuccess: () => {
      // toast.success('Form Deleted  Successfully!!')
    },
    onSettled: async (_, error) => {
      if (error) {
        // toast.error('Error While Deleting Form:', error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getTrainerData']})
      }
    },
  })

  return (
    <attendanceContext.Provider
      value={{
        createTrainerData,
        getAllTrainersData,
        updateTrainerDataMutation,
        deleteTrainerDataMutation,
        useGetSingleTrainerDataById,
      }}
    >
      {children}
    </attendanceContext.Provider>
  )
}

export const useAttendanceContext = () => {
  const context = useContext(attendanceContext)
  if (!context) {
    throw new Error('useAttendanceContext must be used within attendanceContextProvider')
  }
  return context
}
