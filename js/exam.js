// document.addEventListener('DOMContentLoaded', async () => {
//     // Prevent navigation and page refresh
//     preventNavigation();
    
//     const questionTitle = document.getElementById('question-title');
//     const questionText = document.getElementById('question-text');
//     const answersContainer = document.getElementById('answers-container');
//     const prevBtn = document.getElementById('prevBtn');
//     const nextBtn = document.getElementById('nextBtn');
//     const submitBtn = document.getElementById('submitBtn');
//     const markBtn = document.getElementById('markBtn');
//     const markedList = document.getElementById('markedList');
//     const questionNumbers = document.querySelectorAll('.question-number');
//     const timerElement = document.querySelector('.timer');

//     let originalQuestions = [];
//     let questions = [];
//     let currentQuestionIndex = 0;
//     let userAnswers = new Map();
//     let markedQuestions = [];
//     let timeLeft = 120; // 2 minutes
//     let timerInterval;

//     /**
//      * Prevents navigation (back button) and page refresh during the exam
//      */
//     function preventNavigation() {
//         // Prevent using history navigation (back button)
//         history.pushState(null, null, location.href);
//         window.onpopstate = () => {
//             history.go(1);
//             showNavigationWarning();
//         };

//         // Prevent page refresh using beforeunload event
//         window.addEventListener('beforeunload', (e) => {
//             // Cancel the event
//             e.preventDefault();
//             // Chrome requires returnValue to be set
//             e.returnValue = '';
//             return '';
//         });

//         // Prevent using keyboard shortcuts for refresh
//         window.addEventListener('keydown', (e) => {
//             // Prevent F5 and Ctrl+R
//             if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
//                 e.preventDefault();
//                 showNavigationWarning();
//             }
//         });
//     }

//     /**
//      * Shows a warning when navigation attempt is detected
//      */
//     const showNavigationWarning = () => {
//         const warningElement = document.createElement('div');
//         warningElement.className = 'navigation-warning';
//         warningElement.textContent = 'Navigation is disabled during the exam!';
//         warningElement.style.cssText = `
//             position: fixed;
//             top: 20px;
//             left: 50%;
//             transform: translateX(-50%);
//             background-color: #ff4d4d;
//             color: white;
//             padding: 10px 20px;
//             border-radius: 5px;
//             z-index: 1000;
//             box-shadow: 0 2px 10px rgba(0,0,0,0.2);
//         `;
        
//         document.body.appendChild(warningElement);
        
//         // Remove the warning after 3 seconds
//         setTimeout(() => {
//             warningElement.style.opacity = '0';
//             warningElement.style.transition = 'opacity 0.5s';
//             setTimeout(() => document.body.removeChild(warningElement), 500);
//         }, 2000);
//     };

//     /**
//      * Shuffles array elements in place
//      * @param {Array} array - The array to shuffle
//      * @returns {Array} - New shuffled array
//      */
//     const shuffleArray = array => {
//         const newArray = [...array];
//         for (let i = newArray.length - 1; i > 0; i--) {
//             const j = Math.floor(Math.random() * (i + 1));
//             [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
//         }
//         return newArray;
//     };

//     /**
//      * Shuffles exam questions and their answers
//      */
//     const shuffleExam = () => {
//         questions = JSON.parse(JSON.stringify(originalQuestions));
//         questions = shuffleArray(questions);
//         questions.forEach((q, index) => {
//             q.uniqueId = index;
//         });

//         questions.forEach(question => {
//             const correctAnswerText = question.correctAnswer;
//             const answers = [
//                 { text: question.answer1, isCorrect: question.answer1 === correctAnswerText },
//                 { text: question.answer2, isCorrect: question.answer2 === correctAnswerText },
//                 { text: question.answer3, isCorrect: question.answer3 === correctAnswerText },
//                 { text: question.answer4, isCorrect: question.answer4 === correctAnswerText }
//             ];
//             const shuffledAnswers = shuffleArray(answers);

//             question.answer1 = shuffledAnswers[0].text;
//             question.answer2 = shuffledAnswers[1].text;
//             question.answer3 = shuffledAnswers[2].text;
//             question.answer4 = shuffledAnswers[3].text;

