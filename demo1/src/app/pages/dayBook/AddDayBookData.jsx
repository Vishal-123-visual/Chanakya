import React, {useState} from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {usePaymentOptionContextContext} from '../payment_option/PaymentOption.Context'

const AddDayBookData = ({totalBalance}) => {
  const [formData, setFormData] = useState({
    dayBookDatadate: new Date(),
    accountName: '',
    naretion: '',
    debit: 0,
    credit: 0,
    dayBookAccountId: '',
    accountType: '',
  })
  const dayBookAccountCtx = usePaymentOptionContextContext()

  const handleDateChange = (date) => {
    setFormData({...formData, dayBookDatadate: date})
  }

  console.log(typeof +formData.debit)

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
    try {
      // Handle form submission, e.g., send data to the server or update state
      //console.log(formData)
      // Optionally update totalAmount
      if (totalBalance < Number(formData.debit)) {
        alert(`Your total balance is less than to do debit ${formData.debit}`)
        setFormData({
          dayBookDatadate: new Date(),
          accountName: '',
          naretion: '',
          debit: 0,
          credit: 0,
          dayBookAccountId: '',
        })
        return
      }
      dayBookAccountCtx.createDayBookDataMutation.mutate(formData)
      setFormData({
        dayBookDatadate: new Date(),
        accountName: '',
        naretion: '',
        debit: 0,
        credit: 0,
        dayBookAccountId: '',
      })
    } catch (error) {
      console.log(error)
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
              {item.accountName} - {item.accountType}
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
          name='debit'
          placeholder='Enter debit'
          value={formData.debit}
          onChange={handleInputChange}
          readOnly={formData.accountType === 'Income'}
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
          readOnly={formData.accountType === 'Expense'}
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
