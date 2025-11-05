'use client';
import { useState } from 'react';
import QuestionNavigator from './QuestionNavigator';
import QuestionCard from './QuestionCard';
import TestAttemptHeader from './TestAttemptHeader';
import TestAttemptSidebar from './TestAttemptSidebar';

const dummyQuestions = [
  {
    id: 1,
    question: 'Which of the following is not a secondary storage device?',
    options: ['CD-ROM', 'RAM', 'Flash Drive', 'Hard Disk'],
    answer: 'RAM',
  },
  {
    id: 2,
    question: 'CPU stands for?',
    options: [
      'Central Peripheral Unit',
      'Central Processing Unit',
      'Computer Processing',
      'Central Primary Unit',
    ],
    answer: 'Central Processing Unit',
  },
  {
    id: 3,
    question: 'What does HTML stand for?',
    options: [
      'Hypertext Markup Language',
      'High-level Text Markup Language',
      'Hypertext Machine Language',
      'Home Tool Markup Language',
    ],
    answer: 'Hypertext Markup Language',
  },
  {
    id: 4,
    question:
      'Which programming language is primarily used for web development?',
    options: ['Python', 'JavaScript', 'C++', 'Swift'],
    answer: 'JavaScript',
  },
  {
    id: 5,
    question: 'What is the brain of the computer called?',
    options: ['Hard Drive', 'RAM', 'CPU', 'Motherboard'],
    answer: 'CPU',
  },
  {
    id: 6,
    question: 'Which of these is an operating system?',
    options: ['Chrome', 'Linux', 'Firefox', 'Word'],
    answer: 'Linux',
  },
  {
    id: 7,
    question: 'What does RAM stand for?',
    options: [
      'Random Access Memory',
      'Read Access Memory',
      'Rapid Access Memory',
      'Random Active Memory',
    ],
    answer: 'Random Access Memory',
  },
  {
    id: 8,
    question: 'Which device is used to input data into a computer?',
    options: ['Monitor', 'Printer', 'Keyboard', 'Speaker'],
    answer: 'Keyboard',
  },
  {
    id: 9,
    question: 'What is the smallest unit of data in a computer?',
    options: ['Byte', 'Bit', 'Kilobyte', 'Megabyte'],
    answer: 'Bit',
  },
  {
    id: 10,
    question: 'Which protocol is used to send emails?',
    options: ['HTTP', 'FTP', 'SMTP', 'TCP'],
    answer: 'SMTP',
  },
  {
    id: 11,
    question: 'What does URL stand for?',
    options: [
      'Uniform Resource Locator',
      'Universal Resource Locator',
      'Unified Resource Link',
      'Universal Reference Link',
    ],
    answer: 'Uniform Resource Locator',
  },
  {
    id: 12,
    question: 'Which company developed the Windows operating system?',
    options: ['Apple', 'Microsoft', 'Google', 'IBM'],
    answer: 'Microsoft',
  },
  {
    id: 13,
    question: 'What type of software is Microsoft Excel?',
    options: ['Word Processor', 'Spreadsheet', 'Database', 'Presentation'],
    answer: 'Spreadsheet',
  },
  {
    id: 14,
    question: 'Which key combination is used to copy text?',
    options: ['Ctrl + V', 'Ctrl + C', 'Ctrl + X', 'Ctrl + Z'],
    answer: 'Ctrl + C',
  },
  {
    id: 15,
    question: 'What does USB stand for?',
    options: [
      'Universal Serial Bus',
      'Universal System Bus',
      'Unified Serial Bus',
      'Universal Service Bus',
    ],
    answer: 'Universal Serial Bus',
  },
  {
    id: 16,
    question: 'Which of these is not a programming language?',
    options: ['Python', 'Java', 'HTML', 'C++'],
    answer: 'HTML',
  },
  {
    id: 17,
    question: 'What is the main function of a router?',
    options: [
      'Store data',
      'Connect networks',
      'Process data',
      'Display information',
    ],
    answer: 'Connect networks',
  },
  {
    id: 18,
    question: 'Which file format is used for images?',
    options: ['DOCX', 'XLSX', 'JPEG', 'TXT'],
    answer: 'JPEG',
  },
  {
    id: 19,
    question: 'What does LAN stand for?',
    options: [
      'Large Area Network',
      'Local Area Network',
      'Long Access Network',
      'Limited Area Network',
    ],
    answer: 'Local Area Network',
  },
  {
    id: 20,
    question: 'Which component provides temporary storage for the CPU?',
    options: ['Hard Drive', 'Cache', 'ROM', 'Optical Drive'],
    answer: 'Cache',
  },
  {
    id: 21,
    question: 'What is the purpose of an IP address?',
    options: [
      'Identify devices on a network',
      'Store passwords',
      'Encrypt data',
      'Speed up internet',
    ],
    answer: 'Identify devices on a network',
  },
  {
    id: 22,
    question: 'Which of these is a cloud storage service?',
    options: ['Firefox', 'Dropbox', 'Chrome', 'Photoshop'],
    answer: 'Dropbox',
  },
  {
    id: 23,
    question: 'What does PDF stand for?',
    options: [
      'Portable Document Format',
      'Personal Document File',
      'Printed Document Format',
      'Public Document File',
    ],
    answer: 'Portable Document Format',
  },
  {
    id: 24,
    question: 'Which type of malware disguises itself as legitimate software?',
    options: ['Virus', 'Worm', 'Trojan Horse', 'Spyware'],
    answer: 'Trojan Horse',
  },
  {
    id: 25,
    question: 'What is the binary equivalent of decimal 10?',
    options: ['1010', '1100', '1001', '1000'],
    answer: '1010',
  },
  {
    id: 26,
    question: 'Which device converts digital signals to analog?',
    options: ['Router', 'Modem', 'Switch', 'Hub'],
    answer: 'Modem',
  },
  {
    id: 27,
    question: 'What does CSS stand for?',
    options: [
      'Computer Style Sheets',
      'Cascading Style Sheets',
      'Creative Style System',
      'Colorful Style Sheets',
    ],
    answer: 'Cascading Style Sheets',
  },
  {
    id: 28,
    question: 'Which programming paradigm does Java primarily support?',
    options: ['Functional', 'Object-Oriented', 'Procedural', 'Logic'],
    answer: 'Object-Oriented',
  },
  {
    id: 29,
    question: 'What is the maximum speed of USB 2.0?',
    options: ['480 Mbps', '12 Mbps', '5 Gbps', '10 Gbps'],
    answer: '480 Mbps',
  },
  {
    id: 30,
    question: 'Which layer of the OSI model handles routing?',
    options: ['Physical', 'Data Link', 'Network', 'Transport'],
    answer: 'Network',
  },
  {
    id: 31,
    question: 'What is the purpose of a firewall?',
    options: [
      'Speed up network',
      'Store data',
      'Block unauthorized access',
      'Compress files',
    ],
    answer: 'Block unauthorized access',
  },
  {
    id: 32,
    question: 'Which database language is used to query data?',
    options: ['HTML', 'SQL', 'CSS', 'XML'],
    answer: 'SQL',
  },
  {
    id: 33,
    question: 'What does GPU stand for?',
    options: [
      'General Processing Unit',
      'Graphics Processing Unit',
      'Global Processing Unit',
      'Game Processing Unit',
    ],
    answer: 'Graphics Processing Unit',
  },
  {
    id: 34,
    question: 'Which port number does HTTP use by default?',
    options: ['21', '22', '80', '443'],
    answer: '80',
  },
  {
    id: 35,
    question: 'What is the main purpose of an algorithm?',
    options: [
      'Store data',
      'Solve problems step by step',
      'Display graphics',
      'Connect networks',
    ],
    answer: 'Solve problems step by step',
  },
  {
    id: 36,
    question: 'Which company created the Java programming language?',
    options: ['Microsoft', 'Apple', 'Sun Microsystems', 'IBM'],
    answer: 'Sun Microsystems',
  },
  {
    id: 37,
    question: 'What is phishing?',
    options: [
      'A type of virus',
      'A social engineering attack',
      'A hardware malfunction',
      'A programming error',
    ],
    answer: 'A social engineering attack',
  },
  {
    id: 38,
    question: 'Which of these is a version control system?',
    options: ['Git', 'Docker', 'Apache', 'MySQL'],
    answer: 'Git',
  },
  {
    id: 39,
    question: 'What does API stand for?',
    options: [
      'Application Programming Interface',
      'Advanced Programming Interface',
      'Application Process Integration',
      'Automated Programming Interface',
    ],
    answer: 'Application Programming Interface',
  },
  {
    id: 40,
    question: 'Which data structure uses LIFO principle?',
    options: ['Queue', 'Stack', 'Array', 'Linked List'],
    answer: 'Stack',
  },
  {
    id: 41,
    question: 'What is the base of the hexadecimal number system?',
    options: ['2', '8', '10', '16'],
    answer: '16',
  },
  {
    id: 42,
    question: 'Which protocol is used for secure web browsing?',
    options: ['HTTP', 'HTTPS', 'FTP', 'SMTP'],
    answer: 'HTTPS',
  },
  {
    id: 43,
    question: 'What does SSD stand for?',
    options: [
      'Solid State Drive',
      'Super Speed Drive',
      'System Storage Device',
      'Secure Storage Disk',
    ],
    answer: 'Solid State Drive',
  },
  {
    id: 44,
    question: 'Which sorting algorithm has the best average time complexity?',
    options: ['Bubble Sort', 'Selection Sort', 'Quick Sort', 'Insertion Sort'],
    answer: 'Quick Sort',
  },
  {
    id: 45,
    question: 'What is the purpose of DNS?',
    options: [
      'Encrypt data',
      'Translate domain names to IP addresses',
      'Store files',
      'Speed up internet',
    ],
    answer: 'Translate domain names to IP addresses',
  },
  {
    id: 46,
    question: 'Which of these is not a type of loop in programming?',
    options: ['For', 'While', 'Do-While', 'Switch'],
    answer: 'Switch',
  },
  {
    id: 47,
    question: 'What does VPN stand for?',
    options: [
      'Virtual Private Network',
      'Visual Program Network',
      'Verified Public Network',
      'Virtual Public Node',
    ],
    answer: 'Virtual Private Network',
  },
  {
    id: 48,
    question: 'Which company developed the MacOS operating system?',
    options: ['Microsoft', 'Apple', 'Google', 'Linux Foundation'],
    answer: 'Apple',
  },
  {
    id: 49,
    question: 'What is the time complexity of binary search?',
    options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
    answer: 'O(log n)',
  },
  {
    id: 50,
    question: 'Which of these is a NoSQL database?',
    options: ['MySQL', 'PostgreSQL', 'MongoDB', 'Oracle'],
    answer: 'MongoDB',
  },
];
// const DURATION_SECONDS = 45 * 60 + 32;
// const DURATION_SECONDS = 45;

