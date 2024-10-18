import React from 'react';
import '../tailwind.css'

const Text = ({ text }) => {
    return (
        <p className='text-2xl sm:text-5xl w-fit bg-gradient-to-r from-orange-500 via-orange-600 to-purple-900 text-transparent bg-clip-text'>
            {text}
        </p>
    );
};

export default Text;