//             question.correctAnswer = shuffledAnswers.find(a => a.isCorrect).text;
//             question.originalCorrectAnswer = correctAnswerText;
//             question.shuffledAnswers = shuffledAnswers.map(a => a.text);
//         });
//     };

//     /**
//      * Loads questions from the JSON file
//      */
//     const loadQuestions = async () => {
//         try {
//             const response = await fetch('questions.json');
//             originalQuestions = await response.json();
//             shuffleExam();
//             startTimer();
//             loadQuestion(currentQuestionIndex);
//         } catch (error) {
//             console.error('Error loading questions:', error);
//             questionText.textContent = 'Error loading questions. Please try again later.';
//         }
//     };

//     /**
//      * Loads a specific question by index
//      * @param {Number} index - The question index to load
//      */
//     const loadQuestion = index => {
//         if (!questions.length) return;

//         const question = questions[index];
//         questionTitle.textContent = `Question ${index + 1}`;
//         questionText.textContent = question.title;
//         answersContainer.innerHTML = '';

//         question.shuffledAnswers.forEach((answer, i) => {
//             const answerDiv = document.createElement('div');
//             answerDiv.className = 'answer-option';

//             const input = document.createElement('input');
//             input.type = 'radio';
//             input.id = `answer${i}`;
//             input.name = 'question';
//             input.value = answer;
//             input.checked = userAnswers.get(index) === answer;

//             input.addEventListener('change', () => {
//                 userAnswers.set(index, answer);
//                 updateQuestionNumbers();
//             });

//             const label = document.createElement('label');
//             label.htmlFor = `answer${i}`;
//             label.textContent = answer;

//             answerDiv.append(input, label);
//             answersContainer.appendChild(answerDiv);
//         });

//         updateNavigationButtons();
//         updateQuestionNumbers();
//     };

//     /**
//      * Updates the visibility of navigation buttons
//      */
//     const updateNavigationButtons = () => {
//         prevBtn.style.display = currentQuestionIndex === 0 ? 'none' : 'block';
//         nextBtn.style.display = currentQuestionIndex === questions.length - 1 ? 'none' : 'block';
//         submitBtn.style.display = currentQuestionIndex === questions.length - 1 ? 'block' : 'none';
//     };

//     /**
//      * Updates the question number indicators
//      */
//     const updateQuestionNumbers = () => {
//         questionNumbers.forEach((num, i) => {
//             num.classList.toggle('active', i === currentQuestionIndex);
//             num.classList.toggle('answered', userAnswers.has(i));
//             num.classList.toggle('marked', markedQuestions.includes(i));
//         });
//     };

//     /**
//      * Updates the list of marked questions
//      */
//     const updateMarkedList = () => {
//         markedList.innerHTML = '';

//         if (markedQuestions.length === 0) {
//             markedList.innerHTML = '<li>No marked questions</li>';
//             return;
//         }

//         markedQuestions.forEach(index => {
//             const li = document.createElement('li');
//             li.textContent = `Question ${index + 1}`;
//             li.addEventListener('click', () => {
//                 currentQuestionIndex = index;
//                 loadQuestion(currentQuestionIndex);
//             });
//             markedList.appendChild(li);
//         });
//     };

//     /**
//      * Starts the exam timer
//      */
//     const startTimer = () => {
//         clearInterval(timerInterval);
//         updateTimerDisplay();
//         timerInterval = setInterval(() => {
//             timeLeft--;
//             updateTimerDisplay();

//             if (timeLeft <= 0) {
//                 handleTimeOut();
//             }
//         }, 1000);
//     };

//     /**
//      * Updates the timer display
//      */
//     const updateTimerDisplay = () => {
//         const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
//         const seconds = (timeLeft % 60).toString().padStart(2, '0');
//         timerElement.textContent = `Time: ${minutes}:${seconds}`;

//         if (timeLeft <= 30) {
//             timerElement.classList.add('warning');
//         } else {
//             timerElement.classList.remove('warning');
//         }
//     };

