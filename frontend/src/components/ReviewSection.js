import React from 'react';

const testimonials = [
    {
        id: 1,
        text: "Lorem ipsum dolor sit amet consectetur. Etiam tristique dapibus ut orci in in sagittis tortor libero. Viverra et non nulla ultricies arcu dui turpis. Mi massa vitae cras odio. Lectus aliquam ultricies praesent sed eleifend laoreet dignissim.",
    },
    {
        id: 2,
        text: "Lorem ipsum dolor sit amet consectetur. Etiam tristique dapibus ut orci in in sagittis tortor libero. Viverra et non nulla ultricies arcu dui turpis. Mi massa vitae cras odio. Lectus aliquam ultricies praesent sed eleifend laoreet dignissim.",
    },
    {
        id: 3,
        text: "Lorem ipsum dolor sit amet consectetur. Etiam tristique dapibus ut orci in in sagittis tortor libero. Viverra et non nulla ultricies arcu dui turpis. Mi massa vitae cras odio. Lectus aliquam ultricies praesent sed eleifend laoreet dignissim.",
    },
    {
        id: 4,
        text: "Lorem ipsum dolor sit amet consectetur. Etiam tristique dapibus ut orci in in sagittis tortor libero. Viverra et non nulla ultricies arcu dui turpis. Mi massa vitae cras odio. Lectus aliquam ultricies praesent sed eleifend laoreet dignissim.",
    },
    {
        id: 5,
        text: "Lorem ipsum dolor sit amet consectetur. Etiam tristique dapibus ut orci in in sagittis tortor libero. Viverra et non nulla ultricies arcu dui turpis. Mi massa vitae cras odio. Lectus aliquam ultricies praesent sed eleifend laoreet dignissim.",
    },
    {
        id: 6,
        text: "Lorem ipsum dolor sit amet consectetur. Etiam tristique dapibus ut orci in in sagittis tortor libero. Viverra et non nulla ultricies arcu dui turpis. Mi massa vitae cras odio. Lectus aliquam ultricies praesent sed eleifend laoreet dignissim.",
    },
    {
        id: 7,
        text: "Lorem ipsum dolor sit amet consectetur. Etiam tristique dapibus ut orci in in sagittis tortor libero. Viverra et non nulla ultricies arcu dui turpis. Mi massa vitae cras odio. Lectus aliquam ultricies praesent sed eleifend laoreet dignissim.",
    },
];

// Corrected TestimonialCard component
const TestimonialCard = ({ text }) => {
    return (
        <article className="flex flex-col px-6 py-6 my-auto shadow-md bg-blue-200 min-w-[250px] lg:min-w-[370px] rounded-[60px] w-[391px]">
            <div className="flex flex-col justify-center items-center self-center px-2 bg-blue-900 h-[190px] rounded-full w-[190px]">
                <div className="w-full h-44 bg-blue-300 rounded-full" />
            </div>

            <p className="mt-2 text-lg font-medium tracking-tight leading-6 text-center text-blue-900">
                {text}
            </p>
            <h4 className="mt-2 text-2xl font-semibold tracking-tight text-center text-violet-950">
                <span className="text-3xl">ABC</span> OS USER
            </h4>
        </article>
    );
};

export default function ReviewSection() {
    return (
        <div className="flex flex-col items-center ">
            <div className="flex flex-col bg-white w-full">
                {/* Section 1 - Our Moto */}
                <section className="flex relative flex-col items-center px-5 pt-10 w-full font-semibold text-center text-white min-h-[320px]">
                    <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/12c5aa866197cba5a814f1eabbe67eeabdc55dbc20fb33d6861380686ee1ec96?placeholderIfAbsent=true&apiKey=81a235f4136c4623b32cac0bf8e8b9ae"
                        alt=""
                        className="object-cover absolute inset-0 w-full h-full"
                    />
                    <div className="flex relative flex-col max-w-full w-[1244px] z-10">
                        <h1 className="self-center text-5xl tracking-tighter max-md:max-w-full max-md:text-3xl">
                            OUR MOTO
                        </h1>
                        <h2 className="mt-7 text-5xl tracking-tighter max-md:max-w-full max-md:text-4xl">
                            Streamline, Simplify, Succeed – Your Complete Business Management Solution
                        </h2>
                    </div>
                </section>

                {/* Section 2 - Testimonials */}
                <section className="flex flex-col items-center p-10 bg-blue-800 w-full max-md:px-5">
                    <h2 className="text-3xl font-bold tracking-tighter text-center text-white">
                        Testimonials
                    </h2>
                    <h3 className="mt-2 text-5xl font-bold tracking-tighter text-center text-white max-md:max-w-full max-md:text-4xl">
                        Customers Review
                    </h3>

                    <div className="flex overflow-x-scroll snap-x snap-mandatory gap-5 justify-start items-center mt-5 min-h-[610px] no-scrollbar w-[90vw]">
                        {testimonials.map((testimonial) => (
                            <TestimonialCard key={testimonial.id} text={testimonial.text} />
                        ))}
                    </div>

                </section>
            </div>
        </div>
    );
}
