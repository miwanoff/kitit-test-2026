document.addEventListener("DOMContentLoaded", () => {
  // Елементи DOM
  const startScreen = document.getElementById("start-screen");
  const quizScreen = document.getElementById("quiz-screen");
  const resultsScreen = document.getElementById("results-screen");
  const restartBtn = document.getElementById("restart-btn");
  const progressBar = document.getElementById("progress-bar");
  const questionText = document.getElementById("question-text");
  const answerButtons = document.getElementById("answer-buttons");
  const resultContent = document.getElementById("result-content");

  // НОВІ ЕЛЕМЕНТИ (КРОК 2)
  const leadFormContainer = document.getElementById("lead-form-container");
  const finalCtaContainer = document.getElementById("final-cta-container");
  const leadForm = document.getElementById("lead-form");
  const tgBotLink = document.getElementById("tg-bot-link");
  const formLoader = document.getElementById("form-loader");

  // Змінні стану
  let allQuestions = [];
  let currentQuestionIndex = 0;
  let userScores = { a: 0, b: 0, c: 0, d: 0, e: 0 };
  let userClass = "";
  let currentArchetype = null;
  let recommendedCourses = [];

  // Слухачі подій
  const startButtons = document.querySelectorAll(".start-btn");
  startButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      startQuiz();
    });
  });

  if (restartBtn) restartBtn.addEventListener("click", restartQuiz);

  // --- ОБРОБКА ФОРМИ ЗБОРУ ЛІДІВ (ПЕРЕНЕСЕНО З test.html) ---
  const scriptURL =
    "https://script.google.com/macros/s/AKfycbyiLMJSC6LFs0NnkYhE2QIPS-uqGLgBFd36WDg_Mc1bTLJxecNL5BSFLt3EjNUv4jjgOw/exec";

  if (leadForm) {
    leadForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Показуємо лоадер
      if (formLoader) formLoader.classList.remove("d-none");
      const submitBtn = document.getElementById("submit-lead-btn");
      if (submitBtn) submitBtn.disabled = true;

      fetch(scriptURL, {
        method: "POST",
        mode: "no-cors",
        body: new FormData(leadForm),
      })
        .then(() => {
          console.log("Success!");
          if (formLoader) formLoader.classList.add("d-none");

          // Перехід до фінального CTA
          leadFormContainer.classList.add("d-none");
          finalCtaContainer.classList.remove("d-none");
        })
        .catch((error) => {
          console.error("Error!", error.message);
          if (formLoader) formLoader.classList.add("d-none");
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }

  // --- ДАНІ АРХЕТИПІВ ---
  // Переконайтесь, що картинки (creator.png і т.д.) є в папці images
  const archetypeData = {
    a: {
      name: "Творець 🎨",
      image: "./images/creator.png",
      description:
        "Ти бачиш світ як полотно. Твоя суперсила — створювати красу, візуалізувати ідеї та робити світ яскравішим.",
    },
    b: {
      name: "Стратег 🧠",
      image: "./images/strategist.png",
      description:
        "Ти любиш логіку, порядок та складні задачі. Твоя сила — бачити структуру там, де інші бачать хаос.",
    },
    c: {
      name: "Конструктор 🛠️",
      image: "./images/constructor.png",
      description:
        "Тобі подобається знати, як все працює зсередини. Ти любиш експериментувати та створювати механізми.",
    },
    d: {
      name: "Комунікатор 🎤",
      image: "./images/communicator.png",
      description:
        "Ти вмієш знаходити спільну мову та презентувати ідеї. Твоя сила — у людях та історіях.",
    },
    e: {
      name: "Дослідник 🧭",
      image: "./images/explorer.png",
      description:
        "Тобі цікаво все і одразу. Ти — універсальний солдат, який не боїться вивчати нове.",
    },
  };

  // --- БАЗА КУРСІВ (Згідно з Лист 2) ---
  // id використовується для генерації назви файлу сертифікату (наприклад, Minecraft_1.pdf)
  // link - посилання на сторінку курсу
  const courseRecommendations = {
    // === 2-4 КЛАСИ ===
    "a-2-4": [
      {
        id: "Graphics",
        name: "Основи комп’ютерної графіки",
        link: "https://kitit.com.ua/osnovy-komp-iuternoi-hrafiky-2/",
        why: "Малювання та дизайн на ПК.",
      },
      {
        id: "Photopea",
        name: "Графічний дизайн з Photopea",
        link: "https://kitit.com.ua/hrafichnyi-dyzain-z-photopea/",
        why: "Створення професійної графіки.",
      },
    ],
    "b-2-4": [
      {
        id: "Scratch",
        name: "Програмування у Scratch",
        link: "https://kitit.com.ua/prohramuvannia-u-scratch/",
        why: "Ідеальний старт для логіки.",
      },
      {
        id: "KODU",
        name: "KODU + Minecraft + Construct",
        link: "https://kitit.com.ua/prohramuiemo-hraiuchy-razom-z-keisom-prohram-kodu-minecraft-construct3-roblox/",
        why: "Програмуємо граючи.",
      },
    ],
    "c-2-4": [
      {
        id: "Minecraft_1",
        name: "Minecraft: Програмування (блочне)",
        link: "https://kitit.com.ua/prohramuvannia-v-minecraft-blochnoiu-movoiu/",
        why: "Будуй світи кодом.",
      },
      {
        id: "Construct",
        name: "Construct 3",
        link: "https://kitit.com.ua/construct-3/",
        why: "Створення власних ігор.",
      },
    ],
    "d-2-4": [
      {
        id: "Synfig",
        name: "2D векторна анімація (Synfig)",
        link: "https://kitit.com.ua/stvorennia-2d-vektornoi-animatsii-u-synfig-studio/",
        why: "Оживляй свої малюнки.",
      },
      {
        id: "Graphics",
        name: "Основи комп’ютерної графіки",
        link: "https://kitit.com.ua/osnovy-komp-iuternoi-hrafiky-2/",
        why: "Творчість у цифрі.",
      },
    ],
    "e-2-4": [
      {
        id: "KODU",
        name: "Програмуємо граючи (Kodu+Minecraft)",
        link: "https://kitit.com.ua/prohramuiemo-hraiuchy-razom-z-keisom-prohram-kodu-minecraft-construct3-roblox/",
        why: "Спробуй різні технології.",
      },
      {
        id: "Thunkable",
        name: "Мобільні додатки в Thunkable",
        link: "https://kitit.com.ua/stvorennia-mobilnykh-dodatkiv-u-thunkable/",
        why: "Створи свій додаток.",
      },
    ],

    // === 5-7 КЛАСИ ===
    "a-5-7": [
      {
        id: "Blender",
        name: "3D моделювання у Blender",
        link: "https://kitit.com.ua/3d-modeliuvannia-u-blender/",
        why: "Професійна 3D графіка.",
      },
      {
        id: "AI_Graphics",
        name: "AI & Graphics",
        link: "https://kitit.com.ua/ai-graphics/",
        why: "Сучасне мистецтво зі ШІ.",
      },
      {
        id: "Synfig",
        name: "2D векторна анімація",
        link: "https://kitit.com.ua/stvorennia-2d-vektornoi-animatsii-u-synfig-studio/",
        why: "Створення мультфільмів.",
      },
    ],
    "b-5-7": [
      {
        id: "Minecraft_Python",
        name: "Minecraft у Python",
        link: "https://kitit.com.ua/programmirovanie-v-minecraft-2/",
        why: "Серйозне програмування у грі.",
      },
      {
        id: "Cloud_KT",
        name: "Хмарні комп’ютерні технології",
        link: "https://kitit.com.ua/kompjuternye-tehnologii-i-algoritmizacija-kt-a/",
        why: "Сучасні IT інструменти.",
      },
    ],
    "c-5-7": [
      {
        id: "Roblox",
        name: "Програмування 3D ігор у Roblox",
        link: "https://kitit.com.ua/prohramuvannia-3d-ihor-u-roblox-studio/",
        why: "Створи гру, в яку гратимуть друзі.",
      },
      {
        id: "Godot",
        name: "Створення ігор у Godot",
        link: "https://kitit.com.ua/stvorennia-ihor-u-godot/",
        why: "Потужний ігровий рушій.",
      },
    ],
    "d-5-7": [
      {
        id: "Video",
        name: "Відеомонтаж",
        link: "https://kitit.com.ua/videomontazh/",
        why: "Створюй контент для YouTube/TikTok.",
      },
      {
        id: "Thunkable",
        name: "Мобільні додатки (Thunkable)",
        link: "https://kitit.com.ua/stvorennia-mobilnykh-dodatkiv-u-thunkable/",
        why: "Додатки для телефону.",
      },
    ],
    "e-5-7": [
      {
        id: "Godot",
        name: "Створення ігор у Godot",
        link: "https://kitit.com.ua/stvorennia-ihor-u-godot/",
        why: "Розробка ігор.",
      },
      {
        id: "Minecraft_Python",
        name: "Minecraft у Python",
        link: "https://kitit.com.ua/programmirovanie-v-minecraft-2/",
        why: "Кодинг та гра.",
      },
    ],

    // === 8-11 КЛАСИ ===
    "a-8-11": [
      {
        id: "UX_UI",
        name: "Основи UX/UI-дизайну",
        link: "https://kitit.com.ua/osnovy-ux-ui-dyzaina/",
        why: "Проектування зручних сайтів.",
      },
      {
        id: "Small_web",
        name: "Основи Web-дизайну (Figma+HTML)",
        link: "https://kitit.com.ua/osnovy-web-dizajna-html5/",
        why: "Візуал та верстка.",
      },
    ],
    "b-8-11": [
      {
        id: "Python_1",
        name: "Python (Базовий та Advanced)",
        link: "https://kitit.com.ua/python/",
        why: "Найпопулярніша мова світу.",
      },
      {
        id: "C_Plus_Plus",
        name: "Програмування C++",
        link: "https://kitit.com.ua/c/",
        why: "Фундаментальна мова.",
      },
      {
        id: "Java",
        name: "Програмування Java",
        link: "https://kitit.com.ua/course/java/",
        why: "Мова корпорацій та Android.",
      },
    ],
    "c-8-11": [
      {
        id: "Web_1",
        name: "Front-end web розробка",
        link: "https://kitit.com.ua/front-end-web-razrabotka/",
        why: "Створення сайтів з нуля.",
      },
      {
        id: "C_Sharp",
        name: "C# .Net",
        link: "https://kitit.com.ua/c-net/",
        why: "Програмування для Windows та ігор.",
      },
    ],
    "d-8-11": [
      {
        id: "Small_web",
        name: "Основи Web-дизайну",
        link: "https://kitit.com.ua/osnovy-web-dizajna-html5/",
        why: "Творчість в інтернеті.",
      },
      {
        id: "Video",
        name: "Відеомонтаж (Advanced)",
        link: "https://kitit.com.ua/videomontazh/",
        why: "Професійна робота з відео.",
      },
    ],
    "e-8-11": [
      {
        id: "Web_Dive",
        name: "Занурення у WEB-розробку",
        link: "https://kitit.com.ua/veb-rozrobka-na-webflow/",
        why: "Повний стек технологій.",
      },
      {
        id: "Web_Academy",
        name: "Web-академія",
        link: "https://kitit.com.ua/web-akademija/",
        why: "Комплексне навчання.",
      },
    ],
  };

  // Функція запуску
  async function startQuiz() {
    startScreen.classList.add("d-none");
    resultsScreen.classList.add("d-none");
    quizScreen.classList.remove("d-none");
    leadFormContainer.classList.add("d-none");
    finalCtaContainer.classList.add("d-none");

    localStorage.clear();
    userScores = { a: 0, b: 0, c: 0, d: 0, e: 0 };
    currentQuestionIndex = 0;

    try {
      const response = await fetch("data/questions.json");
      if (!response.ok) throw new Error("Помилка завантаження");
      allQuestions = await response.json();
      showQuestion();
    } catch (error) {
      console.error(error);
      questionText.innerText = "Помилка завантаження тесту.";
    }
  }

  // Відображення питання
  function showQuestion() {
    answerButtons.innerHTML = "";
    const question = allQuestions[currentQuestionIndex];
    questionText.innerText = question.question;

    const progress = (currentQuestionIndex / allQuestions.length) * 100;
    progressBar.style.width = `${progress}%`;

    question.answers.forEach((answer) => {
      const btn = document.createElement("button");
      btn.className =
        "btn btn-outline-primary btn-lg text-start w-100 mb-2 p-3";
      btn.style.borderRadius = "15px";
      btn.innerText = answer.text;
      btn.dataset.value = answer.value;
      btn.onclick = selectAnswer;
      answerButtons.appendChild(btn);
    });
  }

  // Вибір відповіді
  function selectAnswer(e) {
    const val = e.target.dataset.value;
    if (currentQuestionIndex === 0) {
      userClass = val;
    } else {
      if (userScores[val] !== undefined) userScores[val]++;
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < allQuestions.length) {
      showQuestion();
    } else {
      progressBar.style.width = "100%";
      showResults();
    }
  }

  // Показ результатів
  function showResults() {
    quizScreen.classList.add("d-none");
    resultsScreen.classList.remove("d-none");

    let maxScore = -1;
    let winner = "e";
    for (let key in userScores) {
      if (userScores[key] > maxScore) {
        maxScore = userScores[key];
        winner = key;
      }
    }

    const arch = archetypeData[winner];
    currentArchetype = arch;
    const courses = courseRecommendations[`${winner}-${userClass}`] || [];
    recommendedCourses = courses;

    let coursesHTML = "";

    if (courses.length > 0) {
      coursesHTML = courses
        .map(
          (c) => `
                <li class="list-group-item border-0 shadow-sm mb-3 rounded p-3">
                    <h5 class="mb-2 text-primary fw-bold">${c.name}</h5>
                    <p class="mb-3 small text-muted">${c.why}</p>
                    
                    <div class="d-flex flex-wrap gap-2">
                        <!-- Кнопка переходу на сайт -->
                        <a href="${c.link}" target="_blank" class="btn btn-sm btn-primary px-3" style="border-radius: 20px;">
                            Детальніше про курс
                        </a>
                    </div>
                </li>
            `,
        )
        .join("");
    } else {
      coursesHTML =
        "<li class='list-group-item'>Для вас ми підберемо індивідуальну програму. Зв'яжіться з нами!</li>";
    }

    resultContent.innerHTML = `
            <div class="text-center">
                <img src="${arch.image}" alt="${arch.name}" class="img-fluid mb-4 rounded" style="max-height: 250px; object-fit: contain;">
                <h2 class="text-primary mb-3 fw-bold">${arch.name}</h2>
                <p class="lead">${arch.description}</p>
            </div>
            <hr class="my-4">
            <h4 class="text-center mb-4">Твої рекомендовані курси та знижки:</h4>
            <ul class="list-group list-group-flush px-0">
                ${coursesHTML}
            </ul>
        `;

    // Показуємо форму збору лідів
    leadFormContainer.classList.remove("d-none");
    finalCtaContainer.classList.add("d-none");
  }

  function restartQuiz() {
    resultsScreen.classList.add("d-none");
    quizScreen.classList.add("d-none");
    startScreen.classList.remove("d-none");
    leadFormContainer.classList.add("d-none");
    finalCtaContainer.classList.add("d-none");
    leadForm.reset();
  }
});
