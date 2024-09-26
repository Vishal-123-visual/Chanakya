import {useEffect, useState} from 'react'
import {useCompanyContext} from '../compay/CompanyContext'

const EmailTemplate = () => {
  const companyCTX = useCompanyContext()
  const {data: emailRemainderData} = companyCTX.getEmailRemainderTextMessage
  const {data: emailRemainderDays} = companyCTX.getEmailRemainderDays
  const [textEmailsData, setTextEmailsData] = useState({
    firstRemainder: emailRemainderData[0]?.firstRemainder,
    secondRemainder: emailRemainderData[0]?.secondRemainder,
    thirdRemainder: emailRemainderData[0]?.thirdRemainder,
  })

  const [remainderDays, setRemainderDays] = useState({
    firstRemainderDay: emailRemainderDays[0]?.firstRemainderDay,
    secondRemainderDay: emailRemainderDays[0]?.secondRemainderDay,
    thirdRemainderDay: emailRemainderDays[0]?.thirdRemainderDay,
  })

  // console.log(remainderDays)

  useEffect(() => {
    setTextEmailsData({
      firstRemainder: emailRemainderData[0]?.firstRemainder,
      secondRemainder: emailRemainderData[0]?.secondRemainder,
      thirdRemainder: emailRemainderData[0]?.thirdRemainder,
    })
    setRemainderDays({
      firstRemainderDay: emailRemainderDays[0]?.firstRemainderDay,
      secondRemainderDay: emailRemainderDays[0]?.secondRemainderDay,
      thirdRemainderDay: emailRemainderDays[0]?.thirdRemainderDay,
    })
  }, [emailRemainderData, emailRemainderDays])

  const onChangeHandler = (e) => {
    setTextEmailsData({...textEmailsData, [e.target.name]: e.target.value})
  }

  const onChangeInputHandler = (e) => {
    setRemainderDays({...remainderDays, [e.target.name]: e.target.value})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    try {
      companyCTX.postEmailRemainderText.mutate(textEmailsData)
      companyCTX.postEmailRemainderDays.mutate(remainderDays)
    } catch (error) {
      console.log(error)
    } finally {
      setTextEmailsData({
        firstRemainder: '',
        secondRemainder: '',
        thirdRemainder: '',
      })
      setRemainderDays({
        firstRemainderDay: '',
        secondRemainderDay: '',
        thirdRemainderDay: '',
      })
    }
  }

  return (
    <div className='card p-10'>
      <h1>Email Reminder Text</h1>
      <form onSubmit={handleSubmit}>
        <div className='mb-3'>
          <label htmlFor='firstRemainder' className='form-label'>
            First Reminder
          </label>
          <textarea
            id='firstRemainder'
            value={textEmailsData.firstRemainder}
            onChange={onChangeHandler}
            type='text'
            className='form-control'
            name='firstRemainder'
          />
          {/* <div class='d-flex align-items-center'> */}
          <label class='form-label'> First Remainder Date</label>
          <input
            type='number'
            min={1}
            max={31}
            placeholder='First Remainder Date...'
            name='firstRemainderDay'
            value={remainderDays.firstRemainderDay}
            onChange={onChangeInputHandler}
            class='form-control me-2'
            style={{width: '200px'}}
          />
          {/* </div> */}
        </div>
        <div className='mb-3'>
          <label htmlFor='secondRemainder' className='form-label'>
            Second Reminder
          </label>
          <textarea
            id='secondRemainder'
            value={textEmailsData.secondRemainder}
            onChange={onChangeHandler}
            type='text'
            className='form-control'
            name='secondRemainder'
          />
          <label class='form-label'> Second Remainder Date</label>
          <input
            type='number'
            min={1}
            max={31}
            placeholder='Second Remainder Date...'
            value={remainderDays.secondRemainderDay}
            name='secondRemainderDay'
            onChange={onChangeInputHandler}
            class='form-control me-2'
            style={{width: '200px'}}
          />
        </div>
        <div className='mb-3'>
          <label htmlFor='thirdRemainder' className='form-label'>
            Third Reminder
          </label>
          <textarea
            id='thirdRemainder'
            value={textEmailsData.thirdRemainder}
            onChange={onChangeHandler}
            type='text'
            className='form-control'
            name='thirdRemainder'
          />
          <label class='form-label'> Third Remainder Date</label>
          <input
            type='number'
            min={1}
            max={31}
            value={remainderDays.thirdRemainderDay}
            name='thirdRemainderDay'
            placeholder='Third Remainder Date...'
            class='form-control me-2'
            onChange={onChangeInputHandler}
            style={{width: '200px'}}
          />
        </div>
        <button
          disabled={companyCTX.postEmailRemainderText.isLoading === true}
          type='submit'
          className='btn btn-primary'
        >
          {companyCTX.postEmailRemainderText.isLoading === true ? 'Adding' : 'Submit'}
        </button>
      </form>
    </div>
  )
}

export default EmailTemplate