//     /**
//      * Handles the timeout of the exam
//      */
//     const handleTimeOut = () => {
//         clearInterval(timerInterval);
        
//         // Calculate number of answered questions before reset
//         const answered = userAnswers.size;
//         const total = questions.length;
        
//         // Store data in localStorage
//         localStorage.setItem('answered', answered);
//         localStorage.setItem('total', total);
        
//         // Reset the exam
//         shuffleExam();
//         currentQuestionIndex = 0;
//         userAnswers = new Map();
//         markedQuestions = [];
//         timeLeft = 120;
        
//         loadQuestion(currentQuestionIndex);
//         startTimer();
    
//         localStorage.setItem('examResults', JSON.stringify({
//             score: 'Time Out',
//             details: []
//         }));
    
//         // Enable navigation before redirect
//         enableNavigation();
//         window.location.href = 'TimeIsOut.html';
//     };

//     /**
//      * Enables navigation when exam ends
//      */
//     const enableNavigation = () => {
//         window.onpopstate = null;
//         window.onbeforeunload = null;
//     };
    
//     /**
//      * Submits the test and calculates results
//      */
//     const submitTest = () => {
//         const timeSpent = 120 - timeLeft; // Time spent
        
//         let correctAnswers = 0;
//         const results = questions.map((question, index) => {
//             const userAnswer = userAnswers.get(index);
//             const isCorrect = userAnswer === question.correctAnswer;
//             if (isCorrect) correctAnswers++;
//             return {
//                 question: question.title,
//                 userAnswer,
//                 correctAnswer: question.correctAnswer,
//                 isCorrect
//             };
//         });
    
//         const score = Math.round((correctAnswers / questions.length) * 100);
    
//         // Save required data
//         localStorage.setItem('examResults', JSON.stringify({
//             correctAnswers,
//             totalQuestions: questions.length,
//             timeSpent,
//             score,
//             details: results
//         }));
    
//         // Enable navigation before redirect
//         enableNavigation();
        
//         // Redirect to appropriate page
//         window.location.href = score >= 60 ? 'Success.html' : 'Failure.html';
//     };

//     // Event Listeners
//     prevBtn.addEventListener('click', () => {
//         if (currentQuestionIndex > 0) {
//             currentQuestionIndex--;
//             loadQuestion(currentQuestionIndex);
//         }
//     });

//     nextBtn.addEventListener('click', () => {
//         if (currentQuestionIndex < questions.length - 1) {
//             currentQuestionIndex++;
//             loadQuestion(currentQuestionIndex);
//         }
//     });

//     markBtn.addEventListener('click', () => {
//         const index = currentQuestionIndex;
//         if (markedQuestions.includes(index)) {
//             markedQuestions = markedQuestions.filter(i => i !== index);
//         } else {
//             markedQuestions.push(index);
//         }
//         updateQuestionNumbers();
//         updateMarkedList();
//     });

//     submitBtn.addEventListener('click', () => {
//         // Add confirmation before submission
//         if (confirm('Are you sure you want to submit your exam?')) {
//             submitTest();
//         }
//     });

//     questionNumbers.forEach((number, index) => {
//         number.addEventListener('click', () => {
//             currentQuestionIndex = index;
//             loadQuestion(currentQuestionIndex);
//         });
//     });

//     // Initialize the exam
//     loadQuestions();
// });




// document.addEventListener('DOMContentLoaded', async () => {
//     const questionTitle = document.getElementById('question-title');
//     const questionText = document.getElementById('question-text');
//     const answersContainer = document.getElementById('answers-container');
//     const prevBtn = document.getElementById('prevBtn');
//     const nextBtn = document.getElementById('nextBtn');
//     const submitBtn = document.getElementById('submitBtn');
//     const markBtn = document.getElementById('markBtn');
//     const markedList = document.getElementById('markedList');
//     const questionNumbers = document.querySelectorAll('.question-number');
//     const timerElement = document.querySelector('.timer');

//     let originalQuestions = [];
//     let questions = [];
//     let currentQuestionIndex = 0;
//     let userAnswers = new Map();
//     let markedQuestions = [];
//     let timeLeft = 120; // 2 minutes
//     let timerInterval;

