import { FaFacebookSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import Robot from "../assets/Robot.svg"
import React, { useState } from 'react';

const Footer2 = () => {
  // State to manage the open/close status of each section
  const [openSection, setOpenSection] = useState(null);

  // Toggle function to open/close a section
  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="w-full max-w-lg mt-10">
      {[ 
        { title: 'Product', links: ['Overview', 'Pricing', 'Customer Stories'] },
        { title: 'Resources', links: ['Blog', 'Guides & tutorials'] },
        { title: 'Company', links: ['About us', 'Contact Us', 'Media Kit'] },
        { title: 'Contact Sales', links: ['phone', 'mobile'] },
        { title: 'Security and Privacy', links: ['OS OFFICE', 'Contact Us'] },
      ].map((section, index) => (
        <div key={index} className="border-b border-gray-300">
          <button
            className="flex justify-between items-center w-full px-4 py-4 text-left text-sm font-semibold text-gray-800 hover:bg-gray-200"
            onClick={() => toggleSection(section.title)}
          >
            {section.title}
            {/* Chevron Icon */}
            <span
              className={`transition-transform duration-200 ${
                openSection === section.title ? 'rotate-180' : 'rotate-0'
              }`}
            >
              ^
            </span>
          </button>
          {openSection === section.title && section.links.length > 0 && (
            <div className="pl-4 pb-4">
              {section.links.map((link, idx) => (
                <p key={idx} className="text-gray-600 text-sm py-1 hover:underline">
                  {link}
                </p>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Copyright text moved outside of the map function */}
      <div className="mt-1 text-center flex bg-blue-800 flex-col">
        <div className='text-center flex justify-center'>
          <div className="flex gap-4  p-2" >
              <FaFacebookSquare className="text-white shadow-sm"/>
              <FaLinkedin className="text-white shadow-sm"/>
              <FaInstagramSquare className="text-white shadow-sm"/>
              <FaSquareXTwitter className=" text-white shadow-sm"/>
          </div>
        </div>
        <hr color/>
            <div className='flex justify-center items-center mt-1'> 
            <img src={Robot} alt="Logo" className="h-16 w-auto" />
            </div>
        
        <span className="text-xs tracking-tight leading-none text-white mb-3">
          ©2024 AIENVIRO OFFICE SAHAYOGI PVT LTD.
        </span>  
      </div>
    </div>
  );
};

export default Footer2;

