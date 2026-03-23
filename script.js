    const quizData = {
      easy: [
        { q: "What is the chemical symbol for gold?", opts: ["Ag","Go","Au","Gd"], ans: 2 },
        { q: "What gas do plants absorb from the atmosphere?", opts: ["Oxygen","Nitrogen","Carbon Dioxide","Hydrogen"], ans: 2 },
        { q: "What is the powerhouse of the cell?", opts: ["Nucleus","Ribosome","Mitochondria","Golgi Apparatus"], ans: 2 },
        { q: "In which year did World War II end?", opts: ["1943","1944","1945","1946"], ans: 2 },
        { q: "Who was the first President of the United States?", opts: ["John Adams","Thomas Jefferson","Benjamin Franklin","George Washington"], ans: 3 },
        { q: "What is the capital of Australia?", opts: ["Sydney","Melbourne","Brisbane","Canberra"], ans: 3 },
        { q: "What is the capital of Japan?", opts: ["Osaka","Kyoto","Tokyo","Hiroshima"], ans: 2 },
        { q: "What does 'CPU' stand for?", opts: ["Central Processing Unit","Computer Personal Unit","Central Program Utility","Core Processing Unit"], ans: 0 },
        { q: "Which language is primarily used for web styling?", opts: ["JavaScript","HTML","Python","CSS"], ans: 3 },
        { q: "What does 'RAM' stand for?", opts: ["Read Access Memory","Random Access Memory","Read Allocate Memory","Random Allocate Memory"], ans: 1 },
      ],
      medium: [
        { q: "How many bones are in the adult human body?", opts: ["186","206","216","196"], ans: 1 },
        { q: "What is the atomic number of carbon?", opts: ["6","8","12","14"], ans: 0 },
        { q: "What is Newton's second law of motion?", opts: ["F = mv","F = ma","E = mc²","p = mv"], ans: 1 },
        { q: "The Great Wall of China was primarily built during which dynasty?", opts: ["Han","Tang","Ming","Qing"], ans: 2 },
        { q: "In what year did the Berlin Wall fall?", opts: ["1987","1988","1989","1991"], ans: 2 },
        { q: "Which is the longest river in the world?", opts: ["Amazon","Nile","Yangtze","Mississippi"], ans: 1 },
        { q: "What is the smallest country in the world?", opts: ["Monaco","San Marino","Vatican City","Liechtenstein"], ans: 2 },
        { q: "What does 'HTTP' stand for?", opts: ["HyperText Transfer Protocol","High-level Text Transfer Process","HyperText Transmission Process","High Text Transfer Protocol"], ans: 0 },
        { q: "Who created the Python programming language?", opts: ["James Gosling","Guido van Rossum","Brendan Eich","Dennis Ritchie"], ans: 1 },
        { q: "What does 'SQL' stand for?", opts: ["Standard Query Language","Structured Query Language","Simple Query Logic","Sequential Query Language"], ans: 1 },
      ],
      hard: [
        { q: "What is the speed of light in a vacuum?", opts: ["299,792 km/s","199,792 km/s","399,792 km/s","149,896 km/s"], ans: 0 },
        { q: "What is the most abundant gas in Earth's atmosphere?", opts: ["Oxygen","Carbon Dioxide","Argon","Nitrogen"], ans: 3 },
        { q: "DNA stands for?", opts: ["Deoxyribonucleic Acid","Deoxyribonicotinic Acid","Dipeptide Nucleic Acid","Diribonucleic Acid"], ans: 0 },
        { q: "Which empire was ruled by Genghis Khan?", opts: ["Ottoman","Mongol","Roman","Persian"], ans: 1 },
        { q: "The French Revolution began in which year?", opts: ["1776","1789","1799","1804"], ans: 1 },
        { q: "Which country was the first to grant women the right to vote?", opts: ["USA","UK","New Zealand","France"], ans: 2 },
        { q: "Which country has the most natural lakes?", opts: ["Russia","USA","Finland","Canada"], ans: 3 },
        { q: "What is the binary representation of the decimal number 10?", opts: ["1001","1010","1100","1011"], ans: 1 },
        { q: "Which company created the Java programming language?", opts: ["Microsoft","Apple","Sun Microsystems","IBM"], ans: 2 },
        { q: "Which desert is the largest in the world?", opts: ["Sahara","Arabian","Gobi","Antarctic"], ans: 3 },
      ]
    };

    const difficultyTime = { easy: 45, medium: 30, hard: 15 };

    let currentQuestions = [];
    let selectedDifficulty = '';
    let currentQ = 0, score = 0;
    let answered = false, timerInterval = null, timeLeft = 30;
    let timeTaken = [];
    let questionStartTime = 0;

    function show(id) {
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      document.getElementById(id).classList.add('active');
      window.scrollTo(0, 0);
    }

    document.getElementById('difficulty-select').addEventListener('change', function () {
      document.getElementById('start-btn').disabled = !this.value;
    });

    function startQuiz() {
      selectedDifficulty = document.getElementById('difficulty-select').value;
      if (!selectedDifficulty) return;

      currentQuestions = quizData[selectedDifficulty];
      currentQ = 0; score = 0; timeTaken = [];

      const label = selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1);
      document.getElementById('quiz-title-badge').textContent = label + ' Quiz';

      show('quiz');
      loadQuestion();
    }

    function loadQuestion() {
      const q = currentQuestions[currentQ];
      answered = false;
      timeLeft = difficultyTime[selectedDifficulty];

      const total = currentQuestions.length;
      document.getElementById('q-number').textContent = `QUESTION ${currentQ + 1}`;
      document.getElementById('q-counter').textContent = `${currentQ + 1} / ${total}`;
      document.getElementById('q-text').textContent = q.q;

      const grid = document.getElementById('options-grid');
      const keys = ['A','B','C','D'];
      grid.innerHTML = q.opts.map((opt, i) => `
        <div class="option" id="opt-${i}" onclick="selectOption(${i})">
          <div class="option-key">${keys[i]}</div>
          <span>${opt}</span>
        </div>`).join('');

      const fb = document.getElementById('feedback-bar');
      fb.className = 'feedback-bar';
      fb.innerHTML = '';
      document.getElementById('next-btn').style.display = 'none';

      clearInterval(timerInterval);
      updateTimer();
      questionStartTime = Date.now();
      timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) { clearInterval(timerInterval); autoFail(); }
      }, 1000);
    }

    function updateTimer() {
      document.getElementById('timer').textContent = timeLeft;
      const urgentAt = Math.max(5, Math.floor(difficultyTime[selectedDifficulty] / 3));
      document.getElementById('timer-badge').className =
        'timer-badge' + (timeLeft <= urgentAt ? ' urgent' : '');
    }

    function selectOption(idx) {
      if (answered) return;
      answered = true;
      clearInterval(timerInterval);
      timeTaken.push(Math.round((Date.now() - questionStartTime) / 1000));

      const q = currentQuestions[currentQ];
      const correct = q.ans === idx;
      if (correct) score++;

      for (let i = 0; i < q.opts.length; i++) {
        const o = document.getElementById(`opt-${i}`);
        if (!o) continue;
        o.classList.add('disabled');
        if (i === q.ans) o.classList.add('correct');
        else if (i === idx && !correct) o.classList.add('wrong');
      }

      const fb = document.getElementById('feedback-bar');
      fb.innerHTML = correct
        ? `<span>✅</span> <span><strong>Correct!</strong> Well done.</span>`
        : `<span>❌</span> <span><strong>Incorrect.</strong> The right answer was <strong>${q.opts[q.ans]}</strong>.</span>`;
      fb.className = 'feedback-bar show ' + (correct ? 'correct-fb' : 'wrong-fb');

      document.getElementById('next-btn').style.display = 'flex';
    }

    function autoFail() {
      if (answered) return;
      answered = true;
      timeTaken.push(difficultyTime[selectedDifficulty]);
      const q = currentQuestions[currentQ];

      for (let i = 0; i < q.opts.length; i++) {
        const o = document.getElementById(`opt-${i}`);
        if (!o) continue;
        o.classList.add('disabled');
        if (i === q.ans) o.classList.add('correct');
      }

      setTimeout(() => nextQuestion(), 1000);
    }

    function nextQuestion() {
      currentQ++;
      if (currentQ >= currentQuestions.length) showResults();
      else loadQuestion();
    }

    function showResults() {
      clearInterval(timerInterval);
      show('results');

      const total = currentQuestions.length;
      const pct = Math.round((score / total) * 100);
      const wrong = total - score;
      const avgTime = timeTaken.length
        ? Math.round(timeTaken.reduce((a, b) => a + b, 0) / timeTaken.length)
        : 0;

      const pctEl = document.getElementById('score-pct');
      pctEl.textContent = pct + '%';
      pctEl.className = 'score-pct-display ' + (pct >= 80 ? 'great' : pct >= 50 ? 'good' : 'low');

      document.getElementById('r-correct').textContent = score;
      document.getElementById('r-wrong').textContent = wrong;
      document.getElementById('r-time').textContent = avgTime + 's';

      let title, sub;
      if (pct === 100)    { title = "🏆 Perfect Score!";  sub = "Absolutely flawless. You aced every single question!"; }
      else if (pct >= 80) { title = "🌟 Excellent!";      sub = "Outstanding performance. You clearly know your stuff."; }
      else if (pct >= 60) { title = "👍 Good Job!";       sub = "Solid performance! A bit more practice and you'll nail it."; }
      else if (pct >= 40) { title = "📚 Keep Studying";   sub = "Not bad, but there's room to grow. Keep at it!"; }
      else                { title = "💪 Keep Trying!";    sub = "Don't give up! Review the material and try again."; }

      document.getElementById('result-title').textContent = title;
      document.getElementById('result-subtitle').textContent = sub;

      if (pct >= 80) spawnConfetti();
    }

    function spawnConfetti() {
      const colors = ['#6c63ff','#ff6584','#43e97b','#ffd166','#4ecdc4'];
      for (let i = 0; i < 60; i++) {
        setTimeout(() => {
          const c = document.createElement('div');
          c.className = 'confetti-piece';
          c.style.cssText = `
            left:${Math.random()*100}vw; top:-10px;
            background:${colors[Math.floor(Math.random()*colors.length)]};
            animation-duration:${1.5+Math.random()*2}s;
            animation-delay:${Math.random()*0.5}s;
            transform:rotate(${Math.random()*360}deg);
            width:${6+Math.random()*6}px; height:${6+Math.random()*6}px;
          `;
          document.body.appendChild(c);
          setTimeout(() => c.remove(), 4000);
        }, i * 30);
      }
    }

    function goHome() {
      clearInterval(timerInterval);
      document.getElementById('difficulty-select').value = '';
      document.getElementById('start-btn').disabled = true;
      show('home');
    }

    function retryQuiz() {
      clearInterval(timerInterval);
      currentQ = 0; score = 0; timeTaken = [];
      show('quiz');
      loadQuestion();
    }

    document.addEventListener('keydown', (e) => {
      if (!document.getElementById('quiz').classList.contains('active')) return;
      const map = { 'a':0,'A':0,'b':1,'B':1,'c':2,'C':2,'d':3,'D':3 };
      if (map[e.key] !== undefined && !answered) selectOption(map[e.key]);
      if (e.key === 'Enter' && answered) nextQuestion();
    });