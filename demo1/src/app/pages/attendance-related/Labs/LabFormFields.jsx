import { useState } from "react"
import { useAttendanceContext } from "../AttendanceContext"
import { useParams } from "react-router-dom"

const LabFormFields = ({ setOpenModal }) => {
    const [inputData, setInputData] = useState('')
    const { createLabData } = useAttendanceContext()
    const params = useParams()
    // console.log(params)

    const handleInputChange = (event) => {
        const { name, value } = event.target
        setInputData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = () => {
        // Send the form data and image to the backend
        const data = {
            labName: inputData.labName,
            companyId: params?.id
        }
        createLabData.mutate(data, {
            onSuccess: () => {
                setOpenModal(false);
            },
            onError: (error) => {
                console.error('Error saving trainer data:', error);
            },
        });
    };

    return (
        <form className='dynamic-form'>
            <label className='col-lg-4 col-form-label required fw-bold fs-6'>Lab Name</label>
            <input
                type='text'
                name='labName'
                value={inputData?.labName || ""}
                onChange={handleInputChange}
                className='form-control form-control-lg form-control-solid'
                placeholder='Lab Name'
            />
            <div className='card-footer d-flex justify-content-end py-2'>
                <button
                    type='button'
                    className='btn btn-primary d-flex justify-content-end top-5'
                    onClick={handleSubmit}
                >
                    Save
                </button>
            </div>
        </form>
    )
}

export default LabFormFields