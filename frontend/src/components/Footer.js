import React from "react";
import { FaLinkedin } from "react-icons/fa";
import { FaSquareFacebook } from "react-icons/fa6";
import { GrInstagram } from "react-icons/gr";
import { FaSquareXTwitter } from "react-icons/fa6";


function Footer() {
  return (
    <footer className="flex lg:flex-wrap flex-col justify-center items-center gap-6  px-2  lg:px-20 py-10 mt-5 w-full bg-blue-800 shadow-sm md:mt-10">

      <div className="flex  items-start justify-center  w-full">

        <div className="flex flex-col items-start justify-center w-[30vw]">
          <div className="flex flex-col justify-center text-xs  sm:text-[13px] text-stone-100 px-3 md:text-[9px] lg:px-20 ">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/8a6f2081bb53d1b9e29400cf13adae446f170a28bd52836fd0c4427829896daf?placeholderIfAbsent=true&apiKey=81a235f4136c4623b32cac0bf8e8b9ae"
              className="object-contain w-[358px]"
              alt="Company logo"
            />


            <p className="w-full">
              Lorem ipsum dolor sit amet consectetur. Ac et tempor diam enim ut
              maecenas in. Id nulla tempor lacinia imperdiet nullam eros pretium
              aliquam est.
            </p>
          </div>
        </div>

        <div className="flex lex-wrap gap-5 items-center justify-center w-[70vw]">
          <div className="flex flex-wrap flex-col w-full">
            <div className="flex lg:flex-wrap gap-2 items-start mt-4 justify-evenly md:text-[10px] text-white">

              <div className="flex flex-col text-xs  lg:text-[13px] justify-center">
                <h3 className="text-lg font-bold md:text-[13px] tracking-tight">Product</h3>
                <a
                  href="#"
                  className="mt-1.5 leading-none hover:text-amber-200"
                >
                  Overview
                </a>
                <a
                  href="#"
                  className="mt-1.5 leading-none hover:text-amber-200"
                >
                  Pricing
                </a>
                <a
                  href="#"
                  className="mt-1.5 leading-none hover:text-amber-200"
                >
                  Customer stories
                </a>
              </div>

              <div className="flex flex-col text-xs  lg:text-[13px] justify-center">
                <h3 className="text-lg font-bold md:text-[13px] tracking-tight">Resourse</h3>
                <a
                  href="#"
                  className="mt-1.5 leading-none hover:text-amber-200"
                >
                  Blog
                </a>
                <a
                  href="#"
                  className="mt-1.5 leading-none hover:text-amber-200"
                >
                  Guides & toutrials
                </a>
                <a
                  href="#"
                  className="mt-1.5 leading-none hover:text-amber-200"
                >
                  Customer stories
                </a>
              </div>

              <div className="flex flex-col text-xs  lg:text-[13px] justify-center">
                <h3 className="text-lg font-bold md:text-[13px] tracking-tight">Community</h3>
                <a
                  href="#"
                  className="mt-1.5 leading-none hover:text-amber-200"
                >
                  User Community
                </a>
                <a
                  href="#"
                  className="mt-1.5 leading-none hover:text-amber-200"
                >
                  Customer Stories
                </a>
                <a
                  href="#"
                  className="mt-1.5 leading-none hover:text-amber-200"
                >
                  Influence
                </a>
              </div>

              <div className="flex flex-col text-xs  lg:text-[13px] justify-center">
                <h3 className="text-lg md:text-[13px] font-bold tracking-tight">Company</h3>
                <a
                  href="#"
                  className="mt-1.5 leading-none hover:text-amber-200"
                >
                  Service Status
                </a>
                <a
                  href="#"
                  className="mt-1.5 leading-none hover:text-amber-200"
                >
                  Careers
                </a>
                <a
                  href="#"
                  className="mt-1.5 leading-none hover:text-amber-200"
                >
                  Events
                </a>
              </div>

              <div className="flex flex-col  text-xs">
                <h3 className="font-bold text-lg md:text-[13px] tracking-tight">
                  Try It Today
                </h3>
                <p className="mt-1 md:text-[13px] text-sm">Connect Us to Know More</p>
                <button className="gap-2.5 self-start text-xs  sm:text-[13px] py-1.5 pr-1 pl-2 mt-1  text-center bg-blue-600 rounded-md">
                  CONTACT US
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Below part */}

      <div className="flex flex-wrap gap-20 lg:px-[20px]  lg:flex-wrap  lg:justify-between  md:justify-evenly  items-center  md:gap-3 lg:w-full lg:gap-6 ">


        <div className="flex flex-wrap sm:gap- lg:gap-10 items-center">

          <div className="flex gap-1.5 items-center">
            <div className="w-[19px]">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/7409102ca8054bcf8882d1e5d9cf54e724a5e26879ab1bdc2dedb3fc35117701?placeholderIfAbsent=true&apiKey=81a235f4136c4623b32cac0bf8e8b9ae"
                className="object-contain aspect-[1.06] w-[19px]"
                alt="Language icon"
              />
            </div>
            <span className="text-xs tracking-tight leading-none text-white">
              English
            </span>
            <div className="w-5">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/d730cf04882959b0515956c460f57095b392f7d1f5b511f08fc157d28a377ba1?placeholderIfAbsent=true&apiKey=81a235f4136c4623b32cac0bf8e8b9ae"
                className="object-contain w-3 aspect-[2]"
                alt="Icon"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center  gap-10">
            <span className="text-xs tracking-tight leading-none text-white">
              Terms & Privacy
            </span>
            <span className="text-xs tracking-tight leading-none text-white">
              Security
            </span>
            <span className="text-xs tracking-tight leading-none text-white">
              Status
            </span>
            <span className="text-xs tracking-tight leading-none text-white">
              ©2024 AIENVIRO OFFICE SAHAYOGI PVT LTD
            </span>
          </div>

        </div>

        <div className="flex items-center justify-center lg:gap-3px text-white gap-2">
          <FaLinkedin />
          <FaSquareFacebook />
          <GrInstagram />
          <FaSquareXTwitter />
        </div>
      </div>
    </footer>
  );
}

export default Footer;

