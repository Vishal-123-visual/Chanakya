import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {CheckCircle} from 'lucide-react'
import './PaymentSuccessPage.css' // Import the CSS file
import {useAuth} from '../../modules/auth'

const PaymentSuccessPage = ({studentId}) => {
  const {currentUser} = useAuth()
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(5) // Initialize countdown at 5 seconds

  useEffect(() => {
    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer) // Clear interval when countdown reaches 1
          if (currentUser?.role === 'student') {
            navigate(`/profile/student/${studentId}`)
          } else {
            navigate(`/dashboard`)
          }
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer) // Cleanup interval on unmount
  }, [navigate, studentId, currentUser?.role, currentUser?.companyName])

  return (
    <div className='payment-success-container'>
      <div className='success-content'>
        <CheckCircle className='success-icon' size={80} />
        <h1 className='success-title'>Payment Successful!</h1>
        <p className='success-message'>Thank you for your payment.</p>
        <p className='redirect-message'>
          Redirecting to your profile in <span className='countdown'>{countdown}</span> seconds...
        </p>
      </div>
    </div>
  )
}

export default PaymentSuccessPage
