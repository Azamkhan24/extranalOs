import React from 'react';
import Element from '../assets/Element.svg'
import pic from '../assets/pic.png'

function ProductsSection() {
    return (
        <section className="flex overflow-hidden flex-col justify-center items-center p-1 sm:p-15 bg-white ">
            <div className="flex flex-col w-full  max-w-[1278px] max-md:max-w-full">
                <h1 className="self-center text-3xl font-bold tracking-tighter text-center text-blue-800 max-md:max-w-full max-md:text-4xl">
                    Our Current Products
                </h1>

                <div className="flex flex-wrap w-full gap-16 items-center justify-center mt-10 ">
                    <>
                        <div className="flex flex-wrap h-full">
                            {/* First card */}
                            <div className="flex flex-col-reverse sm:flex-row flex-wrap p-2 sm:p-6 lg:p-4 w-full gap-6 lg:gap-10 items-center justify-center">
                                <div className="w-full sm:w-[350px] h-auto flex flex-col items-start justify-center gap-4">
                                    <div className="text-lg sm:text-xl lg:text-2xl font-bold">
                                        <img src={Element} alt="" className="w-40 -mb-8" />
                                        CRM
                                    </div>

                                    <div className="text-xs sm:text-base lg:text-sm">
                                        Lorem ipsum dolor sit amet consectetur. Orci a faucibus maecenas
                                        nunc aliquam leo mauris id non. Enim nam tortor ipsum aenean non
                                        id fames feugiat. Ipsum in quis lorem lobortis integer lectus.
                                        Tincidunt ut elementum vitae ut duis eu integer. Ultricies
                                        hendrerit diam nullam in. Lectus euismod neque vulputate lacinia
                                        accumsan et. Et cras suscipit augue vulputate.
                                    </div>
                                    <button className="bg-blue-700 text-white px-2 py-1 rounded-md text-sm xs:text-base lg:text-sm">
                                        Get Started

                                    </button>
                                </div>
                                <div className="w-full sm:w-[350px] h-auto flex items-center justify-center">
                                    <img
                                        src={pic}
                                        className="w-full h-full rounded-lg object-cover"
                                        alt="CRM Image"
                                    />
                                </div>
                            </div>

                            {/* Second card */}
                            <div className="flex flex-wrap p-2 sm:p-6 lg:p-10 w-full gap-6 lg:gap-10 items-center justify-center">
                                <div className="w-full sm:w-[350px] h-auto flex items-center justify-center">
                                    <img
                                        src={pic}
                                        className="w-full h-full rounded-lg object-cover"
                                        alt="CRM Image"
                                    />
                                </div>
                                <div className="w-full sm:w-[350px] h-auto flex flex-col items-start justify-center gap-4">
                                    <div className="text-lg sm:text-xl lg:text-2xl font-bold">
                                        <img src={Element} alt="" className="w-40 -mb-8" />
                                        Payroll</div>
                                    <div className="text-xs sm:text-base lg:text-sm">
                                        Lorem ipsum dolor sit amet consectetur. Orci a faucibus maecenas
                                        nunc aliquam leo mauris id non. Enim nam tortor ipsum aenean non
                                        id fames feugiat. Ipsum in quis lorem lobortis integer lectus.
                                        Tincidunt ut elementum vitae ut duis eu integer. Ultricies
                                        hendrerit diam nullam in. Lectus euismod neque vulputate lacinia
                                        accumsan et. Et cras suscipit augue vulputate.
                                    </div>
                                    <button className="bg-blue-700 text-white px-2 py-1 rounded-md text-sm xs:text-base lg:text-sm">
                                        Get Started
                                    </button>
                                </div>
                            </div>

                            {/* Third card */}
                            <div className="flex flex-col-reverse sm:flex-row flex-wrap p-2 sm:p-6 lg:p-10 w-full gap-6 lg:gap-10 items-center justify-center">
                                <div className="w-full sm:w-[350px] h-auto flex flex-col items-start justify-center gap-4">
                                    <div className="text-lg sm:text-xl lg:text-2xl font-bold">
                                        <img src={Element} alt="" className="w-40 -mb-8" />
                                        Accounts</div>
                                    <div className="text-xs sm:text-base lg:text-sm">
                                        Lorem ipsum dolor sit amet consectetur. Orci a faucibus maecenas
                                        nunc aliquam leo mauris id non. Enim nam tortor ipsum aenean non
                                        id fames feugiat. Ipsum in quis lorem lobortis integer lectus.
                                        Tincidunt ut elementum vitae ut duis eu integer. Ultricies
                                        hendrerit diam nullam in. Lectus euismod neque vulputate lacinia
                                        accumsan et. Et cras suscipit augue vulputate.
                                    </div>
                                    <button className="bg-blue-700 text-white px-2 py-1 rounded-md text-sm xs:text-base lg:text-sm">
                                        Get Started
                                    </button>
                                </div>
                                <div className="w-full sm:w-[350px] h-auto flex items-center justify-center">
                                    <img
                                       src={pic}
                                        className="w-full h-full rounded-lg object-cover"
                                        alt="CRM Image"
                                    />
                                </div>
                            </div>

                            {/* Fourth card */}
                            <div className="flex flex-wrap p-2 sm:p-6 lg:p-10 w-full gap-6 lg:gap-10 items-center justify-center">
                                <div className="w-full sm:w-[350px] h-auto flex items-center justify-center">
                                    <img
                                         src={pic}
                                        className="w-full h-full rounded-lg object-cover"
                                        alt="CRM Image"
                                    />
                                </div>
                                <div className="w-full sm:w-[350px] h-auto flex flex-col items-start justify-center gap-4">
                                    <div className="text-lg sm:text-xl lg:text-2xl font-bold">
                                        <img src={Element} alt="" className="w-40 -mb-8" />
                                        Analytics</div>
                                    <div className="text-xs sm:text-base lg:text-sm">
                                        Lorem ipsum dolor sit amet consectetur. Orci a faucibus maecenas
                                        nunc aliquam leo mauris id non. Enim nam tortor ipsum aenean non
                                        id fames feugiat. Ipsum in quis lorem lobortis integer lectus.
                                        Tincidunt ut elementum vitae ut duis eu integer. Ultricies
                                        hendrerit diam nullam in. Lectus euismod neque vulputate lacinia
                                        accumsan et. Et cras suscipit augue vulputate.
                                    </div>
                                    <button className="bg-blue-700 text-white px-2 py-1 rounded-md text-sm xs:text-base lg:text-sm">
                                        Get Started
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                </div>
            </div>
        </section>
    );
}

export default ProductsSection;