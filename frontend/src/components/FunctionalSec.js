import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { EffectCoverflow, Pagination, Navigation } from "swiper";

import "./FunctionalSec.css"; // Import the scoped CSS

import account from "../assets/account.jpg";

function FunctionalSec() {
  return (
    <div className="swiper-section flex justify-center items-center bg-blue-700">
      {/* Added a wrapper class */}
      <div className="container gap-2 flex flex-col items-center justify-center  w-full">
        <h1 className="heading text-white font-extrabold md:mb-4">
          Functional Areas
        </h1>
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          slidesPerView={"auto"}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
          }}
          pagination={{ el: ".swiper-pagination", clickable: true }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
            clickable: true,
          }}
          modules={[EffectCoverflow, Pagination]}
          className="swiper-container md:mt-10 w-[90vw] "
        >
          <SwiperSlide>
            <div className="slide-content">
              <img src={account} alt="slide_image" />
              <div className="slide-heading">
                <p>Customer Service</p>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="slide-content">
              <img src={account} alt="slide_image" />
              <div className="slide-heading">
                <p>Human Resources</p>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="slide-content">
              <img src={account} alt="slide_image" />
              <div className="slide-heading">
                <p>Learning & Development</p>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="slide-content">
              <img src={account} alt="slide_image" />
              <div className="slide-heading">
                <p>Finance & Accounting</p>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="slide-content">
              <img src={account} alt="slide_image" />
              <div className="slide-heading">
                <p>Marketing</p>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="slide-content">
              <img src={account} alt="slide_image" />
              <div className="slide-heading">
                <p>Sales</p>
              </div>
            </div>
          </SwiperSlide>

          <div className="flex justify-center items-center gap-2 bg-blue-400">
              <div className="swiper-pagination"></div>
          </div>
        </Swiper>
      </div>
    </div>
  );
}

export default FunctionalSec;
