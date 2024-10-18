import React from 'react';

const Footer = () => {
    return (
        <div className='w-full hidden justify-between px-6 py-4 bg-slate-900 md:flex'>
            <div className='text-white text-xs'>
                Copyright© 2024 Engage AI, All rights reserved.
            </div>
            <div className='flex text-white text-xs gap-3'>
                <div className='flex cursor-pointer' onClick={() => window.location.href='/privacy-policy'}>
                    Privacy Policy                    
                </div>
                <div className='flex cursor-pointer' onClick={() =>  window.location.href= '/terms-conditions'}>
                    Terms of services
                </div>
            </div>
        </div>
    );
};

export default Footer;