//     /**
//      * Prevents navigation (back button) and page refresh during the exam
//      */
//     function preventNavigation() {
//         // Prevent using history navigation (back button)
//         history.pushState(null, null, location.href);
//         window.onpopstate = () => {
//             history.go(1);
//             showNavigationWarning();
//         };

//         // Prevent page refresh using beforeunload event
//         window.addEventListener('beforeunload', (e) => {
//             // Cancel the event
//             e.preventDefault();
//             // Chrome requires returnValue to be set
//             e.returnValue = '';
//             return '';
//         });

//         // Prevent using keyboard shortcuts for refresh
//         window.addEventListener('keydown', (e) => {
//             // Prevent F5 and Ctrl+R
//             if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
//                 e.preventDefault();
//                 showNavigationWarning();
//             }
//         });
//     }

//     /**
//      * Shows a warning when navigation attempt is detected
//      */
//     const showNavigationWarning = () => {
//         const warningElement = document.createElement('div');
//         warningElement.className = 'navigation-warning';
//         warningElement.textContent = 'Navigation is disabled during the exam!';
//         warningElement.style.cssText = `
//             position: fixed;
//             top: 20px;
//             left: 50%;
//             transform: translateX(-50%);
//             background-color: #ff4d4d;
//             color: white;
//             padding: 10px 20px;
//             border-radius: 5px;
//             z-index: 1000;
//             box-shadow: 0 2px 10px rgba(0,0,0,0.2);
//         `;
        
//         document.body.appendChild(warningElement);
        
//         // Remove the warning after 3 seconds
//         setTimeout(() => {
//             warningElement.style.opacity = '0';
//             warningElement.style.transition = 'opacity 0.5s';
//             setTimeout(() => document.body.removeChild(warningElement), 500);
//         }, 2000);
//     };

//     /**
//      * Shuffles array elements in place
//      * @param {Array} array - The array to shuffle
//      * @returns {Array} - New shuffled array
//      */
//     const shuffleArray = array => {
//         const newArray = [...array];
//         for (let i = newArray.length - 1; i > 0; i--) {
//             const j = Math.floor(Math.random() * (i + 1));
//             [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
//         }
//         return newArray;
//     };

//     /**
//      * Shuffles exam questions and their answers
//      */
//     const shuffleExam = () => {
//         questions = JSON.parse(JSON.stringify(originalQuestions));
//         questions = shuffleArray(questions);
//         questions.forEach((q, index) => {
//             q.uniqueId = index;
//         });

//         questions.forEach(question => {
//             const correctAnswerText = question.correctAnswer;
//             const answers = [
//                 { text: question.answer1, isCorrect: question.answer1 === correctAnswerText },
//                 { text: question.answer2, isCorrect: question.answer2 === correctAnswerText },
//                 { text: question.answer3, isCorrect: question.answer3 === correctAnswerText },
//                 { text: question.answer4, isCorrect: question.answer4 === correctAnswerText }
//             ];
//             const shuffledAnswers = shuffleArray(answers);

//             question.answer1 = shuffledAnswers[0].text;
//             question.answer2 = shuffledAnswers[1].text;
//             question.answer3 = shuffledAnswers[2].text;
//             question.answer4 = shuffledAnswers[3].text;

//             question.correctAnswer = shuffledAnswers.find(a => a.isCorrect).text;
//             question.originalCorrectAnswer = correctAnswerText;
//             question.shuffledAnswers = shuffledAnswers.map(a => a.text);
//         });
//     };

//     /**
//      * Loads questions from the JSON file
//      */
//     const loadQuestions = async () => {
//         try {
//             // Prevent navigation as soon as questions start loading
//             preventNavigation();
            
//             const response = await fetch('questions.json');
//             originalQuestions = await response.json();
//             shuffleExam();
//             startTimer();
//             loadQuestion(currentQuestionIndex);
//         } catch (error) {
//             console.error('Error loading questions:', error);
//             questionText.textContent = 'Error loading questions. Please try again later.';
//         }
//     };

