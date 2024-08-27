import './CustomModal.css'

const PopUpModal = ({ show, handleClose, children }) => {
    if (!show) {
        return null
    }

    return (
        <div className='modal-overlay'>
            <div className='modal-content'>
                <button className='modal-close' onClick={handleClose}>
                    &times;
                </button>
                {children}
            </div>
        </div>
    )
}

export default PopUpModal