export default function TestAttemptPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [marked, setMarked] = useState<number[]>([]);

  const currentQuestion = dummyQuestions[currentIndex];

  const handleSelect = (option: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: option });
  };

  const handleMark = () => {
    setMarked((prev) =>
      prev.includes(currentQuestion.id)
        ? prev.filter((id) => id !== currentQuestion.id)
        : [...prev, currentQuestion.id],
    );
  };

  return (
    <div className='flex h-screen bg-gray-50'>
      {/* Sidebar */}
      <TestAttemptSidebar
        total={dummyQuestions.length}
        answered={Object.keys(answers).length}
        marked={marked.length}
        // duration={DURATION_SECONDS}
      />

      {/* Main Section */}
      <div className='flex-1 flex flex-col'>
        <TestAttemptHeader />
        <div className='flex-1 grid grid-cols-[1fr_300px] gap-4 p-6'>
          {/* Question Area */}
          <div className='bg-white p-6 rounded-2xl shadow-sm'>
            <QuestionCard
              question={currentQuestion}
              selected={answers[currentQuestion.id]}
              onSelect={handleSelect}
              onMark={handleMark}
              marked={marked.includes(currentQuestion.id)}
              onNext={() =>
                setCurrentIndex((i) =>
                  Math.min(i + 1, dummyQuestions.length - 1),
                )
              }
              onPrev={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
            />
          </div>

          {/* Navigator */}
          <QuestionNavigator
            total={dummyQuestions.length}
            current={currentIndex + 1}
            onSelect={(num) => setCurrentIndex(num - 1)}
            answered={Object.keys(answers).map((id) => Number(id))}
            marked={marked}
          />
        </div>
      </div>
    </div>
  );
}