//     /**
//      * Loads a specific question by index
//      * @param {Number} index - The question index to load
//      */
//     const loadQuestion = index => {
//         if (!questions.length) return;

//         const question = questions[index];
//         questionTitle.textContent = `Question ${index + 1}`;
//         questionText.textContent = question.title;
//         answersContainer.innerHTML = '';

//         question.shuffledAnswers.forEach((answer, i) => {
//             const answerDiv = document.createElement('div');
//             answerDiv.className = 'answer-option';

//             const input = document.createElement('input');
//             input.type = 'radio';
//             input.id = `answer${i}`;
//             input.name = 'question';
//             input.value = answer;
//             input.checked = userAnswers.get(index) === answer;

//             input.addEventListener('change', () => {
//                 userAnswers.set(index, answer);
//                 updateQuestionNumbers();
//             });

//             const label = document.createElement('label');
//             label.htmlFor = `answer${i}`;
//             label.textContent = answer;

//             answerDiv.append(input, label);
//             answersContainer.appendChild(answerDiv);
//         });

//         updateNavigationButtons();
//         updateQuestionNumbers();
//     };

//     /**
//      * Updates the visibility of navigation buttons
//      */
//     const updateNavigationButtons = () => {
//         prevBtn.style.display = currentQuestionIndex === 0 ? 'none' : 'block';
//         nextBtn.style.display = currentQuestionIndex === questions.length - 1 ? 'none' : 'block';
//         submitBtn.style.display = currentQuestionIndex === questions.length - 1 ? 'block' : 'none';
//     };

//     /**
//      * Updates the question number indicators
//      */
//     const updateQuestionNumbers = () => {
//         questionNumbers.forEach((num, i) => {
//             num.classList.toggle('active', i === currentQuestionIndex);
//             num.classList.toggle('answered', userAnswers.has(i));
//             num.classList.toggle('marked', markedQuestions.includes(i));
//         });
//     };

//     /**
//      * Updates the list of marked questions
//      */
//     const updateMarkedList = () => {
//         markedList.innerHTML = '';

//         if (markedQuestions.length === 0) {
//             markedList.innerHTML = '<li>No marked questions</li>';
//             return;
//         }

//         markedQuestions.forEach(index => {
//             const li = document.createElement('li');
//             li.textContent = `Question ${index + 1}`;
//             li.addEventListener('click', () => {
//                 currentQuestionIndex = index;
//                 loadQuestion(currentQuestionIndex);
//             });
//             markedList.appendChild(li);
//         });
//     };

//     /**
//      * Starts the exam timer
//      */
//     const startTimer = () => {
//         clearInterval(timerInterval);
//         updateTimerDisplay();
//         timerInterval = setInterval(() => {
//             timeLeft--;
//             updateTimerDisplay();

//             if (timeLeft <= 0) {
//                 handleTimeOut();
//             }
//         }, 1000);
//     };

//     /**
//      * Updates the timer display
//      */
//     const updateTimerDisplay = () => {
//         const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
//         const seconds = (timeLeft % 60).toString().padStart(2, '0');
//         timerElement.textContent = `Time: ${minutes}:${seconds}`;

//         if (timeLeft <= 30) {
//             timerElement.classList.add('warning');
//         } else {
//             timerElement.classList.remove('warning');
//         }
//     };

//     /**
//      * Handles the timeout of the exam
//      */
//     const handleTimeOut = () => {
//         clearInterval(timerInterval);
        
//         // Calculate number of answered questions before reset
//         const answered = userAnswers.size;
//         const total = questions.length;
        
//         // Store data in localStorage
//         localStorage.setItem('answered', answered);
//         localStorage.setItem('total', total);
        
//         // Store time out result in localStorage
//         localStorage.setItem('examResults', JSON.stringify({
//             score: 'Time Out',
//             details: []
//         }));
        
//         // Redirect immediately to TimeIsOut page without confirmation
//         window.location.replace('TimeIsOut.html');
//     };
    
//     /**
//      * Submits the test and calculates results
//      */
//     const submitTest = () => {
//         clearInterval(timerInterval);
//         const timeSpent = 120 - timeLeft; // Time spent
        
