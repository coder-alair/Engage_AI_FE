import React, { useEffect, useState } from "react";
import Header from "../Header";
import Text from "../../helpers/Text";
import Option from "./Option";
import Footer from "../Footer";
import FinalResponse from "./FinalResponse";
import ReusableDropdownInput from "./UserPrompt";
import { pythonApi } from "../../api/pythonAPI";
import { errorToast, getLocalStorageItem } from "../../helpers/helper";
import Modal from "../../helpers/common/modals/Modal";
import LastResponses from "../profile/LastResponses";
import CommonInput from "../../helpers/common/Input/CommonInput";
import { Api } from "../../api";
import locationIcon from "./../../assets/location-pin.svg";
import RecentResponses from "./RecentJobs";

const question1 = "question1";
const question2 = "question2";
const question3 = "question3";
const question4 = "question4";
const question5 = "question5";
const question6 = "question6";
const question7 = "question7";

const AllQuestionsType = {
  [question1]: "job_responsibilities",
  [question2]: "qualifications",
  [question3]: "technologies",
  [question4]: "seniorityLevels",
  [question5]: "contract",
  [question6]: "working_mode",
};

const AllQuestions = {
  question1: "What are the high-level responsibilities for {role}?",
  question2: "What qualifications are required for a {role}?",
  question3: "What technologies is necessary for a {role}?",
  question4: "What experience is necessary for a {role}?",
  question5: "What is the employment type for a {role}?",
  question6: "What is the working mode for a {role}?",
  question7:
    "What are the different rate/salary bands for {contract/fulltime} of the entered {role} in the location ?",
};

const staticQuestions = [
  {
    question: AllQuestions[question1],
    options: [],
    answers: [],
    option: question1,
    show: false,
    multipleSelect: true,
  },
  {
    question: AllQuestions[question2],
    options: [],
    answers: [],
    option: question2,
    show: false,
    multipleSelect: true,
  },
  {
    question: AllQuestions[question3],
    options: [],
    answers: [],
    option: question3,
    show: false,
    multipleSelect: true,
  },
  {
    question: AllQuestions[question4],
    options: [],
    answers: [],
    option: question4,
    show: false,
    multipleSelect: false,
  },
  {
    question: AllQuestions[question5],
    options: [],
    answers: [],
    option: question5,
    show: false,
    multipleSelect: false,
  },
  {
    question: AllQuestions[question6],
    options: [],
    answers: [],
    option: question6,
    show: false,
    multipleSelect: false,
  },
  {
    question: AllQuestions[question7],
    options: [],
    answers: [],
    option: question7,
    show: false,
    multipleSelect: false,
  },
];

// const baseQuestions = [
//     { id: 1, template: "What are the high-level responsibilities for {role}?", options: ["Option 1", "Option 2", "Option 3"] },
//     { id: 2, template: "What skills are required for a {role}?", options: ["Option 1", "Option 2", "Option 3"] },
//     { id: 3, template: "What experience is necessary for a {role}?", options: ["Option 1", "Option 2", "Option 3"] },
//     { id: 4, template: "What education is needed for a {role}?", options: ["Option 1", "Option 2", "Option 3"] },
//     { id: 5, template: "What are the daily tasks of a {role}?", options: ["Option 1", "Option 2", "Option 3"] },
//     { id: 6, template: "What is the career growth for a {role}?", options: ["Option 1", "Option 2", "Option 3"] },
// ];

