import React, {useState} from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {usePaymentOptionContextContext} from '../payment_option/PaymentOption.Context'
import {toast} from 'react-toastify'

const AddDayBookData = ({totalBalance, companyId}) => {
  const [formData, setFormData] = useState({
    dayBookDatadate: new Date(),
    accountName: '',
    naretion: '',
    debit: 0,
    credit: 0,
    dayBookAccountId: '',
    accountType: '',
    companyId,
  })
  //console.log(formData)

  const dayBookAccountCtx = usePaymentOptionContextContext()

  const handleDateChange = (date) => {
    setFormData({...formData, dayBookDatadate: date})
  }

  const handleAccountNameChange = (event) => {
    const selectedAccount = dayBookAccountCtx.getDayBookAccountsLists.data.find(
      (item) => item.accountName === event.target.value
    )
    setFormData({
      ...formData,
      accountName: event.target.value,
      accountType: selectedAccount ? selectedAccount.accountType : '',
      dayBookAccountId: selectedAccount ? selectedAccount._id : '',
    })
  }

  const handleInputChange = (event) => {
    const {name, value} = event.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (formData.accountName === '') {
      toast.error('Please select account name', {bodyStyle: {fontSize: '18px'}})
      return
    } else if (formData.naretion === '') {
      toast.error('Please enter naretion', {bodyStyle: {fontSize: '18px'}})
      return
    } else if (formData.credit === 0 && formData.debit === 0) {
      toast.error('Please enter either credit or debit', {bodyStyle: {fontSize: '18px'}})
      return
    } else if (totalBalance < Number(formData.debit)) {
      toast.error(`Your total balance is less than the debit amount ${formData.debit}`, {
        bodyStyle: {fontSize: '18px'},
      })
      return
    }

    try {
      const {error} = dayBookAccountCtx.createDayBookDataMutation.mutate(formData)
      if (error.message) {
        toast.error(error.message, {bodyStyle: {fontSize: '18px'}})
        return
      } else {
        toast.success('Day Account Data added successfully!', {bodyStyle: {fontSize: '18px'}})
        setFormData({
          dayBookDatadate: new Date(),
          accountName: '',
          naretion: '',
          debit: 0,
          credit: 0,
          dayBookAccountId: '',
          accountType: '',
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <tr>
      <td>
        <div className='form-check form-check-sm form-check-custom form-check-solid'>
          {/* <input className='form-check-input widget-9-check' type='checkbox' value='1' /> */}
        </div>
      </td>
      <td></td>
      <td>
        <DatePicker
          selected={formData.dayBookDatadate}
          onChange={handleDateChange}
          dateFormat='dd/MM/yyyy'
          className='form-control form-control-lg form-control-solid'
          placeholderText='DD/MM/YYYY'
        />
      </td>
      <td></td>
      <td>
        <input
          type='search'
          className='form-control'
          value={formData.accountName}
          onChange={handleAccountNameChange}
          list='accountNameOptions'
          placeholder='Search account'
        />
        <datalist id='accountNameOptions'>
          {dayBookAccountCtx.getDayBookAccountsLists.data.map((item) => (
            <option key={item._id} value={item.accountName}>
              {item.accountName}
            </option>
          ))}
        </datalist>
      </td>
      <td>
        <input
          type='text'
          className='form-control'
          name='naretion'
          placeholder='Enter naretion'
          value={formData.naretion}
          onChange={handleInputChange}
        />
      </td>
      <td>
        <input
          type='number'
          className='form-control'
          name='credit'
          placeholder='Enter credit'
          value={formData.credit}
          onChange={handleInputChange}
          readOnly={+formData.debit !== 0}
        />
      </td>
      <td>
        <input
          type='number'
          className='form-control'
          name='debit'
          placeholder='Enter debit'
          value={formData.debit}
          onChange={handleInputChange}
          readOnly={+formData.credit !== 0}
        />
      </td>
      <td>
        <div className='d-flex justify-content-end flex-shrink-0'>
          <button
            type='submit'
            className='btn btn-success btn-active-color-primary btn-sm me-1 px-5'
            onClick={handleSubmit}
          >
            Add
          </button>
        </div>
      </td>
    </tr>
  )
}

export default AddDayBookData
