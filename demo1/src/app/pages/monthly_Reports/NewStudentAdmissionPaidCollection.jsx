import { useCallback, useEffect, useState, useRef } from "react";
import { toAbsoluteUrl } from "../../../_metronic/helpers";
import { useParams } from "react-router-dom";
import { useStudentCourseFeesContext } from "../courseFees/StudentCourseFeesContext";

const NewStudentAdmissionPaidCollection = () => {
    const [page, setPage] = useState(1);
    const [totalCollection, setTotalCollection] = useState(0);
    const [totalStudents, setTotalStudents] = useState(0);
    const [allData, setAllData] = useState([]);
    const [toDate] = useState(new Date());
    const paramsData = useParams();
    const ctx = useStudentCourseFeesContext();
    const { data, isLoading } = ctx.useGetStudentMonthlyCourseFeesCollection(paramsData?.id);

    // Reference for the scrollable container
    const containerRef = useRef(null);

    // Filter data for new students created in the current month
    useEffect(() => {
        if (data) {
            const filteredData = data.filter((item) => {
                const studentCreationDate = new Date(item?.studentInfo?.createdAt);
                const installmentPaidDate = new Date(item?.createdAt);

                // Check if the student was created in the current month and year
                const isNewStudent = studentCreationDate.getMonth() === toDate.getMonth() &&
                    studentCreationDate.getFullYear() === toDate.getFullYear();

                // Check if the installment was paid in the current month and year
                const isCurrentMonthPayment = installmentPaidDate.getMonth() === toDate.getMonth() &&
                    installmentPaidDate.getFullYear() === toDate.getFullYear();

                return isNewStudent && isCurrentMonthPayment &&
                    item?.studentInfo?.no_of_installments === item?.installment_number &&
                    item.dropOutStudent === false;
            });

            const topData = filteredData.slice(0, page * 10);
            setAllData(topData);
            setTotalCollection(filteredData.reduce((total, collection) => total + collection?.installment_amount, 0));
            setTotalStudents(filteredData.length);
        }
    }, [data, page, toDate]);

    // Handle scroll event to load more data
    const handleScroll = useCallback(() => {
        const container = containerRef.current;
        if (container) {
            const bottom = container.scrollHeight === container.scrollTop + container.clientHeight;
            if (bottom && !isLoading) {
                setPage((prevPage) => prevPage + 1);
            }
        }
    }, [isLoading]);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener("scroll", handleScroll);
            return () => container.removeEventListener("scroll", handleScroll);
        }
    }, [handleScroll]);

    const itemHeight = 60; // Adjust this value according to the actual item height
    const maxItems = 7;

    return (
        <div className={`card`}>
            {/* Header */}
            <div className='card-header border-0 py-5'>
                <h3 className='card-title align-items-start flex-column'>
                    <span className='card-label fw-bold fs-3 mb-1'>New Students</span>
                    <span className='text-muted fw-semibold fs-7'>Paid Amount Collections</span>

                </h3>

                <div className='card-toolbar flex-column align-items-start'>
                    <span className='text-muted fw-semibold fs-7'>{`Monthly Collection => ${totalCollection.toFixed(2) || 0}`}</span>
                    <span className='text-muted fw-semibold fs-8'>{`Total Students => ${totalStudents}`}</span>
                </div>
            </div>
            {/* Body */}
            <div className='card-body'>
                <div
                    ref={containerRef}
                    className='scrollable-container mt-5'
                    style={{
                        height: `${itemHeight * maxItems}px`, // Fixed height based on 7 items
                        overflowY: 'auto',
                        paddingRight: '15px', // Adjust for scrollbar width
                    }}
                >
                    <div>
                        {allData?.map((newCollection, index) => (
                            <div key={index} className='d-flex flex-stack mb-5'>
                                <div className='d-flex align-items-center me-2'>
                                    <div className='symbol symbol-50px me-3'>
                                        <div className='symbol-label bg-light'>
                                            <img
                                                src={
                                                    newCollection?.studentInfo?.image
                                                        ? `${process.env.REACT_APP_BASE_URL}/api/images/${newCollection.studentInfo.image}`
                                                        : toAbsoluteUrl('/media/avatars/300-1.jpg')
                                                }
                                                alt='Student'
                                                className='h-50 w-50'
                                                style={{ objectFit: 'cover' }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <a onClick={() => window.open(`/profile/student/${newCollection?.studentInfo?._id}`, '_blank')}
                                            style={{ cursor: 'pointer' }}
                                            className='fs-6 text-gray-800 text-hover-primary fw-bold'>
                                            {newCollection?.studentInfo?.name}
                                        </a>
                                        <div className='fs-7 text-muted fw-semibold mt-1'>
                                            {newCollection?.courseName?.courseName}
                                        </div>
                                    </div>
                                </div>

                                <div className='badge badge-light fw-semibold py-4 px-3'>
                                    {newCollection?.installment_amount.toFixed(2)}
                                </div>
                            </div>
                        ))}
                        {Array.from({ length: maxItems - allData.length }).map((_, index) => (
                            <div className='d-flex flex-stack mb-5' key={`placeholder-${index}`}>
                                {/* Empty placeholders */}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewStudentAdmissionPaidCollection;
