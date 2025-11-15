const themeToggle=document.querySelector(".theme-toggle");
const promptForm=document.querySelector(".prompt-form");
const promptInput=document.querySelector(".prompt-input");
const promptBtn=document.querySelector(".prompt-btn");

const modelSelect=document.getElementById("model-select");
const countSelect=document.getElementById("count-select");
const ratioSelect=document.getElementById("ratio-select");

const gridGallery=document.querySelector(".gallery-grid");

const examplePrompts = [
  "A magic forest with glowing plants and fairy homes among giant mushrooms",
  "An old steampunk airship floating through golden clouds at sunset",
  "A future Mars colony with glass domes and gardens against red mountains",
  "A dragon sleeping on gold coins in a crystal cave",
  "An underwater kingdom with merpeople and glowing coral buildings",
  "A floating island with waterfalls pouring into clouds below",
  "A witch's cottage in fall with magic herbs in the garden",
  "A robot painting in a sunny studio with art supplies around it",
  "A magical library with floating glowing books and spiral staircases",
  "A Japanese shrine during cherry blossom season with lanterns and misty mountains",
  "A cosmic beach with glowing sand and an aurora in the night sky",
  "A medieval marketplace with colorful tents and street performers",
  "A cyberpunk city with neon signs and flying cars at night",
  "A peaceful bamboo forest with a hidden ancient temple",
  "A giant turtle carrying a village on its back in the ocean",
];

//Set theme based on saved preference or system default
(()=>{//Self-invoking function => (()=>{})()
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const isDarkTheme = savedTheme === "dark" || (!savedTheme && systemPrefersDark);
    document.body.classList.toggle("dark-theme", isDarkTheme);
    themeToggle.querySelector("i").className = isDarkTheme ? "fa-solid fa-sun" : "fa-solid fa-moon";
})();

// Switch between light and dark themes
const toggleTheme = () => {
    const isDarkTheme = document.body.classList.toggle("dark-theme");
    
    localStorage.setItem("theme",isDarkTheme ? "dark" : "light")

    themeToggle.querySelector("i").className = isDarkTheme ? "fa-solid fa-sun" : "fa-solid fa-moon"
}

// Calculate width/height based on chosen ratio
const getImageDimensions = (aspectRatio, baseSize = 512) => {
    const [width, height] = aspectRatio.split("/").map(Number);
    const scaleFactor = baseSize / Math.sqrt(width * height);

    let calculatedWidth = Math.round(width * scaleFactor);
    let calculatedHeight = Math.round(height * scaleFactor);

    // Ensure dimensions are multiples of 16 (AI model requirements)
    calculatedWidth = Math.floor(calculatedWidth / 16) * 16;
    calculatedHeight = Math.floor(calculatedHeight / 16) * 16;

    return { width: calculatedWidth, height: calculatedHeight };
};

// Replace loading spinner with the actual image
const updateImageCard = (imgIndex, imgUrl) => {
    const imgCard = document.getElementById(`img-card-${imgIndex}`);
    if (!imgCard) return;

    imgCard.classList.remove("loading");
    imgCard.innerHTML = `<img src="${imgUrl}" class="result-img" />
              <div class="img-overlay">
                <button href="${imgUrl}" class="img-download-btn" download="${Date.now()}.png">
                  <i class="fa-solid fa-download"></i>
                </button>
              </div>`;
};

// Send requests to Hugging Face API to create images
const generateImages = async (selectedModel, imageCount, aspectRatio, promptText) => {
    // ✅ التغيير هنا: نوجه الطلب لسيرفرنا المحلي
    const LOCAL_SERVER_URL = "http://localhost:3000/generate-image";
    const { width, height } = getImageDimensions(aspectRatio);

    const imagePromises = Array.from({ length: imageCount }, async (_, i) => {
        try {
            const response = await fetch(LOCAL_SERVER_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // ❌ لم نعد نرسل الـ Authorization header هنا، السيرفر سيتكفل بذلك
                },
                body: JSON.stringify({
                    model: selectedModel, // نرسل اسم الموديل للسيرفر
                    prompt: promptText,
                    parameters: { width, height }
                })
            });

            if (!response.ok) throw new Error("Failed to fetch from local server");

            const result = await response.blob();
            updateImageCard(i, URL.createObjectURL(result));
        } catch (error) {
            console.log(error);
            // يمكنك تحديث البطاقة لتظهر رسالة خطأ هنا
        }
    });

    await Promise.allSettled(imagePromises);
}

// Create placeholder cards with loading spinners
const createImageCards = (selectedModel, imageCount, aspectRatio, promptText) => {
    gridGallery.innerHTML = "";
    for (let i = 0; i < imageCount; i++) {
        gridGallery.innerHTML += `<div class="img-card loading" id="img-card-${i}" style="aspect-ratio: ${aspectRatio}">
            <div class="status-container">
                <div class="spinner"></div>
                <i class="fa-solid fa-triangle-exclamation"></i>
                <p class="status-text">Generating...</p>
            </div>
        </div>`;
    }

    generateImages(selectedModel, imageCount, aspectRatio, promptText);
};

// Handle form submission
const handleFormSubmit = (e) => {
    e.preventDefault();

    // Get form values
    const selectedModel = modelSelect.value;
    const imageCount = parseInt(countSelect.value) || 1;
    const aspectRatio = ratioSelect.value || "1/1";
    const promptText = promptInput.value.trim();//trim()=>تقوم بحذف المسافات البيضاء (Whitespace)
    createImageCards(selectedModel, imageCount, aspectRatio, promptText);
};

// Fill prmpt input with random example
promptBtn.addEventListener("click",()=> {
    const prompt = examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
    promptInput.value= prompt;
    promptInput.focus()
})

promptForm.addEventListener("submit",handleFormSubmit)

/*
| المصطلح            | ماذا يحدث                            | كيف تكتبها   |
| ------------------ | ------------------------------------ | ------------ |
| Calling a function |                        تنفذ مباشرةً         |  `toggleTheme()` |
| Passing a function |            تمرر كمرجع → تُنفذ لاحقًا عند الحاجة | `toggleTheme`   |

*/
themeToggle.addEventListener('click',toggleTheme)