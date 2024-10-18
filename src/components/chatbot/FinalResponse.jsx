import React, { useRef, useState } from 'react';
import Text from '../../helpers/Text';
import upload from '../../assets/icon.svg';
import Table from '../Table';
import { errorToast } from '../../helpers/helper';
import { pythonApi } from '../../api/pythonAPI';
import ConfirmPopup from '../../helpers/common/modals/ConfirmPopup';
import { marked } from 'marked';

const data = [
    {
        resume_no: 1,
        candidate_name: "Alex",
        percentage_score: 70,
        brief: 'dummy text 1',
        points: 'dummy text 1',
    },
    {
        resume_no: 2,
        candidate_name: "Mathew",
        percentage_score: 90,
        brief: 'dummy text 2',
        points: 'dummy text 2',
    },
    {
        resume_no: 3,
        candidate_name: "Rex",
        percentage_score: 50,
        brief: 'dummy text 3',
        points: 'dummy text 3',
    },

];


const FinalResponse = (props) => {
    const { finalResponse, handleReset } = props;
    const fileInputRef = useRef(null);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [selectedFiles, setSelectFiles] = useState([]);
    const [data, setData] = useState([]);
    const [loader, setLoader] = useState(false);
    const [generatingMore, setGeneratingMore] = useState(false);
    const [activeGenerate, setActiveGenerate] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const handleImageClick = () => {
        if (!loader) {
            fileInputRef.current.click();
            setSelectFiles([])
        }
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        if (files.length > 10) {
            errorToast("More then 10 files are not allowed")
            return;
        } else {
            setActiveGenerate(true);
            setSelectFiles(files)
        }

    };

    const columns = [
        {
            title: 'Resume No.',
            key: 'resume_no',
            type: 'sr',
            extend: false,
            align: 'left'
        },
        {
            title: 'Candidate Name',
            key: 'candidate_name',
            type: 'text',
            extend: false,
            align: 'left'
        },
        {
            title: 'Percentage Score',
            key: 'percentage_score',
            type: 'text',
            extend: false,
            align: 'left'
        },
        {
            title: 'Brief Analysis',
            key: 'brief',
            type: 'multiline',
            extend: true,
            align: 'left'
        },
        {
            title: 'Key Points for Interview',
            key: 'points',
            type: 'points',
            extend: true,
            align: 'left'
        }
    ];

    const handleGenerateClick = async () => {
        if (selectedFiles.length === 0) {
            errorToast("Please select a file to generate analysis")
            return;
        }
        if (!activeGenerate) return;
        setData(pre => []);
        setShowAnalysis(false);
        const data = new FormData();
        const arr = [];
        let selected = [];
        selectedFiles?.forEach((file, index) => {
            selected.push(file);
            if ((index + 1) % 2 === 0) {
                arr.push(selected);
                selected = [];
            }
            // data.append(`files`, file);  
        });
        if (selected.length) {
            arr.push(selected);
        }
        if (arr.length > 0) {
            setLoader(true)
            await Promise.all(arr.map(item => uploadFiles(item))).then((values) => {
                return values
            });
        }
        // data.append("job_id", finalResponse.job_id);
        // setShowAnalysis(false);
        // setLoader(true);
        // pythonApi.uploadResume(data).then((response) => {
        //     setLoader(false);
        //     setActiveGenerate(false);
        //     const res = response.data.data;
        //     if (res && res.analysis) {
        //         setData(res.analysis.map((item, index) => ({
        //             resume_no: index + 1,
        //             candidate_name: item.candidate_name,
        //             percentage_score: item.percent_score,
        //             brief: item.brief_analysis,
        //             points: item.interview_points,
        //         })))
        //         setShowAnalysis(true);
        //     }
        // });
    }

    const uploadFiles = (files) => {
        const data = new FormData();
        files?.forEach((file, index) => {
            data.append(`files`, file);
        });
        data.append("job_id", finalResponse.job_id);
        // setLoader(true);
        setGeneratingMore(true)
        pythonApi.uploadResume(data).then((response) => {
            setActiveGenerate(false);
            setLoader(false);
            setGeneratingMore(false)
            setShowAnalysis(true);
            const res = response?.data?.data;
            if (res && res?.analysis) {
                const analysis = res.analysis.filter(analysis => analysis)
                setData(pre => ([...pre,
                ...analysis?.map((item, index) => ({
                    resume_no: index + 1,
                    candidate_name: item?.candidate_name || "",
                    percentage_score: parseInt((parseInt(item?.experience_percent_score)*0.2 +parseInt(item?.qualifications_percent_score)*0.2 + parseInt(item?.technologies_percent_score)*0.6 )) || "",
                    brief: item?.brief_analysis || "",
                    points: item?.interview_points || "",
                }))]))
            }
        });
    }

    const reset = () => {
        handleReset();
        setShowAnalysis(false)
        setSelectFiles([])
        setData([])
        setLoader(false);
    }


    return (
        <div className=' w-full flex flex-col gap-[3rem] px-2'>
            <div className='h-[4rem] md:h-[8rem] text-[2rem] md:text-[3rem]  flex justify-center items-center mx-auto '>
                <Text text={'Final Response'} />
            </div>

            <div className='px-8 flex flex-col w-full '>
                <p className='text-xl md:text-2xl'>Final Response :</p>
                {/* <p className='text-sm md:text-md my-2 font-light' dangerouslySetInnerHTML={{
                    __html: finalResponse?.description.replace(/(\r\n|\r|\n)/g, '<br />')
                }}></p> */}
                <p
                    className='text-sm md:text-md my-2 font-light'
                    dangerouslySetInnerHTML={{
                        __html: marked(finalResponse?.description)
                    }}
                ></p>
                <div className='border w-full'></div>
            </div>


            <div className='h-[3rem] md:h-[8rem] mt-[3rem] text-center text-[1.5rem] md:text-[3rem] flex justify-center items-center mx-auto '>
                <Text text={'Compare above response with your file'} />
            </div>

            <div className='p-[3rem] md:p-[5rem] border rounded-xl mt-[3rem] flex justify-center items-center mx-auto '>
                <div className='flex flex-col justify-center items-center mx-auto '>
                    <img
                        loading="lazy"
                        src={upload}
                        onClick={handleImageClick}
                        className={`${loader ? "cursor-not-allowed" : "cursor-pointer"} w-[10rem] aspect-[3.33]`}
                    />
                    {selectedFiles.length > 0 && <p onClick={handleImageClick} className={loader ? "cursor-not-allowed" : "cursor-pointer"}>{selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""} selected</p>}

                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                        multiple
                        accept=".pdf,.docx"
                    />

                </div>
            </div>

            <button
                onClick={handleGenerateClick}
                className={`${loader ? "cursor-not-allowed" : "cursor-pointer"} my-[2rem] mb-[4rem] md:mb-0 w-full sm:w-[28rem] mx-auto bg-green-500 text-lg md:text-xl text-white py-3 rounded-xl`}
            >
                {loader && <i className="animate-spin fa-solid fa-circle-notch" />} Generate Analysis
            </button>


            {/* <div className='h-[5rem] md:h-[8rem] mt-[3rem] text-[2rem] md:text-[3rem] flex justify-center items-center mx-auto '>
                <Text text={'Approximate percentage score'} />
            </div> */}

            {/* <div className=' mt-[3rem] flex justify-center items-center mx-auto '>
                <div className='md:text-5xl text-2xl flex justify-center items-center mx-auto '>
                    80%
                </div>
            </div> */}


            {showAnalysis &&
                <>
                    <div className='h-[4rem] md:h-[7rem] mt-[3rem] text-[2rem] md:text-[3rem] flex justify-center items-center mx-auto '>
                        <Text text={'Analysis'} />
                    </div>



                    <div className="md:w-[90%] w-full mx-auto mt-4 px-3">
                        <Table
                            columns={columns}
                            data={data}
                            name={'table'}
                        // bottomBorder={totalCount > selectedPerPage?.value}
                        // setSortBy={(sort) => handleSortBy(sort)}
                        // refreshTable={refreshTable}
                        // loader={loader}
                        />
                    </div>
                    {(generatingMore) && <div className='w-full text-center -mt-4'>Generating More...</div>}

                    <div className=' my-[3.5rem] w-full  md:w-[30rem] flex flex-col gap-5 justify-center items-center mx-auto '>
                        {/* <button className='w-full bg-green-700 text-xl text-white py-3 rounded-xl'>Save response</button> */}
                        {/* <button className='w-full bg-purple-800 text-xl text-white py-3 rounded-xl'>Send via mail</button> */}
                        <button onClick={reset} className='w-full bg-gray-500 text-xl text-white py-3 rounded-xl'>Reset</button>


                    </div>
                </>
            }

            <ConfirmPopup
                open={confirm}
                setOpen={setConfirm}
                setAccepted={reset}
                message={"Do you realy want to reset!"}
                handleNo={() => { }}
            />

            {/* <div className='px-8 flex flex-col w-full '>
                <p className='text-2xl'>Analysis of the comparison :</p>
                <p className='text-md my-2 font-light'>Lorem ipsum dolor sit amet, uada fames ac turpis egestas. Nullam in aliquet dolor. Fusce nec fermentum nisl. Aliquam erat volutpat. Duis ac turpis pretium, molestie eros nec, feugiat velit. Aenean ultricies nisl odio, vel gravida ligula tristique nec. Donec condimentum lectus vitae ligula feugiat, nec blandit nisl bibendum. Duis eu consectetur ligula.
                    Phasellus non eit nec arcu vehicula, id aliquet  ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse potenti. Donec sed ex non ex fringilla varius.</p>
                <p className='text-md my-2 font-light'>Lorem ipsum dolor sit amet, uada fames ac turpis egestas. Nullam in aliquet dolor. Fusce nec fermentum nisl. Aliquam erat volutpat. Duis ac turpis pretium, molestie eros nec, feugiat velit. Aenean ultricies nisl odio, vel gravida ligula tristique nec. Donec condimentum lectus vitae ligula feugiat, nec blandit nisl bibendum. Duis eu consectetur ligula.
                    Phasellus non eit nec arcu vehicula, id aliquet  ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse potenti. Donec sed ex non ex fringilla varius.</p>
                <div className='border w-full'></div>

                <p className='mt-3 text-2xl'>Points to remember:</p>
                <div className='mt-3 flex items-center gap-[3rem] '>
                    <div className='flex rounded-full  w-[18px] md:h-[1rem] md:w-[1rem] bg-purple-950 '>
                    </div>

                    <p className=' self-center text-md'>Phasellus non eit nec arcu vehicula, id aliquet  ipsum primis</p>
                </div>

                <div className='mt-3 flex  items-center gap-[3rem] '>
                    <div className='flex rounded-full h-[10px] w-[18px] md:h-[1rem] md:w-[1rem] bg-purple-950 '>
                    </div>

                    <p className=' text-md'>Phasellus non eit nec arcu vehicula, id aliquet  ipsum primis</p>
                </div>

                <div className='mt-3 flex  items-center gap-[3rem] '>
                    <div className='flex rounded-full w-[18px] md:h-[1rem] md:w-[1rem] bg-purple-950 '>
                    </div>

                    <p className=' text-md'>Phasellus non eit nec arcu vehicula, id aliquet  ipsum primis</p>
                </div>

                <div className='mt-3 flex  items-center gap-[3rem] '>
                    <div className='flex rounded-full  w-[18px] md:h-[1rem] md:w-[1rem] bg-purple-950 '>
                    </div>

                    <p className=' text-md'>Phasellus non eit nec arcu vehicula, id aliquet  ipsum primis</p>
                </div>
                <div className='border mt-3 w-full'></div>


            </div> */}



        </div>
    );
};

export default FinalResponse;