import React, { useEffect, useState } from 'react';
import Table from '../Table';
import Loader from '../../helpers/common/Loader';
import { pythonApi } from '../../api/pythonAPI';
import Text from '../../helpers/Text';

const data = [
    {
        resume_no: 1,
        jd_id: "12312-1231-123",
        description: "Job description identifier"

    },
    {
        resume_no: 2,
        jd_id: "123-432-243-532",
        description: "Job description identifier"

    },
    {
        resume_no: 3,
        jd_id: "2342-25325-25",
        description: "Job description identifier"

    },
    {
        resume_no: 4,
        jd_id: "2342-25325-259",
        description: "Job description identifier"

    },
    {
        resume_no: 5,
        jd_id: "2341-25325-25",
        description: "Job description identifier"

    },
];

const RecentResponses = (props) => {

    const { onSelect, action } = props;
    const [loader, setLoader] = useState(false)
    const [data, setData] = useState([]);

    useEffect(() => {
        setLoader(true)
        pythonApi.getFinalResponse().then((res) => {
            setLoader(false)
            // console.log("res", res.data);
            let response = res?.data?.data;
            setData(pre => response.map((item, index) => {
                // const jobTitleMatch = item.job_description.match(/Job Title:\s*(.*)/);
                // const jobTitle = jobTitleMatch ? jobTitleMatch[1] : "";
                const jobTitle = item.job_name.split("_")[0];
                return {
                    ...item,
                    resume_no: index + 1,
                    description: item.job_description,
                    jobTitle: jobTitle
                }
            }));
        });
    }, []);

    const columns = [
        {
            title: 'Sr No.',
            key: 'resume_no',
            type: 'text',
            isDownload: true,
            extend: false,
            align: 'left',
            className: "text-nowrap"
        },
        {
            title: 'Job Title',
            key: 'jobTitle',
            type: 'text',
            isDownload: true,
            extend: false,
            align: 'left'
        },
        {
            title: 'Created On',
            key: 'created_at',
            type: 'date',
            isDownload: true,
            extend: false,
            align: 'left',
            className: "text-nowrap"
        },
        ...(action ? [{
            title: 'action',
            key: '',
            type: 'action',
            isDownload: true,
            align: 'left'
        }] : []),
    ];

    return (
        <div className='mt-[5rem] w-full h-[25rem] flex gap-5'>
        <div className="w-full mt-4 px-3 h-full">
            {loader ? (
                <div>
                    <Loader />
                </div>
            ) : (
                <Table
                    columns={columns}
                    data={data}
                    name={'table'}
                    onClickRow={onSelect}
                // bottomBorder={totalCount > selectedPerPage?.value}
                // setSortBy={(sort) => handleSortBy(sort)}
                // refreshTable={refreshTable}
                // loader={loader}
                />
            )}
        </div>


    </div>
    );
    
};

export default RecentResponses;