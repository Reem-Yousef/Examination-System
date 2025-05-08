document.addEventListener('DOMContentLoaded', async () => {
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
        questionTitle.textContent = `Question ${index + 1}`;  // تحديث العنوان
        questionText.textContent = question.title;  // تحديث نص السؤال
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

        window.location.href = 'TimeIsOut.html'; // صفحة انتهاء الوقت
    }

    function submitTest() {
        const firstUnansweredIndex = questions.findIndex((_, index) => !userAnswers.has(index));
        if (firstUnansweredIndex !== -1) {
            currentQuestionIndex = firstUnansweredIndex;
            loadQuestion(currentQuestionIndex);
            questionNumbers[currentQuestionIndex].classList.add('unanswered-highlight');
            setTimeout(() => {
                questionNumbers[currentQuestionIndex].classList.remove('unanswered-highlight');
            }, 2000);
            alert(`يوجد أسئلة لم تتم الإجابة عليها. الرجاء الإجابة على السؤال رقم ${currentQuestionIndex + 1}`);
            return;
        }

        clearInterval(timerInterval);

        let correctAnswers = 0;
        const results = questions.map((question, index) => {
            const isCorrect = userAnswers.get(index) === question.correctAnswer;
            if (isCorrect) correctAnswers++;
            return {
                questionId: question.uniqueId,
                questionText: question.title,
                userAnswer: userAnswers.get(index),
                correctAnswer: question.correctAnswer,
                isCorrect: isCorrect
            };
        });

        const score = (correctAnswers / questions.length) * 100;

        localStorage.setItem('examResults', JSON.stringify({
            score: `${Math.round(score)}%`,
            details: results
        }));

        // التوجيه للنتيجة
        if (score >= 60) {
            window.location.href = 'Success.html'; // صفحة النجاح
        } else {
            window.location.href = 'Failure.html'; // صفحة الفشل
        }
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






// document.addEventListener('DOMContentLoaded', async () => {
//     // عناصر DOM
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

//     // حالة التطبيق
//     let originalQuestions = [];
//     let questions = [];
//     let currentQuestionIndex = 0;
//     let userAnswers = new Map();
//     let markedQuestions = [];
//     let timeLeft = 120; // 2 دقيقة
//     let timerInterval;

//     // دالة لخلط المصفوفة عشوائياً
//     function shuffleArray(array) {
//         const newArray = [...array];
//         for (let i = newArray.length - 1; i > 0; i--) {
//             const j = Math.floor(Math.random() * (i + 1));
//             [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
//         }
//         return newArray;
//     }

//     // دالة لخلط الأسئلة والإجابات
//     function shuffleExam() {
//         // 1. نسخ الأسئلة الأصلية
//         questions = JSON.parse(JSON.stringify(originalQuestions));

//         // 2. خلط ترتيب الأسئلة
//         questions = shuffleArray(questions);

//         // 3. إضافة معرف فريد لكل سؤال
//         questions.forEach((q, index) => {
//             q.uniqueId = index; // معرف فريد لا يتغير
//         });

//         // 4. خلط الإجابات داخل كل سؤال
//         questions.forEach(question => {
//             // حفظ الإجابة الصحيحة الأصلية
//             const correctAnswerText = question.correctAnswer;

//             // تجميع الإجابات
//             const answers = [
//                 { text: question.answer1, isCorrect: question.answer1 === correctAnswerText },
//                 { text: question.answer2, isCorrect: question.answer2 === correctAnswerText },
//                 { text: question.answer3, isCorrect: question.answer3 === correctAnswerText },
//                 { text: question.answer4, isCorrect: question.answer4 === correctAnswerText }
//             ];

//             // خلط الإجابات
//             const shuffledAnswers = shuffleArray(answers);

//             // تحديث الإجابات في السؤال
//             question.answer1 = shuffledAnswers[0].text;
//             question.answer2 = shuffledAnswers[1].text;
//             question.answer3 = shuffledAnswers[2].text;
//             question.answer4 = shuffledAnswers[3].text;

//             // تحديد الإجابة الصحيحة الجديدة
//             question.correctAnswer = shuffledAnswers.find(a => a.isCorrect).text;

//             // حفظ المعلومات الأصلية
//             question.originalCorrectAnswer = correctAnswerText;
//             question.shuffledAnswers = shuffledAnswers.map(a => a.text);
//         });
//     }

//     // تحميل الأسئلة
//     async function loadQuestions() {
//         try {
//             const response = await fetch('questions.json');
//             originalQuestions = await response.json();

//             // خلط الأسئلة مباشرة عند كل تحميل
//             shuffleExam();

//             // بدء المؤقت
//             startTimer();
//             loadQuestion(currentQuestionIndex);
//         } catch (error) {
//             console.error('Error loading questions:', error);
//             questionText.textContent = 'خطأ في تحميل الأسئلة. يرجى المحاولة لاحقاً.';
//         }
//     }

//     // تحميل سؤال معين
//     function loadQuestion(index) {
//         if (!questions.length) return;

//         const question = questions[index];
//         questionTitle.textContent = Question ${index + 1};
//         questionText.textContent = question.title;
//         answersContainer.innerHTML = '';

//         // عرض الإجابات المخلوطة
//         question.shuffledAnswers.forEach((answer, i) => {
//             const answerDiv = document.createElement('div');
//             answerDiv.className = 'answer-option';

//             const input = document.createElement('input');
//             input.type = 'radio';
//             input.id = answer${i};
//             input.name = 'question';
//             input.value = answer;
//             input.checked = userAnswers.get(index) === answer;

//             input.addEventListener('change', () => {
//                 userAnswers.set(index, answer);
//                 updateQuestionNumbers();
//             });

//             const label = document.createElement('label');
//             label.htmlFor = answer${i};
//             label.textContent = answer;

//             answerDiv.append(input, label);
//             answersContainer.appendChild(answerDiv);
//         });

//         updateNavigationButtons();
//         updateQuestionNumbers();
//     }

//     // تحديث أزرار التنقل
//     function updateNavigationButtons() {
//         prevBtn.style.display = currentQuestionIndex === 0 ? 'none' : 'block';
//         nextBtn.style.display = currentQuestionIndex === questions.length - 1 ? 'none' : 'block';
//         submitBtn.style.display = currentQuestionIndex === questions.length - 1 ? 'block' : 'none';
//     }

//     // تحديث أرقام الأسئلة
//     function updateQuestionNumbers() {
//         questionNumbers.forEach((num, i) => {
//             num.classList.toggle('active', i === currentQuestionIndex);
//             num.classList.toggle('answered', userAnswers.has(i));
//             num.classList.toggle('marked', markedQuestions.includes(i));
//         });
//     }

//     // تحديث قائمة الأسئلة المميزة
//     function updateMarkedList() {
//         markedList.innerHTML = '';

//         if (markedQuestions.length === 0) {
//             markedList.innerHTML = '<li>No marked questions</li>';
//             return;
//         }

//         markedQuestions.forEach(index => {
//             const li = document.createElement('li');
//             li.textContent = Question ${index + 1};
//             li.addEventListener('click', () => {
//                 currentQuestionIndex = index;
//                 loadQuestion(currentQuestionIndex);
//             });
//             markedList.appendChild(li);
//         });
//     }

//     // المؤقت
//     function startTimer() {
//         clearInterval(timerInterval);
//         updateTimerDisplay();
//         timerInterval = setInterval(() => {
//             timeLeft--;
//             updateTimerDisplay();

//             if (timeLeft <= 0) {
//                 handleTimeOut();
//             }
//         }, 1000);
//     }

//     function updateTimerDisplay() {
//         const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
//         const seconds = (timeLeft % 60).toString().padStart(2, '0');
//         timerElement.textContent = Time: ${minutes}:${seconds};

//         if (timeLeft <= 30) {
//             timerElement.classList.add('warning');
//         } else {
//             timerElement.classList.remove('warning');
//         }
//     }

//     // عند انتهاء الوقت
//     function handleTimeOut() {
//         clearInterval(timerInterval);

//         // إعادة الخلط الكامل
//         shuffleExam();
//         currentQuestionIndex = 0;
//         userAnswers = new Map();
//         markedQuestions = [];
//         timeLeft = 120;

//         loadQuestion(currentQuestionIndex);
//         startTimer();

//         alert('انتهى الوقت! تم إعادة تحميل الأسئلة بترتيب جديد.');
//     }

//     // تسليم الاختبار

//     function submitTest() {
//         // 1. البحث عن أول سؤال لم يتم الإجابة عليه
//         const firstUnansweredIndex = questions.findIndex((_, index) => !userAnswers.has(index));

//         // 2. إذا وجد سؤال بدون إجابة
//         if (firstUnansweredIndex !== -1) {
//             currentQuestionIndex = firstUnansweredIndex;
//             loadQuestion(currentQuestionIndex);

//             // إضافة تأثير مرئي للسؤال غير المجاب
//             questionNumbers[currentQuestionIndex].classList.add('unanswered-highlight');
//             setTimeout(() => {
//                 questionNumbers[currentQuestionIndex].classList.remove('unanswered-highlight');
//             }, 2000);

//             // عرض تنبيه للمستخدم
//             alert(يوجد أسئلة لم تتم الإجابة عليها. الرجاء الإجابة على السؤال رقم ${currentQuestionIndex + 1});
//             return; // لا تكمل التنفيذ
//         }

//         // 3. إذا كانت كل الإجابات مكتملة
//         clearInterval(timerInterval);

//         // حساب النتائج
//         let correctAnswers = 0;
//         const results = questions.map((question, index) => {
//             const isCorrect = userAnswers.get(index) === question.correctAnswer;
//             if (isCorrect) correctAnswers++;

//             return {
//                 questionId: question.uniqueId,
//                 questionText: question.title,
//                 userAnswer: userAnswers.get(index),
//                 correctAnswer: question.correctAnswer,
//                 isCorrect: isCorrect
//             };
//         });

//         // 4. حفظ النتائج
//         localStorage.setItem('examResults', JSON.stringify({
//             score: ${correctAnswers}/${questions.length},
//             details: results
//         }));

//         alert(score, results)
//         // 5. الانتقال لصفحة النتائج
//         // window.location.href = 'results.html';
//     }

//     // أحداث الأزرار
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

//     submitBtn.addEventListener('click', submitTest);

//     // الانتقال إلى سؤال عند النقر على رقمه
//     questionNumbers.forEach((number, index) => {
//         number.addEventListener('click', () => {
//             currentQuestionIndex = index;
//             loadQuestion(currentQuestionIndex);
//         });
//     });

//     // بدء التطبيق
//     loadQuestions();
// });
