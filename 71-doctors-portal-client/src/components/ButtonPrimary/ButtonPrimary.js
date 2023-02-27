import React from 'react';

const ButtonPrimary = ({children}) => {
    return (
      <button className="btn btn-primary text-white bg-gradient-to-r from-primary to-cyan-500">
       {children}
      </button>
    );
};

export default ButtonPrimary;