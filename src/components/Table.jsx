import { ArrowDownTrayIcon, EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import moment from 'moment/moment';
import React, { useState } from 'react';
import { Api } from '../api';

const Table = ({ columns, data, onClickRow }) => {
  const [selected, setSelected] = useState(false);
  const [loader, setLoader] = useState(false)

  const handleRowClick = (item, index) => {
    if (onClickRow) {
      onClickRow(item)
      setSelected(index)
    }
  }

  const formattedData = (rowData, data, type, column, index, rowIndex) => {
    if (type === 'badge') {
      return (
        <p
          className={`inline-flex m-0 rounded-full ${data === 1 ? 'bg-green-100' : 'bg-red-100'
            } px-3 py-[3px] text-md leading-5 capitalize font-semibold tracking-normal ${data === 1 ? 'text-green-700' : 'text-red-700'
            }`}
        >
          {data === 1 ? 'active' : 'inactive'}
        </p>
      );
    } else if (type === 'profile') {
      let username = rowData.name?.split(' ');
      return (
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div>
              {data && <img src={data ? data : ProfilePic} />}
              {!data && (
                <div className="bg-black dark:bg-shoorah-darkBgColor flex justify-center items-center h-10 w-10 rounded-full">
                  <span className="text-white">{username[0]?.charAt(0)}</span>
                  <span className="text-white">{username[1]?.charAt(0)}</span>
                </div>
              )}
            </div>
          </div>
          <div className="ml-4">
            <div className="font-medium dark:text-white text-gray-900">{rowData.name}</div>
            <div className="text-gray-500 lowercase">{rowData?.email}</div>
          </div>
        </div>
      );
    } else if (type === 'action') {
      return (
        <div className="flex items-center justify-end">
          {column.isEdit && (
            <PencilSquareIcon
              className="w-[20px] ml-2 text-shoorah-secondary dark:text-white cursor-pointer"
            // onClick={() => navigate(column.isEdit, { state: { ...rowData, action: 'edit' } })}
            />
          )}
          {column?.isView && (
            <EyeIcon
              className="w-[20px] ml-2 text-shoorah-secondary dark:text-white cursor-pointer"
            // onClick={() => navigate(column.isView, { state: { ...rowData, action: 'edit' } })}
            />
          )}
          {column.isDelete && (
            <TrashIcon
              className="w-[20px] ml-2 text-red-500 cursor-pointer"
            // onClick={() => deleteHandler(rowData?.id || rowData?._id)}
            />
          )}
          {column?.isDownload && (
            loader === rowData.job_id ? <i className="animate-spin fa-solid fa-circle-notch ml-2" /> : <ArrowDownTrayIcon
              className="w-[20px] ml-2 text-purple-900 cursor-pointer"
              onClick={() => downloadReport(rowData)}
            />
          )}
        </div>
      );
    } else if (type === 'boolean') {
      return (
        <>
          <p
            className="w-[3rem] min-w-[2rem] inline-block overflow-hidden overflow-ellipsis text-center"
            id={column.key + rowData.id}
          >
            {data ? 'Yes' : 'No'}
          </p>
        </>
      );
    } else if (type === 'text') {
      return data ? (
        <>
          {data}
        </>
      ) : (
        '0'
      );
    } else if (type === 'date') {
      return data ? moment(data).format('MMM D, YYYY') : 'N/A';
    } else if (type === 'multiline') {
      return (
        <p
          className="w-[32rem] min-w-[5rem] inline-block text-justify whitespace-normal"
          id={column.key + rowData.id}
        >
          {data}
        </p>
      )
    } else if (type === 'points') {
      return (
        <>
          {data?.map((item, index) => (
            <p key={index}>* {item}</p>
          ))}
        </>
      )
    } else if (type === "sr") {
      return (
        <p>{rowIndex + 1}</p>
      )
    }
  };

  const downloadReport = async (data) => {
    let payload = {
      jobId: data.job_id,
      fileName: "Job-Description"
    };
    // setLoader(true);
    setLoader(data.job_id)
    await Api.downloadResponse(payload).then((res) => {
      setLoader(false);
      if (res.data.data) {
        // downloadUrl(res.data.data)
      }


    })
      .catch((err) => {
        setLoader(false);

      });

  };

  return (
    <div className="w-full overflow-x-auto h-full">
      <table className="min-w-full h-max">
        <thead className="rounded-3xl sticky top-0">
          <tr>
            {columns.map((column, index) => (
              <th
                key={column.key}
                className={`px-6 py-3 text-${column.align} bg-purple-800 text-xs md:text-sm font-medium text-white uppercase tracking-wider
                                ${index === 0 ? 'rounded-l-[3rem]' : ''}
                                ${index === columns.length - 1 ? 'rounded-r-[3rem]' : ''} ${column.className}`}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white h-full overflow-y-auto">
          {data.map((data, rowIndex) => (
            <tr onClick={() => handleRowClick(data, rowIndex)} key={rowIndex} className={`border-b border-gray-200 ${onClickRow ? "cursor-pointer" : ""}`}>
              {columns.map((column, index) => (
                <td
                  className={`whitespace-nowrap px-6 py-4 
                    ${column.align === 'left'
                      ? 'text-left'
                      : column.align == 'center'
                        ? 'text-center'
                        : 'text-right'
                    } 
                    p-3 text-sm text-gray-700 
                    ${column.transform ? column.transform : ''} 
                    ${index === 0 ? 'rounded-l-[3rem]' : ''}
                    ${index === columns.length - 1 ? 'rounded-r-[3rem]' : ''}
                    ${selected === rowIndex ? "bg-gray-300" : ""}`}
                  key={column.key}
                >
                  <div className="flex flex-row items-center gap-2">
                    <div className="whitespace-nowrap">
                      {formattedData(
                        data,
                        data[column.key],
                        column.type,
                        column,
                        index,
                        rowIndex
                      )}
                    </div>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
