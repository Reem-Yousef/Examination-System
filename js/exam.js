document.addEventListener('DOMContentLoaded', async () => {
    // Cache DOM elements
    const elements = {
        questionTitle: document.getElementById('question-title'),
        questionText: document.getElementById('question-text'),
        questionContainer: document.querySelector('.question-container'),
        answersContainer: document.getElementById('answers-container'),
        prevBtn: document.getElementById('prevBtn'),
        nextBtn: document.getElementById('nextBtn'),
        submitBtn: document.getElementById('submitBtn'),
        markBtn: document.getElementById('markBtn'),
        markedList: document.getElementById('markedList'),
        questionNumbers: document.querySelectorAll('.question-number'),
        timerElement: document.querySelector('.timer'),
        showMarkedBtn: document.getElementById('showMarkedBtn'),
        showUnansweredBtn: document.getElementById('showUnansweredBtn'),
        markedPopup: document.getElementById('markedPopup'),
        unansweredPopup: document.getElementById('unansweredPopup'),
        closeBtns: document.querySelectorAll('.close-btn'),
        unansweredList: document.getElementById('unansweredList')
    };

    // App state
    const state = {
        originalQuestions: [],
        questions: [],
        currentQuestionIndex: 0,
        userAnswers: new Map(),
        markedQuestions: [],
        timeLeft: 120,
        timerInterval: null
    };

    // Fisher-Yates shuffle algorithm - optimized
    function shuffle(array) {
        let currentIndex = array.length;
        while (currentIndex > 0) {
            const randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    // Prepare exam questions
    function prepareExam() {
        // Create deep copy of questions
        state.questions = JSON.parse(JSON.stringify(state.originalQuestions));
        
        // Shuffle questions
        shuffle(state.questions);
        
        // Assign unique IDs
        state.questions.forEach((q, index) => {
            q.uniqueId = index;
            
            // Prepare answers
            const correctAnswerText = q.correctAnswer;
            const answers = [
                { text: q.answer1, isCorrect: q.answer1 === correctAnswerText },
                { text: q.answer2, isCorrect: q.answer2 === correctAnswerText },
                { text: q.answer3, isCorrect: q.answer3 === correctAnswerText },
                { text: q.answer4, isCorrect: q.answer4 === correctAnswerText }
            ];
            
            // Shuffle answers
            shuffle(answers);
            
            // Update question with shuffled answers
            q.answer1 = answers[0].text;
            q.answer2 = answers[1].text;
            q.answer3 = answers[2].text;
            q.answer4 = answers[3].text;
            q.correctAnswer = answers.find(a => a.isCorrect).text;
            q.originalCorrectAnswer = correctAnswerText;
            q.shuffledAnswers = answers.map(a => a.text);
        });
    }

    // Load questions from JSON file
    async function loadQuestions() {
        try {
            const response = await fetch('questions.json');
            state.originalQuestions = await response.json();
            prepareExam();
            startTimer();
            loadQuestion(state.currentQuestionIndex);
            updateUI();
        } catch (error) {
            console.error('Error loading questions:', error);
            elements.questionText.textContent = 'Error loading questions. Please try again later.';
        }
    }

function loadQuestion(index) {
    if (!state.questions.length) return;

    const question = state.questions[index];
    elements.questionTitle.textContent = `Question ${index + 1}`;
    elements.questionText.textContent = question.title;
    
    // Use document fragment for better performance
    const fragment = document.createDocumentFragment();
    
    question.shuffledAnswers.forEach((answer, i) => {
        const answerDiv = document.createElement('div');
        answerDiv.className = 'answer-option';
        
        // Make the entire div clickable
        answerDiv.addEventListener('click', (e) => {
            // Find the radio input within this container
            const radioInput = answerDiv.querySelector('input[type="radio"]');
            
            // Only handle if not clicking directly on the input (to avoid double-triggering)
            if (e.target !== radioInput) {
                radioInput.checked = true;
                
                // Trigger the change event to update the state
                const changeEvent = new Event('change');
                radioInput.dispatchEvent(changeEvent);
            }
        });

        const input = document.createElement('input');
        input.type = 'radio';
        input.id = `answer${i}`;
        input.name = 'question';
        input.value = answer;
        input.checked = state.userAnswers.get(index) === answer;

        input.addEventListener('change', () => {
            state.userAnswers.set(index, answer);
            updateUI();
        });

        const label = document.createElement('label');
        label.htmlFor = `answer${i}`;
        label.textContent = answer;

        answerDiv.appendChild(input);
        answerDiv.appendChild(label);
        fragment.appendChild(answerDiv);
    });
    
    // Clear answers container and append fragment (one DOM operation)
    elements.answersContainer.innerHTML = '';
    elements.answersContainer.appendChild(fragment);
    
    updateUI();
}

    // Combined UI update function to reduce DOM operations
    function updateUI() {
        updateNavigationButtons();
        updateQuestionNumbers();
        updateMarkedButton();
        updateSubmitButton();
        updateUnansweredList();
    }

    // Update navigation buttons visibility
    function updateNavigationButtons() {
        elements.prevBtn.style.display = state.currentQuestionIndex === 0 ? 'none' : 'block';
        elements.nextBtn.style.display = state.currentQuestionIndex === state.questions.length - 1 ? 'none' : 'block';
        elements.submitBtn.style.display = state.currentQuestionIndex === state.questions.length - 1 ? 'block' : 'none';
    }

    // Update question numbers styling
    function updateQuestionNumbers() {
        elements.questionNumbers.forEach((num, i) => {
            // Build classList changes in batch
            const classesToAdd = [];
            const classesToRemove = ['active', 'answered', 'marked'];
            
            if (i === state.currentQuestionIndex) classesToAdd.push('active');
            if (state.userAnswers.has(i)) classesToAdd.push('answered');
            if (state.markedQuestions.includes(i)) classesToAdd.push('marked');
            
            // Apply classes in a single operation
            num.classList.remove(...classesToRemove);
            if (classesToAdd.length) num.classList.add(...classesToAdd);
        });
    }

    // Get unanswered questions
    function getUnansweredQuestions() {
        return Array.from({ length: state.questions.length }, (_, i) => i)
            .filter(i => !state.userAnswers.has(i));
    }

    // Update unanswered questions list
    function updateUnansweredList() {
        const unansweredQuestions = getUnansweredQuestions();
        elements.showUnansweredBtn.textContent = `Unanswered Questions (${unansweredQuestions.length})`;
        
        // Only rebuild the list if the popup is visible
        if (elements.unansweredPopup.style.display === 'flex') {
            renderUnansweredList(unansweredQuestions);
        }
    }
    
    // Render unanswered list (only when needed)
    function renderUnansweredList(unansweredQuestions) {
        const fragment = document.createDocumentFragment();
        
        if (unansweredQuestions.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'All questions answered';
            fragment.appendChild(li);
        } else {
            unansweredQuestions.forEach(index => {
                const li = document.createElement('li');
                const div = document.createElement('div');
                div.className = 'unanswered-question-text';
                div.textContent = `Question ${index + 1}`;
                
                li.appendChild(div);
                li.addEventListener('click', () => {
                    state.currentQuestionIndex = index;
                    loadQuestion(state.currentQuestionIndex);
                    closePopup('unansweredPopup');
                });
                
                fragment.appendChild(li);
            });
        }
        
        elements.unansweredList.innerHTML = '';
        elements.unansweredList.appendChild(fragment);
    }

    // Update submit button state
    function updateSubmitButton() {
        const unansweredCount = getUnansweredQuestions().length;
        
        elements.submitBtn.title = unansweredCount > 0 
            ? `Click to go to first unanswered question (${unansweredCount} questions remaining)` 
            : 'Submit your exam';
        
        // Toggle classes instead of add/remove for better performance
        elements.submitBtn.classList.toggle('highlight-button', unansweredCount > 0);
        elements.submitBtn.classList.toggle('ready-submit', unansweredCount === 0);
    }

    // Update marked list
    function updateMarkedList() {
        elements.showMarkedBtn.textContent = `Marked Questions (${state.markedQuestions.length})`;
        
        // Only rebuild if the popup is displayed
        if (elements.markedPopup.style.display === 'flex') {
            renderMarkedList();
        }
    }
    
    // Render marked list (only when needed)
    function renderMarkedList() {
        const fragment = document.createDocumentFragment();
        
        if (state.markedQuestions.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No marked questions';
            fragment.appendChild(li);
        } else {
            state.markedQuestions.forEach(index => {
                const li = document.createElement('li');
                
                const textDiv = document.createElement('div');
                textDiv.className = 'marked-question-text';
                textDiv.textContent = `Question ${index + 1}`;
                
                const removeBtn = document.createElement('button');
                removeBtn.className = 'remove-mark-btn';
                removeBtn.textContent = '×';
                removeBtn.dataset.index = index;
                
                li.appendChild(textDiv);
                li.appendChild(removeBtn);
                
                // Event delegation for better performance
                li.addEventListener('click', (e) => {
                    if (e.target === removeBtn) {
                        e.stopPropagation();
                        const indexToRemove = parseInt(removeBtn.dataset.index);
                        state.markedQuestions = state.markedQuestions.filter(i => i !== indexToRemove);
                        updateMarkedButton();
                        updateQuestionNumbers();
                        renderMarkedList(); // Re-render after removal
                    } else {
                        state.currentQuestionIndex = index;
                        loadQuestion(state.currentQuestionIndex);
                        closePopup('markedPopup');
                    }
                });
                
                fragment.appendChild(li);
            });
        }
        
        elements.markedList.innerHTML = '';
        elements.markedList.appendChild(fragment);
    }

    // Update marked button text
    function updateMarkedButton() {
        elements.showMarkedBtn.textContent = `Marked Questions (${state.markedQuestions.length})`;
    }

    // Start timer
    function startTimer() {
        clearInterval(state.timerInterval);
        updateTimerDisplay();
        state.timerInterval = setInterval(() => {
            state.timeLeft--;
            updateTimerDisplay();
            if (state.timeLeft <= 0) handleTimeOut();
        }, 1000);
    }

    // Update timer display
    function updateTimerDisplay() {
        const minutes = Math.floor(state.timeLeft / 60).toString().padStart(2, '0');
        const seconds = (state.timeLeft % 60).toString().padStart(2, '0');
        elements.timerElement.textContent = `Time: ${minutes}:${seconds}`;
        elements.timerElement.classList.toggle('warning', state.timeLeft <= 30);
    }

    // Handle timeout
    function handleTimeOut() {
        clearInterval(state.timerInterval);

        localStorage.setItem('answered', state.userAnswers.size);
        localStorage.setItem('total', state.questions.length);
        localStorage.setItem('examResults', JSON.stringify({
            score: 'Time Out',
            details: []
        }));

        window.location.href = 'TimeIsOut.html';
    }

    // Try to submit test
    function trySubmitTest() {
        const unansweredQuestions = getUnansweredQuestions();
        
        if (unansweredQuestions.length > 0) {
            state.currentQuestionIndex = unansweredQuestions[0];
            loadQuestion(state.currentQuestionIndex);
            return;
        }
        
        submitTest();
    }

    // Submit test
    function submitTest() {
        clearInterval(state.timerInterval);
        const timeSpent = 120 - state.timeLeft;
        let correctAnswers = 0;
        
        const results = state.questions.map((question, index) => {
            const isCorrect = state.userAnswers.get(index) === question.correctAnswer;
            if (isCorrect) correctAnswers++;
            return { isCorrect };
        });

        const score = Math.round((correctAnswers / state.questions.length) * 100);

        localStorage.setItem('examResults', JSON.stringify({
            correctAnswers,
            totalQuestions: state.questions.length,
            timeSpent,
            score,
            details: results
        }));

        window.location.href = score >= 60 ? 'Success.html' : 'Failure.html';
    }

    // Open popup
    function openPopup(id) {
        const popup = document.getElementById(id);
        popup.style.display = 'flex';
        
        if (id === 'markedPopup') renderMarkedList();
        if (id === 'unansweredPopup') renderUnansweredList(getUnansweredQuestions());
    }

    // Close popup
    function closePopup(id) {
        document.getElementById(id).style.display = 'none';
    }

    // Set up event listeners
    function setupEventListeners() {
        // Navigation buttons
        elements.prevBtn.addEventListener('click', () => {
            if (state.currentQuestionIndex > 0) {
                state.currentQuestionIndex--;
                loadQuestion(state.currentQuestionIndex);
            }
        });

        elements.nextBtn.addEventListener('click', () => {
            if (state.currentQuestionIndex < state.questions.length - 1) {
                state.currentQuestionIndex++;
                loadQuestion(state.currentQuestionIndex);
            }
        });

        // Mark button
        elements.markBtn.addEventListener('click', () => {
            const index = state.currentQuestionIndex;
            if (state.markedQuestions.includes(index)) {
                state.markedQuestions = state.markedQuestions.filter(i => i !== index);
            } else {
                state.markedQuestions.push(index);
            }
            updateQuestionNumbers();
            updateMarkedButton();
        });

        // Submit button
        elements.submitBtn.addEventListener('click', trySubmitTest);

        // Question numbers
        elements.questionNumbers.forEach((number, index) => {
            number.addEventListener('click', () => {
                state.currentQuestionIndex = index;
                loadQuestion(state.currentQuestionIndex);
            });
        });

        // Popup buttons
        elements.showMarkedBtn.addEventListener('click', () => openPopup('markedPopup'));
        elements.showUnansweredBtn.addEventListener('click', () => openPopup('unansweredPopup'));

        // Close buttons
        elements.closeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const popup = this.closest('.popup');
                closePopup(popup.id);
            });
        });

        // Click outside to close
        window.addEventListener('click', function(event) {
            if (event.target.classList.contains('popup')) {
                closePopup(event.target.id);
            }
        });
    }

    // Add button highlight styles
    function addButtonStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .highlight-button {
                animation: pulse 1.5s infinite;
                background-color: #ffcc00 !important;
                border: 2px solid #ff9900 !important;
            }
            
            .ready-submit {
                background-color: #4CAF50 !important;
                border: 2px solid #45a049 !important;
            }
            
            @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(255, 204, 0, 0.7); }
                70% { box-shadow: 0 0 0 10px rgba(255, 204, 0, 0); }
                100% { box-shadow: 0 0 0 0 rgba(255, 204, 0, 0); }
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize app
    function init() {
        setupEventListeners();
        addButtonStyles();
        loadQuestions();
    }

    // Start the app
    init();
});