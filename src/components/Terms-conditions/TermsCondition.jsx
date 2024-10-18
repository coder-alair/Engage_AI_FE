import React, { useEffect, useState } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import { Api } from '../../api';
import { marked } from 'marked';
import { CMS } from '../../helpers/helper';

const TermsConditions = () => {
  const [fetTerm, setFetchTerm] = useState("");

  const getTerms = () => {
    Api.getTerm(CMS.TERMS).then(res => {
      if (res?.data?.data) {
        setFetchTerm(res?.data?.data?.content);
      }
    })
  }

  useEffect(() => {
    getTerms();
  }, [])

  return (
    <div className='w-screen relative h-screen overflow-y-auto hide-scrollbar'>
      <div className='w-full h-[7rem]'>
        <Header />
      </div>

      <div className='w-full min-h-full relative  font-medium'>
        <p
          className='text-sm px-3 md:text-md my-2 font-light'
          dangerouslySetInnerHTML={{
            __html: marked(fetTerm)
          }}
        ></p>
      </div>

      <div className='w-full'>
        <Footer />
      </div>
    </div>
  );
};

export default TermsConditions;