import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'How does the adoption process work?',
      answer: 'Browse our available pets, submit an adoption application for your chosen pet, schedule a meet and greet, complete the adoption process, and welcome your new family member home!'
    },
    {
      question: 'What are the adoption fees?',
      answer: 'Adoption fees vary depending on the pet and cover vaccinations, spaying/neutering, and medical care. Most adoptions range from $50-$200. Contact us for specific details.'
    },
    {
      question: 'Can I return a pet if it doesn\'t work out?',
      answer: 'We understand that sometimes matches don\'t work out. Within 30 days, you can return the pet with a full refund. After 30 days, we can help you rehome the pet.'
    },
    {
      question: 'Do you provide medical records?',
      answer: 'Yes! All adopted pets come with complete medical records, vaccination history, and any relevant health information.'
    },
    {
      question: 'How do I know if I\'m ready to adopt?',
      answer: 'Consider your lifestyle, living situation, financial stability, time commitment, and whether all family members are on board. Pets require daily care, attention, and financial resources.'
    },
    {
      question: 'Can I adopt if I rent my home?',
      answer: 'Yes, but you\'ll need written permission from your landlord and must verify that pets are allowed in your rental agreement.'
    },
    {
      question: 'What if I already have other pets?',
      answer: 'That\'s great! We encourage meet and greets between your current pets and potential new family members to ensure compatibility.'
    },
    {
      question: 'How long does the adoption process take?',
      answer: 'The process typically takes 1-2 weeks from application to adoption, depending on application review, background checks, and scheduling.'
    },
    {
      question: 'Do you offer support after adoption?',
      answer: 'Absolutely! We provide ongoing support, training resources, and are always available to answer questions or address concerns.'
    },
    {
      question: 'Can I volunteer at Pawfect Home?',
      answer: 'Yes! We welcome volunteers. Contact us through the Contact page to learn about volunteer opportunities.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-page">
      <div className="page-header">
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions about pet adoption</p>
      </div>

      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
            <button className="faq-question" onClick={() => toggleFAQ(index)}>
              <span>{faq.question}</span>
              {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {openIndex === index && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="faq-cta">
        <h2>Still have questions?</h2>
        <p>Feel free to reach out to our support team</p>
        <a href="/contact" className="btn-primary">Contact Us</a>
      </div>
    </div>
  );
};

export default FAQ;
