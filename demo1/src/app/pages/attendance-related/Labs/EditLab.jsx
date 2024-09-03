import { useEffect, useState } from "react";
import { useAttendanceContext } from "../AttendanceContext";

const EditLab = ({ selectedLab, setOpenModal }) => {
    const { useGetSingleLabDataById, updateLabDataMutation } = useAttendanceContext();
    const { data } = useGetSingleLabDataById(selectedLab);
    const [labData, setLabData] = useState({});

    useEffect(() => {
        if (data) {
            setLabData(data);
        }
    }, [data]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setLabData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        updateLabDataMutation.mutate({
            id: selectedLab,
            labName: labData?.labName,
        });
        setOpenModal(false)
    };

    return (
        <form className='dynamic-form'>
            <label className='col-lg-4 col-form-label required fw-bold fs-6'>Lab Name</label>
            <input
                type='text'
                name='labName'
                value={labData.labName || ''}
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
                    Update
                </button>
            </div>
        </form>
    );
};

export default EditLab;
