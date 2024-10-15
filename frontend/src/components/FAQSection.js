import React, { useState } from 'react';

const faqData = [
  {
    question: "What services do you offer?",
    answer: "We offer a wide range of services including copywriting, content creation, SEO optimization, website design, and social media management."
  },
  {
    question: "What is your pricing model?",
    answer: "Our pricing depends on the scope and type of service. We offer custom packages tailored to your needs."
  },
  {
    question: "How can I contact you?",
    answer: "You can reach out to us through the contact form on our website or via email at contact@oursite.com."
  },
  {
    question: "What is your turnaround time?",
    answer: "Turnaround times vary depending on the project, but most services are delivered within 7-10 business days."
  },
  {
    question: "Do you offer revisions?",
    answer: "Yes, we offer up to two rounds of revisions with most of our services to ensure client satisfaction."
  }
];

// Corrected FAQItem component
const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="flex overflow-hidden mb-3 flex-col gap-4 mt-4 w-full rounded-lg border shadow-md max-md:max-w-full">
      <div
        className="flex gap-5 justify-between items-center px-10 py-1 w-full bg-blue-100 cursor-pointer"
        onClick={onClick}
      >
        <h2 className="text-xl font-semibold tracking-tighter text-blue-800">
          {question}
        </h2>
        <button
          className="hidden sm:flex w-12 h-12 text-xl font-black items-center justify-center text-white bg-violet-950 rounded-full"
          aria-label="Toggle answer"
        >
          {isOpen ? '-' : '+'}
        </button>
      </div>
      {isOpen && (
        <div className="flex gap-1.5 px-10 py-0.5 mb-2 text-xl font-normal bg-white w-full text-violet-950">
          {answer}
        </div>
      )}
    </div>
  );
};

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="flex px-3 overflow-hidden flex-col items-center pt-4 sm:pt-6 md:pt-10 bg-white w-full max-w-[1100px] mx-auto">
      <h1 className="text-[28px] sm:text-[36px] md:text-[44px] font-bold text-center text-blue-800">
        FAQ
      </h1>
      <div className="flex flex-col mt-3 w-full sm:max-w-[800px] md:max-w-[900px] lg:max-w-[1000px]">
        {faqData.map((item, index) => (
          <FAQItem
            key={index}
            question={item.question}
            answer={item.answer}
            isOpen={activeIndex === index}
            onClick={() => toggleAnswer(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