//         let correctAnswers = 0;
//         const results = questions.map((question, index) => {
//             const userAnswer = userAnswers.get(index);
//             const isCorrect = userAnswer === question.correctAnswer;
//             if (isCorrect) correctAnswers++;
//             return {
//                 question: question.title,
//                 userAnswer,
//                 correctAnswer: question.correctAnswer,
//                 isCorrect
//             };
//         });
    
//         const score = Math.round((correctAnswers / questions.length) * 100);
    
//         // Save required data
//         localStorage.setItem('examResults', JSON.stringify({
//             correctAnswers,
//             totalQuestions: questions.length,
//             timeSpent,
//             score,
//             details: results
//         }));
        
//         // Redirect to appropriate page without enabling navigation
//         window.location.replace(score >= 60 ? 'Success.html' : 'Failure.html');
//     };

//     // Event Listeners
//     prevBtn.addEventListener('click', () => {
//         if (currentQuestionIndex > 0) {
//             currentQuestionIndex--;
//             loadQuestion(currentQuestionIndex);
//         }
//     });

//     nextBtn.addEventListener('click', () => {
//         if (currentQuestionIndex < questions.length - 1) {
//             currentQuestionIndex++;
//             loadQuestion(currentQuestionIndex);
//         }
//     });

//     markBtn.addEventListener('click', () => {
//         const index = currentQuestionIndex;
//         if (markedQuestions.includes(index)) {
//             markedQuestions = markedQuestions.filter(i => i !== index);
//         } else {
//             markedQuestions.push(index);
//         }
//         updateQuestionNumbers();
//         updateMarkedList();
//     });

//     submitBtn.addEventListener('click', () => {
//         // Add confirmation before submission
//         if (confirm('Are you sure you want to submit your exam?')) {
//             submitTest();
//         }
//     });

//     questionNumbers.forEach((number, index) => {
//         number.addEventListener('click', () => {
//             currentQuestionIndex = index;
//             loadQuestion(currentQuestionIndex);
//         });
//     });

//     // Initialize the exam
//     loadQuestions();
// });




