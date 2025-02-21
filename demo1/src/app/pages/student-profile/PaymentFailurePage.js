import React from 'react'
import {useNavigate} from 'react-router-dom'
import {XCircle} from 'lucide-react' // Ensure lucide-react is installed
import './PaymentFailurePage.css' // Import custom CSS for styling

const PaymentFailurePage = ({studentId}) => {
  const navigate = useNavigate()

  const goToProfile = () => {
    navigate(`/profile/student/${studentId}`)
  }

  return (
    <div className='payment-failure-container'>
      <div className='payment-failure-card'>
        {/* Animated Error Icon */}
        <XCircle className='error-icon animate-pulse' size={80} color='#ff4d4d' />

        <h1 className='failure-title'>Payment Failed</h1>
        <p className='failure-message'>
          Oops! Something went wrong. Your payment could not be processed.
        </p>

        <div className='button-group'>
          <button className='profile-button' onClick={goToProfile}>
            🏠 Go to Profile
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentFailurePage
