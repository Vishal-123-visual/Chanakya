import {createContext, useContext, useState} from 'react'
import axios from 'axios'
import {useQueryClient, useMutation, useQuery} from 'react-query'
import {useAuth} from '../../modules/auth'

const CompanyContext = createContext()

const BASE_URL = process.env.REACT_APP_BASE_URL

export const CompanyContextProvider = ({children}) => {
  const queryClient = useQueryClient()
  const {auth} = useAuth()
  let config = {
    headers: {
      Authorization: `Bearer ${auth?.api_token}`,
    },
  }

  const getCourseLists = useQuery({
    queryKey: ['getCourseLists'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/courses`, config)
        return response.data
      } catch (error) {
        throw new Error('Error fetching student data: ' + error.message)
      }
    },
  })

  //console.log(getCourseLists)

  //console.log(studentsLists)
  const createCourseMutation = useMutation({
    mutationFn: async (data) => {
      //console.log(data)
      return axios
        .post(`${BASE_URL}/api/courses`, data, config)
        .then((res) => localStorage.setItem('AddedNewCourse', JSON.stringify(res.data)))
    },
    onMutate: () => {
      //console.log('mutate')
    },

    onError: () => {
      //console.log('error')
    },

    onSuccess: () => {
      alert('Added Course  Successfully!')
      //console.log('success')
    },

    onSettled: async (_, error) => {
      //console.log('settled')
      if (error) {
        //console.log(error)
        alert(error.response.data.error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getCourseLists']})
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
        await queryClient.invalidateQueries({queryKey: ['getCourseLists']})
      }
    },
  })

  // update Course type
  const updateCourseMutation = useMutation({
    mutationFn: async (updateData) => {
      //console.log(updateData)
      return axios
        .put(`${BASE_URL}/api/courses/${updateData._id}`, updateData, config) // Corrected order of arguments
        .then((res) => res.data)
    },
    onSettled: async (_, error) => {
      if (error) {
        alert('Error while updating student...', error)
      } else {
        await queryClient.invalidateQueries({
          queryKey: ['getCourseLists', 'getNumberOfCourseYearsTypes', 'getCourseSubjectLists'],
        })
      }
    },
  })

  return (
    <CompanyContext.Provider
      value={{
        getCourseLists,
        deleteCourseMutation,
        createCourseMutation,
        updateCourseMutation,
      }}
    >
      {children}
    </CompanyContext.Provider>
  )
}

export const useCompanyContext = () => {
  const context = useContext(CompanyContext)
  if (!context) {
    throw new Error('useAdmissionContext must be used within an AdmissionContextProvider')
  }
  return context
}
