import { useState } from "react";
import { KTIcon, toAbsoluteUrl } from "../../../_metronic/helpers"
import { Dropdown1 } from "../Alert_Pending_NewStudents/DropDown1"
import { useParams } from "react-router-dom";
import { useStudentCourseFeesContext } from "../courseFees/StudentCourseFeesContext";

const NewStudentAdmissionPaidCollection = () => {

    const [toDate] = useState(new Date());
    const paramsData = useParams();
    const ctx = useStudentCourseFeesContext();
    const { data, isLoading } = ctx.useGetStudentMonthlyCourseFeesCollection(paramsData?.id);

    // Filter data for students who paid in the current month
    const filteredData = data?.filter((item) => {
        const expirationDate = new Date(item?.expiration_date);
        return (
            item?.studentInfo?.no_of_installments === item?.installment_number &&
            item.dropOutStudent === false &&
            expirationDate.getMonth() === toDate.getMonth() && // Match the current month
            expirationDate.getFullYear() === toDate.getFullYear() // Match the current year
        );
    });

    // console.log(filteredData)

    // Show only the top 10 results
    const topTenData = filteredData?.slice(0, 10);

    // Calculate the total monthly collection for all students in the current month
    const totalMonthlyCollection = filteredData?.reduce((total, collection) => {
        return total + collection?.installment_amount;
    }, 0);


    return (
        <div className={`card`}>
            {/* begin::Beader */}
            <div className='card-header border-0 py-5'>
                <h3 className='card-title align-items-start flex-column'>
                    <span className='card-label fw-bold fs-3 mb-1'>New Students</span>

                    <span className='text-muted fw-semibold fs-7'>Paid Amount Collections</span>
                </h3>

                <div className='card-toolbar'>
                    <span className='text-muted fw-semibold fs-7'>{`Monthly Collection =>`}</span>
                    {/* begin::Menu */}
                    {/* <button
                        type='button'
                        className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
                        data-kt-menu-trigger='click'
                        data-kt-menu-placement='bottom-end'
                        data-kt-menu-flip='top-end'
                    >
                        <KTIcon iconName='category' className='fs-2' />
                    </button> */}
                    {/* <Dropdown1 /> */}
                    {/* end::Menu */}
                </div>
            </div>
            {/* end::Header */}

            {/* begin::Body */}
            <div className='card-body d-flex flex-column'>
                {/* begin::Chart */}
                {/* <div ref={chartRef} className='mixed-widget-5-chart card-rounded-top'></div> */}
                {/* end::Chart */}

                {/* begin::Items */}
                <div className='mt-5'>
                    {/* begin::Item */}
                    <div className='d-flex flex-stack mb-5'>
                        {/* begin::Section */}
                        <div className='d-flex align-items-center me-2'>
                            {/* begin::Symbol */}
                            <div className='symbol symbol-50px me-3'>
                                <div className='symbol-label bg-light'>
                                    <img
                                        src={toAbsoluteUrl('/media/svg/brand-logos/plurk.svg')}
                                        alt=''
                                        className='h-50'
                                    />
                                </div>
                            </div>
                            {/* end::Symbol */}

                            {/* begin::Title */}
                            <div>
                                <a href='#' className='fs-6 text-gray-800 text-hover-primary fw-bold'>
                                    Top Authors
                                </a>
                                <div className='fs-7 text-muted fw-semibold mt-1'>Ricky Hunt, Sandra Trepp</div>
                            </div>
                            {/* end::Title */}
                        </div>
                        {/* end::Section */}

                        {/* begin::Label */}
                        <div className='badge badge-light fw-semibold py-4 px-3'>+82$</div>
                        {/* end::Label */}
                    </div>
                    {/* end::Item */}

                    {/* begin::Item */}
                    <div className='d-flex flex-stack mb-5'>
                        {/* begin::Section */}
                        <div className='d-flex align-items-center me-2'>
                            {/* begin::Symbol */}
                            <div className='symbol symbol-50px me-3'>
                                <div className='symbol-label bg-light'>
                                    <img
                                        src={toAbsoluteUrl('/media/svg/brand-logos/figma-1.svg')}
                                        alt=''
                                        className='h-50'
                                    />
                                </div>
                            </div>
                            {/* end::Symbol */}

                            {/* begin::Title */}
                            <div>
                                <a href='#' className='fs-6 text-gray-800 text-hover-primary fw-bold'>
                                    Top Sales
                                </a>
                                <div className='fs-7 text-muted fw-semibold mt-1'>PitStop Emails</div>
                            </div>
                            {/* end::Title */}
                        </div>
                        {/* end::Section */}

                        {/* begin::Label */}
                        <div className='badge badge-light fw-semibold py-4 px-3'>+82$</div>
                        {/* end::Label */}
                    </div>
                    {/* end::Item */}

                    {/* begin::Item */}
                    <div className='d-flex flex-stack'>
                        {/* begin::Section */}
                        <div className='d-flex align-items-center me-2'>
                            {/* begin::Symbol */}
                            <div className='symbol symbol-50px me-3'>
                                <div className='symbol-label bg-light'>
                                    <img
                                        src={toAbsoluteUrl('/media/svg/brand-logos/vimeo.svg')}
                                        alt=''
                                        className='h-50'
                                    />
                                </div>
                            </div>
                            {/* end::Symbol */}

                            {/* begin::Title */}
                            <div className='py-1'>
                                <a href='#' className='fs-6 text-gray-800 text-hover-primary fw-bold'>
                                    Top Engagement
                                </a>

                                <div className='fs-7 text-muted fw-semibold mt-1'>KT.com</div>
                            </div>
                            {/* end::Title */}
                        </div>
                        {/* end::Section */}

                        {/* begin::Label */}
                        <div className='badge badge-light fw-semibold py-4 px-3'>+82$</div>
                        {/* end::Label */}
                    </div>
                    {/* end::Item */}
                </div>
                {/* end::Items */}
            </div>
            {/* end::Body */}
        </div>
    )
}
export default NewStudentAdmissionPaidCollection