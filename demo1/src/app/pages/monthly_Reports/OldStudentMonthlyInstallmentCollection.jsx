import { useParams } from "react-router-dom";
import { useStudentCourseFeesContext } from "../courseFees/StudentCourseFeesContext";
import { useState, useEffect, useCallback } from "react";
import { toAbsoluteUrl } from "../../../_metronic/helpers";

const OldStudentMonthlyInstallmentCollection = () => {
    const [toDate] = useState(new Date());
    const [page, setPage] = useState(1);
    const [totalCollection, setTotalCollection] = useState(0);
    const [allData, setAllData] = useState([]);
    const paramsData = useParams();
    const ctx = useStudentCourseFeesContext();
    const { data, isLoading } = ctx.useGetStudentMonthlyCourseFeesCollection(paramsData?.id);

    // Calculate total collection from all loaded data
    useEffect(() => {
        if (data) {
            const filteredData = data.filter((item) => {
                const expirationDate = new Date(item?.expiration_date);
                return (
                    item?.studentInfo?.no_of_installments === item?.installment_number &&
                    item.dropOutStudent === false &&
                    expirationDate.getMonth() === toDate.getMonth() &&
                    expirationDate.getFullYear() === toDate.getFullYear()
                );
            });
            const topData = filteredData.slice(0, page * 10);
            setAllData(topData);
            setTotalCollection(filteredData.reduce((total, collection) => total + collection?.installment_amount, 0));
        }
    }, [data, page, toDate]);

    // Handle scroll event to load more data
    const handleScroll = useCallback(() => {
        const container = document.querySelector('.scrollable-container');
        const bottom = container.scrollHeight === container.scrollTop + container.clientHeight;
        if (bottom && !isLoading) {
            setPage((prevPage) => prevPage + 1);
        }
    }, [isLoading]);

    useEffect(() => {
        const container = document.querySelector('.scrollable-container');
        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    return (
        <div className={`card`}>
            {/* begin::Header */}
            <div className='card-header border-0 py-5'>
                <h3 className='card-title align-items-start flex-column'>
                    <span className='card-label fw-bold fs-3 mb-1'>Old Students</span>
                    <span className='text-muted fw-semibold fs-7'>Paid Installment Collections</span>
                </h3>

                <div className='card-toolbar'>
                    <span className='text-muted fw-semibold fs-8'>{`Monthly Collection =>  ${totalCollection || 0}`}</span>
                </div>
            </div>
            {/* end::Header */}

            {/* begin::Body */}
            <div className='card-body'>
                <div
                    className='scrollable-container mt-5'
                    style={{
                        maxHeight: '500px', // Adjust height as needed
                        overflowY: 'auto',
                        paddingRight: '15px', // Adjust for scrollbar width
                    }}
                >
                    {/* begin::Items */}
                    {allData.length > 0 ? (
                        allData.map((collection) => (
                            <div className='d-flex flex-stack mb-5' key={collection._id}>
                                {/* begin::Section */}
                                <div className='d-flex align-items-center me-2'>
                                    {/* begin::Symbol */}
                                    <div className='symbol symbol-50px me-3'>
                                        <div className='symbol-label bg-light'>
                                            <img
                                                src={
                                                    collection?.studentInfo?.image
                                                        ? `${process.env.REACT_APP_BASE_URL}/api/images/${collection.studentInfo.image}`
                                                        : toAbsoluteUrl('/media/avatars/300-1.jpg')
                                                }
                                                alt='Student'
                                                className='h-50 w-50'
                                                style={{ objectFit: 'cover' }}
                                            />
                                        </div>
                                    </div>
                                    {/* end::Symbol */}

                                    {/* begin::Title */}
                                    <div>
                                        <a onClick={() => window.open(`/profile/student/${collection?.studentInfo?._id}`, '_blank')}
                                            target="_blank"
                                            className='fs-6 text-gray-800 text-hover-primary fw-bold '>
                                            {collection?.studentInfo?.name}
                                        </a>
                                        <div className='fs-7 text-muted fw-semibold mt-1'>
                                            {collection?.courseName?.courseName}
                                        </div>
                                    </div>
                                    {/* end::Title */}
                                </div>
                                {/* end::Section */}

                                {/* begin::Label */}
                                <div className='badge badge-light fw-semibold py-4 px-3'>
                                    {collection?.installment_amount}
                                </div>
                                {/* end::Label */}
                            </div>
                        ))
                    ) : (
                        <div className='d-flex flex-stack mb-5'>
                            No Collection is Found!!
                        </div>
                    )}
                    {/* end::Items */}
                </div>
            </div>
            {/* end::Body */}
        </div>
    );
};

export default OldStudentMonthlyInstallmentCollection;
