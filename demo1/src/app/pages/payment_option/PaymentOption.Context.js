import {createContext, useContext, useState} from 'react'
import axios from 'axios'
import {useQueryClient, useMutation, useQuery} from 'react-query'
import {useAuth} from '../../modules/auth'
const PaymentOptionContext = createContext()

const BASE_URL = process.env.REACT_APP_BASE_URL

export const PaymentOptionContextProvider = ({children}) => {
  const queryClient = useQueryClient()
  const {auth} = useAuth()
  let config = {
    headers: {
      Authorization: `Bearer ${auth?.api_token}`,
    },
  }

  const getPaymentOptionsData = useQuery({
    queryKey: ['getPaymentOptionsLists'],
    queryFn: async () => {
      return axios.get(`${BASE_URL}/api/paymentOptions`, config).then((res) => res.data)
    },
  })

  const createNewPaymentOptionMutation = useMutation({
    mutationFn: async (data) => {
      //console.log(data)
      return axios.post(`${BASE_URL}/api/paymentOptions`, data, config).then((res) => res.data)
    },
    onMutate: () => {
      //console.log('mutate')
    },

    onError: () => {
      console.log('error')
    },

    onSuccess: () => {
      //alert('Added Student  Course fee  Successfully!')
      //console.log('success')
    },

    onSettled: async (_, error) => {
      //console.log('settled')
      if (error) {
        //console.log(error)
        alert(error.response.data.error)
      } else {
        await queryClient.invalidateQueries({
          queryKey: ['getPaymentOptionsLists'],
        })
      }
    },
  })

  // Course Types
  const deleteCourseMutation = useMutation({
    mutationFn: async (id) => {
      return axios.delete(`${BASE_URL}/api/courses/${id}`, config).then((res) => res.data)
    },
    onSuccess: () => {
      alert('Course  deleted successfully')
    },
    onSettled: async (_, error) => {
      if (error) {
        alert(error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getStudentCourseFeesLists']})
      }
    },
  })

  // update Course type
  const updateStudentSingleCourseFeesMutation = useMutation({
    mutationFn: async (updateData) => {
      console.log(updateData)
      return axios
        .put(`${BASE_URL}/api/courseFees/${updateData._id}`, updateData, config) // Corrected order of arguments
        .then((res) => res.data)
    },
    onSettled: async (_, error) => {
      if (error) {
        alert('Error while updating student...', error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getStudentCourseFeesLists']})
      }
    },
  })

  return (
    <PaymentOptionContext.Provider
      value={{
        deleteCourseMutation,
        createNewPaymentOptionMutation,
        updateStudentSingleCourseFeesMutation,
        getPaymentOptionsData,
      }}
    >
      {children}
    </PaymentOptionContext.Provider>
  )
}

export const usePaymentOptionContextContext = () => {
  const context = useContext(PaymentOptionContext)
  if (!context) {
    throw new Error('something went wrong')
  }
  return context
}