const Chatbot = () => {
  const [jobRole, setJobRole] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [finalResponse, setFinalResponse] = useState(null);
  const [questions, setQuestions] = useState(
    JSON.parse(JSON.stringify(staticQuestions))
  );
  const [currency, setCurrency] = useState("");
  const [loaderinput, setLoaderInput] = useState(false);
  const [loader, setLoader] = useState(
    Array(staticQuestions.length).fill(false)
  );
  const [locationLoader, setLocationLoader] = useState(false);
  const [showJD, setShowJD] = useState(false);
  const [selectedJD, setSelectedJD] = useState(false);
  const [locationModal, setLocationModal] = useState(false);
  const [locationDetails, setLocationDetails] = useState(null);
  const [updateAddress, setUpdateAddress] = useState(false);
  const [location, setLocation] = useState({
    city: "",
    state: "",
    country: "",
  });

  const handleNext = () => {
    if (jobRole) {
      setLoaderInput(true);
      pythonApi
        .checkRole({ role: jobRole })
        .then((res) => {
          setLoaderInput(false);
          if (res?.data?.data.status) {
            setIsDisabled(true);
            getOptions();
          } else {
            errorToast("Role is not software role");
          }
        })
        .catch((err) => {
          console.error("sdlksd", err);
        });
    }
  };

  const handleNextQuestions = (option) => {
    if (option === question6) {
      get7Options();
    } else if (option === question7) {
      handleFinalResponse();
    } else {
      setQuestions((prevQuestions) => {
        let foundCurrent = false;
        return prevQuestions.map((question, index) => {
          if (foundCurrent) {
            setTimeout(() => {
              setLoader((pre) =>
                pre.map((item, ind) => (ind === index - 1 ? false : item))
              );
            }, 300);
            foundCurrent = false;
            return { ...question, show: true };
          }
          if (question.option === option) {
            setLoader((pre) => pre.map((item, ind) => ind === index));
            foundCurrent = true;
          }
          if (option === question5 && question.option === question7) {
            let newQuestion = AllQuestions[question7].replace(
              "{contract/fulltime}",
              prevQuestions[4].answers[0]
            );
            newQuestion = newQuestion.replace("{role}", jobRole);
            question = {
              ...question,
              question: newQuestion,
            };
          }
          return question;
        });
      });
    }
  };

  const handleAddOptions = (newOptions, currentQuestion) => {
    setQuestions((pre) =>
      pre.map((item) => {
        return {
          ...item,
          ...(item.option === currentQuestion && {
            multipleSelect: true,
            options: [...item.options, newOptions],
          }),
        };
      })
    );
  };

  const handleAnswerClick = (answer, selectedQuestionId) => {
    setQuestions((pre) =>
      pre.map((item) => {
        let retult = item.answers;
        if (item.option === selectedQuestionId) {
          if (item.multipleSelect) {
            retult = item.answers.includes(answer)
              ? item.answers.filter((temp) => temp !== answer)
              : [...item.answers, answer];
          } else {
            retult = [answer];
          }
        }
        return {
          ...item,
          answers: retult,
        };
      })
    );
  };

  const handleFinalResponse = () => {
    const salaryRange = questions[6].answers[0];
    if (!salaryRange) {
      errorToast("please answer Question 7");
      return;
    }
    if (!questions[5].answers.length) {
      errorToast("please answer Question 6");
      return;
    }
    if (!questions[4].answers.length) {
      errorToast("please answer Question 5");
      return;
    }
    const splits = salaryRange.split(" ");
    let salary = "";
    if (splits.length > 1) {
      if (splits[splits.length - 1] === currency) {
        salary = splits[splits.length - 2];
      } else {
        salary = splits[splits.length - 1];
      }
    }

    const body = {
      role: jobRole,
      responsibilities: questions[0].answers,
      qualifications: questions[1].answers,
      technologies: questions[2].answers,
      experience: questions[3].answers,
      iscontract: questions[4].answers[0] === "Contractual",
      salary_range: salary,
      currency: currency,
      working_mode: questions[5].answers[0],
      city: location.city,
      country: location.country,
      state: location.state,
      // "qa_pair": [
      //     {
      //         "question": "string",
      //         "answer": "string"
      //     }
      // ]
    };
    setLoader((pre) => pre.map((item, ind) => ind === 6));
    pythonApi.generateResponse(body).then((res) => {
      setLoader((pre) => pre.map((item, ind) => (ind === 6 ? false : item)));
      let response = res?.data?.data;
      setFinalResponse(response);
    });
  };

  const getOptions = () => {
    setLoaderInput(true);
    pythonApi.preDefineOptions({ job_title: jobRole }).then((temp) => {
      setLoaderInput(false);
      const data = temp?.data?.data;
      if (data && data.options) {
        let obj = {};
        data.options.forEach((item) => {
          obj = { ...obj, ...item };
        });
        setQuestions((pre) =>
          pre.map((item, index) => {
            let newobj = obj[item.option]?.[AllQuestionsType[item.option]];
            if (newobj) {
              newobj = newobj.filter(
                (temp) => temp !== "Part-Time" && temp !== "part-time"
              );
            }
            const replace = item.question.includes("{role}");
            return {
              ...item,
              options: newobj,
              ...(replace && {
                question: item.question.replace("{role}", jobRole),
              }),
              ...(index === 0 && !item.show && { show: true }),
            };
          })
        );
      }
    });
  };

  const get7Options = (newlocation = location) => {
    const body = {
      role: jobRole,
      iscontract: questions[4].answers[0] === "Contractual",
      ...(newlocation && {
        city: newlocation.city,
        state: newlocation.state,
        country: newlocation.country,
      }),
    };
    setLoader((pre) => pre.map((item, ind) => ind === 5));
    pythonApi.get7Question(body).then((temp) => {
      const data = temp?.data?.data;
      setLoader((pre) => pre.map((item, ind) => (ind === 5 ? false : item)));
      setLocationLoader(false);
      if (data) {
        setCurrency(data.currency);
        setQuestions((pre) =>
          pre.map((item, index) => {
            if (item.option === question7) {
              const newobj = data.pay_ranges.map(
                (temp) =>
                  `${temp.level} : ${temp.pay.min}-${temp.pay.max} ${data.currency}`
              );
              let newQuestion = AllQuestions[question7].replace(
                "{contract/fulltime}",
                pre[4].answers[0]
              );
              newQuestion = newQuestion.replace("{role}", jobRole);
              if (newlocation && newlocation.city && newlocation.country) {
                newQuestion = newQuestion.replace(
                  "location",
                  `${newlocation.city}, ${
                    newlocation.state ? newlocation.state + ", " : ""
                  } ${newlocation.country}`
                );
              }
              return {
                ...item,
                options: newobj,
                show: true,
                question: newQuestion,
              };
            } else {
              return item;
            }
          })
        );
      }
      if (data && data.options) {
        let obj = {};
        data.options.forEach((item) => {
          obj = { ...obj, ...item };
        });

        setQuestions((pre) =>
          pre.map((item, index) => {
            if (item.option === question7) {
              const newobj = obj[item.option]?.[AllQuestionsType[item.option]];
              return {
                ...item,
                options: newobj,
                show: true,
              };
            } else {
              return item;
            }
          })
        );
      }
    });
  };

  const handleReset = () => {
    setJobRole("");
    setIsDisabled(false);
    setFinalResponse(null);
    setQuestions(JSON.parse(JSON.stringify(staticQuestions)));
    setCurrency("");
    setLoaderInput(false);
    setLoader(Array(staticQuestions.length).fill(false));
    setShowJD(false);
    setUpdateAddress(true);
  };

  const handleShowJD = () => {
    setShowJD(true);
  };

  const selectJD = (item) => {
    setSelectedJD(item);
  };

  const getResponse = () => {
    setFinalResponse(selectedJD);
    setShowJD(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocationModal((pre) => ({
      ...pre,
      [name]: value,
    }));
  };

  const setNewLocation = () => {
    const updatedLocation = { ...locationModal, newLocation: true };
    setLocation((pre) => updatedLocation);
    setLocationLoader(true);
    get7Options(updatedLocation);
    setLocationModal(false);
  };

  useEffect(() => {
    const userdata = getLocalStorageItem("userData");
    if (userdata) {
      Api.getCompayData(JSON.parse(userdata).companyId)
        .then((res) => {
          setLocationDetails(res?.data?.data);
          setUpdateAddress(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  useEffect(() => {
    if (updateAddress) {
      setUpdateAddress(false);
      if (locationDetails) {
        const company = locationDetails;
        setLocation({
          city: company.city,
          state: company.province || company.state,
          country: company.country,
        });
      }
    }
  }, [updateAddress]);

  
  return (
    <div className="w-screen relative h-screen overflow-y-auto hide-scrollbar ">
      <div className="w-full  h-[8rem] ">
        <Header />
      </div>

      <div className="w-full min-h-full relative  font-medium flex flex-col ">
        <div className="h-[7rem] md:h-[15rem] text-[2.5rem] md:text-[3rem] flex justify-center items-center mx-auto ">
          <Text text={"Recruit AI"} />
        </div>
        {jobRole ? null : (
          <div className="w-full px-6 flex flex-row justify-center">
            <button
              onClick={handleShowJD}
              className={`cursor-pointer md:text-xl my-[1rem] w-[90%] sm:w-[25rem] mx-auto bg-green-500 text-md text-white py-3 rounded-xl`}
            >
              Retrieve Recent Job Descriptions
            </button>
          </div>
        )}
        {showJD && (
          <Modal
            isOpen={showJD}
            onClose={() => {
              setShowJD(false);
              setSelectedJD(false);
            }}
            title={"Select Job Detail"}
            keepMounted
            parentClassName={"overflow-x-hidden"}
          >
            <div className="min-w-max -mt-[5rem]">
              <div className="w-full h-full">
                <RecentResponses onSelect={selectJD} />
              </div>
              <div className="w-full flex flex-row justify-center pt-6">
                <button
                  onClick={getResponse}
                  className={`cursor-pointer my-[1rem] w-[10rem] mx-auto bg-green-500 text-xl text-white py-3 rounded-xl`}
                >
                  Get Response
                </button>
              </div>
            </div>
          </Modal>
        )}
        <div className=" flex-col gap-[2rem] w-[80%] flex justify-center items-center mx-auto ">
          <ReusableDropdownInput
            handleNext={handleNext}
            parentInputValue={jobRole}
            setParentInputValue={setJobRole}
            isDisabled={finalResponse || isDisabled}
            setQuestions={setQuestions}
            loader={loaderinput}
          />
        </div>

        <div className=" w-full mx-auto  h-fit ">
          {questions?.map((question, index) => {
            return !question.show ? null : (
              <div
                key={question.option}
                className=" my-[4rem]  w-[80%] mx-auto flex justify-center items-center "
              >
                <Option
                  title={`Question ${index + 1}`}
                  question={question}
                  handleNextQuestions={handleNextQuestions}
                  handleAnswerClick={handleAnswerClick}
                  handleAddOptions={handleAddOptions}
                  loader={loader[index]}
                  disable={!question.answers.length || finalResponse}
                  disabledOptions={finalResponse}
                  icon={
                    question.option === question7 ? (
                      <>
                        <span
                          style={{
                            fontSize: "8px",
                            color: "grey",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          Change location
                        </span>
                        <img
                          onClick={() => setLocationModal({ ...location })}
                          className={`aspect-[3.33] h-[2rem] w-[2rem] ${
                            finalResponse
                              ? "cursor-not-allowed"
                              : "cursor-pointer"
                          } ${locationLoader ? "transition-opacity" : ""}`}
                          src={locationIcon}
                          alt="location"
                        />
                      </>
                    ) : null
                  }
                />
              </div>
            );
          })}

          {finalResponse ? (
            <FinalResponse
              finalResponse={finalResponse}
              handleReset={handleReset}
            />
          ) : null}

          {locationModal && (
            <Modal
              isOpen={locationModal}
              onClose={() => {
                setLocationModal(false);
              }}
              title={"Select Job Detail"}
              keepMounted
              parentClassName={"overflow-x-hidden"}
            >
              <div className="min-w-max">
                <div className="w-full px-5 h-full flex flex-col gap-3">
                  <CommonInput
                    classNames={
                      "py-4 px-4 pl-14 text-purple-800 placeholder:text-gray-600 placeholder:text-lg !text-lg rounded-xl"
                    }
                    placeholder={"Enter City"}
                    label="City"
                    type="text"
                    name="city"
                    value={locationModal?.city}
                    onChange={handleChange}
                  />
                  <CommonInput
                    classNames={
                      "py-4 px-4 pl-14 text-purple-800 placeholder:text-gray-600 placeholder:text-lg !text-lg rounded-xl"
                    }
                    placeholder={"Enter State"}
                    label="State"
                    type="text"
                    name="state"
                    value={locationModal?.state}
                    onChange={handleChange}
                  />
                  <CommonInput
                    classNames={
                      "py-4 px-4 pl-14 text-purple-800 placeholder:text-gray-600 placeholder:text-lg !text-lg rounded-xl"
                    }
                    placeholder={"Enter Country"}
                    label="Country"
                    type="text"
                    name="country"
                    value={locationModal?.country}
                    onChange={handleChange}
                  />
                </div>
                <div className="w-full flex flex-row justify-center pt-6">
                  <button
                    onClick={setNewLocation}
                    className={`cursor-pointer my-[1rem] p-4 w-max mx-auto bg-green-500 text-xl text-white py-3 rounded-xl`}
                  >
                    Set New Location
                  </button>
                </div>
              </div>
            </Modal>
          )}
        </div>
      </div>

      <div className="w-full ">
        <Footer />
      </div>
    </div>
  );
};

export default Chatbot;