document.addEventListener('DOMContentLoaded', async () => {

     preventNavigation();

    const questionTitle = document.getElementById('question-title');
    const questionText = document.getElementById('question-text');
    const answersContainer = document.getElementById('answers-container');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const markBtn = document.getElementById('markBtn');
    const markedList = document.getElementById('markedList');
    const questionNumbers = document.querySelectorAll('.question-number');
    const timerElement = document.querySelector('.timer');

    let originalQuestions = [];
    let questions = [];
    let currentQuestionIndex = 0;
    let userAnswers = new Map();
    let markedQuestions = [];
    let timeLeft = 120; // 2 دقيقة
    let timerInterval;

//  function preventNavigation() {
//         // Prevent using history navigation (back button)
//         history.pushState(null, null, location.href);
//         window.onpopstate = () => {
//             history.go(1);
//             showNavigationWarning();
//         };

//         // Prevent page refresh using beforeunload event
//         window.addEventListener('beforeunload', (e) => {
//             // Cancel the event
//             e.preventDefault();
//             // Chrome requires returnValue to be set
//             e.returnValue = '';
//             return '';
//         });

//             // Prevent using keyboard shortcuts for refresh
//         window.addEventListener('keydown', (e) => {
//             // Prevent F5 and Ctrl+R
//             if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
//                 e.preventDefault();
//                 showNavigationWarning();
//             }
//         });
//     }


// function preventNavigation() {
//     // // منع التنقل عبر السجل (زر الرجوع)
//     // history.pushState(null, null, document.URL);
//     // window.addEventListener('popstate', function() {
//     //     history.pushState(null, null, document.URL);
//     //     showNavigationWarning();
//     // });

//     // منع تحديث الصفحة
//     window.addEventListener('beforeunload', function(e) {
//         if (timeLeft > 0) { // فقط إذا كان الوقت لم ينته بعد
//             e.preventDefault();
//             e.returnValue = 'You have unsaved changes! Are you sure you want to leave?';
//             return e.returnValue;
//         }
//         // إذا انتهى الوقت، اسمح بالمغادرة بدون تحذير
//     });

//     // منع اختصارات لوحة المفاتيح للتحديث
//     // document.addEventListener('keydown', function(e) {
//     //     // منع F5 و Ctrl+R و Ctrl+F5
//     //     if ((e.key === 'F5') || 
//     //         (e.ctrlKey && e.key === 'r') || 
//     //         (e.ctrlKey && e.key === 'R') ||
//     //         (e.key === 'F5' && e.ctrlKey)) {
//     //         e.preventDefault();
//     //         showNavigationWarning();
//     //     }
//     // });
// }
//      const showNavigationWarning = () => {
//         const warningElement = document.createElement('div');
//         warningElement.className = 'navigation-warning';
//         warningElement.textContent = 'Navigation is disabled during the exam!';
//         warningElement.style.cssText = `
//             position: fixed;
//             top: 20px;
//             left: 50%;
//             transform: translateX(-50%);
//             background-color: #ff4d4d;
//             color: white;
//             padding: 10px 20px;
//             border-radius: 5px;
//             z-index: 1000;
//             box-shadow: 0 2px 10px rgba(0,0,0,0.2);
//         `;
        
//         document.body.appendChild(warningElement);
        
//         // Remove the warning after 3 seconds
//         setTimeout(() => {
//             warningElement.style.opacity = '0';
//             warningElement.style.transition = 'opacity 0.5s';
//             setTimeout(() => document.body.removeChild(warningElement), 500);
//         }, 2000);
//     };


    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    function shuffleExam() {
        questions = JSON.parse(JSON.stringify(originalQuestions));
        questions = shuffleArray(questions);
        questions.forEach((q, index) => {
            q.uniqueId = index;
        });

        questions.forEach(question => {
            const correctAnswerText = question.correctAnswer;
            const answers = [
                { text: question.answer1, isCorrect: question.answer1 === correctAnswerText },
                { text: question.answer2, isCorrect: question.answer2 === correctAnswerText },
                { text: question.answer3, isCorrect: question.answer3 === correctAnswerText },
                { text: question.answer4, isCorrect: question.answer4 === correctAnswerText }
            ];
            const shuffledAnswers = shuffleArray(answers);

            question.answer1 = shuffledAnswers[0].text;
            question.answer2 = shuffledAnswers[1].text;
            question.answer3 = shuffledAnswers[2].text;
            question.answer4 = shuffledAnswers[3].text;

            question.correctAnswer = shuffledAnswers.find(a => a.isCorrect).text;
            question.originalCorrectAnswer = correctAnswerText;
            question.shuffledAnswers = shuffledAnswers.map(a => a.text);
        });
    }

    async function loadQuestions() {
        try {
            const response = await fetch('questions.json');
            originalQuestions = await response.json();
            shuffleExam();
            startTimer();
            loadQuestion(currentQuestionIndex);
        } catch (error) {
            console.error('Error loading questions:', error);
            questionText.textContent = 'خطأ في تحميل الأسئلة. يرجى المحاولة لاحقاً.';
        }
    }

    function loadQuestion(index) {
        if (!questions.length) return;

        const question = questions[index];
        questionTitle.textContent = `Question ${index + 1}`;
        questionText.textContent = question.title;
        answersContainer.innerHTML = '';

        question.shuffledAnswers.forEach((answer, i) => {
            const answerDiv = document.createElement('div');
            answerDiv.className = 'answer-option';

            const input = document.createElement('input');
            input.type = 'radio';
            input.id = `answer${i}`;
            input.name = 'question';
            input.value = answer;
            input.checked = userAnswers.get(index) === answer;

            input.addEventListener('change', () => {
                userAnswers.set(index, answer);
                updateQuestionNumbers();
            });

            const label = document.createElement('label');
            label.htmlFor = `answer${i}`;
            label.textContent = answer;

            answerDiv.append(input, label);
            answersContainer.appendChild(answerDiv);
        });

        updateNavigationButtons();
        updateQuestionNumbers();
    }

    function updateNavigationButtons() {
        prevBtn.style.display = currentQuestionIndex === 0 ? 'none' : 'block';
        nextBtn.style.display = currentQuestionIndex === questions.length - 1 ? 'none' : 'block';
        submitBtn.style.display = currentQuestionIndex === questions.length - 1 ? 'block' : 'none';
    }

    function updateQuestionNumbers() {
        questionNumbers.forEach((num, i) => {
            num.classList.toggle('active', i === currentQuestionIndex);
            num.classList.toggle('answered', userAnswers.has(i));
            num.classList.toggle('marked', markedQuestions.includes(i));
        });
    }

    function updateMarkedList() {
        markedList.innerHTML = '';

        if (markedQuestions.length === 0) {
            markedList.innerHTML = '<li>No marked questions</li>';
            return;
        }

        markedQuestions.forEach(index => {
            const li = document.createElement('li');
            li.textContent = `Question ${index + 1}`;
            li.addEventListener('click', () => {
                currentQuestionIndex = index;
                loadQuestion(currentQuestionIndex);
            });
            markedList.appendChild(li);
        });
    }

    function startTimer() {
        clearInterval(timerInterval);
        updateTimerDisplay();
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();

            if (timeLeft <= 0) {
                handleTimeOut();
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        const seconds = (timeLeft % 60).toString().padStart(2, '0');
        timerElement.textContent = `Time: ${minutes}:${seconds}`;

        if (timeLeft <= 30) {
            timerElement.classList.add('warning');
        } else {
            timerElement.classList.remove('warning');
        }
    }

    function handleTimeOut() {
        clearInterval(timerInterval);

            window.removeEventListener('beforeunload', preventNavigation);
    // window.removeEventListener('popstate', preventNavigation);
    // document.removeEventListener('keydown', preventNavigation);
        
        // حساب عدد الأسئلة التي تم الإجابة عليها قبل إعادة التعيين
        const answered = userAnswers.size;
        const total = questions.length;
        
        // تخزين البيانات في localStorage
        localStorage.setItem('answered', answered);
        localStorage.setItem('total', total);
        
        // الآن نقوم بإعادة تعيين الامتحان
        shuffleExam();
        currentQuestionIndex = 0;
        userAnswers = new Map();
        markedQuestions = [];
        timeLeft = 120;
        
        loadQuestion(currentQuestionIndex);
        startTimer();
    
        localStorage.setItem('examResults', JSON.stringify({
            score: 'Time Out',
            details: []
        }));
    
        window.location.href = 'TimeIsOut.html';
    }

    
    function submitTest() {
        const timeSpent = 120 - timeLeft; // الوقت المستغرق
        
        let correctAnswers = 0;
        const results = questions.map((question, index) => {
            const isCorrect = userAnswers.get(index) === question.correctAnswer;
            if (isCorrect) correctAnswers++;
            return {
                isCorrect: isCorrect,
                // ... باقي البيانات
            };
        });
    
        const score = Math.round((correctAnswers / questions.length) * 100);
    
        // حفظ البيانات المطلوبة
        localStorage.setItem('examResults', JSON.stringify({
            correctAnswers: correctAnswers, // عدد الإجابات الصحيحة
            totalQuestions: questions.length, // إجمالي الأسئلة
            timeSpent: timeSpent,
            score: score,
            details: results
        }));
    
        // التوجيه للصفحة المناسبة
        window.location.href = score >= 60 ? 'Success.html' : 'Failure.html';
    }

    prevBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            loadQuestion(currentQuestionIndex);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            loadQuestion(currentQuestionIndex);
        }
    });

    markBtn.addEventListener('click', () => {
        const index = currentQuestionIndex;
        if (markedQuestions.includes(index)) {
            markedQuestions = markedQuestions.filter(i => i !== index);
        } else {
            markedQuestions.push(index);
        }
        updateQuestionNumbers();
        updateMarkedList();
    });

    submitBtn.addEventListener('click', submitTest);

    questionNumbers.forEach((number, index) => {
        number.addEventListener('click', () => {
            currentQuestionIndex = index;
            loadQuestion(currentQuestionIndex);
        });
    });

    loadQuestions();
});

