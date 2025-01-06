import React, { useState } from "react";
import styles from "../styles/FAQ.module.css";

const FAQ = () => {
  const questions = [
    {
      question: "What are your opening hours?",
      answer: "Our gym is open from 6:00 AM to 10:00 PM daily.",
    },
    {
      question: "What is included in the Single Class Package?",
      answer:
        "The Single Class Package includes one month of access to the gym and one course of your choice.",
    },
    {
      question: "What is included in the Unlimited Classes Package?",
      answer:
        "The Unlimited Classes Package includes one month of access to the gym and unlimited courses.",
    },
    {
      question: "What is included in the Seasonal Unlimited Package?",
      answer:
        "The Seasonal Unlimited Package includes three months of access to the gym and unlimited courses.",
    },
    {
      question: "How can I upgrade my membership package?",
      answer:
        "You can upgrade your membership package through your user dashboard or by contacting our front desk.",
    },
    {
      question: "Do I need to book classes in advance?",
      answer:
        "Yes, we recommend booking classes in advance to secure your spot, especially for popular courses.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.faqContainer}>
      <h2 className={styles.title}>Frequently Asked Questions</h2>
      <ul className={styles.faqList}>
        {questions.map((item, index) => (
          <li
            key={index}
            className={`${styles.faqItem} ${
              openIndex === index ? styles.open : ""
            }`}
          >
            <button
              className={styles.faqQuestion}
              onClick={() => toggleQuestion(index)}
            >
              {item.question}
              <span
                className={`${styles.arrow} ${
                  openIndex === index ? styles.rotated : ""
                }`}
              >
                &#9662;
              </span>
            </button>
            <div
              className={`${styles.faqAnswer} ${
                openIndex === index ? styles.visible : styles.hidden
              }`}
            >
              {item.answer}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FAQ;
