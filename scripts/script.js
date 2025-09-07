const modal = document.getElementById("roadmapModal");
const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");
openBtn.onclick = () => modal.style.display = "flex";
closeBtn.onclick = () => modal.style.display = "none";

const resultModal = document.getElementById("resultModal");
const closeResult = document.getElementById("closeResult");
window.onclick = (e) => {
  if (e.target == modal) modal.style.display = "none";
  if (e.target == resultModal) resultModal.style.display = "none";
};
closeResult.onclick = () => resultModal.style.display = "none";

document.getElementById("learnMoreBtn").onclick = () => {
  document.getElementById("features").scrollIntoView({ behavior: "smooth" });
};

const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
hamburger.onclick = () => mobileMenu.classList.toggle("active");
document.querySelectorAll(".nav-links-mobile a").forEach(link => {
  link.addEventListener("click", () => mobileMenu.classList.remove("active"));
});

const themeToggle = document.getElementById("themeToggle");
const body = document.body;
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark");
  themeToggle.textContent = "☀️";
}
themeToggle.onclick = () => {
  body.classList.toggle("dark");
  if (body.classList.contains("dark")) {
    themeToggle.textContent = "☀️";
    localStorage.setItem("theme", "dark");
  } else {
    themeToggle.textContent = "🌙";
    localStorage.setItem("theme", "light");
  }
};
// Keep openModal as a pure modal trigger, no navigation
// (link-based redirect removed to avoid navigating to null)

const generateBtn = document.querySelector(".generate-btn");
const goalInput = document.getElementById("goalInput");
const roadmapOutput = document.getElementById("roadmapOutput");

const fetchData = async (role) => {
  console.log("fetching data ...")
  const query = role.replace(/ /g, '-')
  const apiResponse = await fetch(
    `https://eduverse-be-1.onrender.com/api/v1/roadmap/generate?role=${query}`
  )
  return apiResponse
}

const apiResponse = {
  data: {
    roadmap: [
      {
        stage: "Beginner",
        skills: ["Python Programming","Data Manipulation with Pandas","Data Visualization with Matplotlib/Seaborn","Basic Statistics"],
        resources:[
          {name:"Google's Python Class",url:"https://developers.google.com/edu/python"},
          {name:"DataCamp's Intro to Python",url:"https://www.datacamp.com/courses/intro-to-python-for-data-science"},
          {name:"Khan Academy Statistics & Probability",url:"https://www.khanacademy.org/math/statistics-probability"}
        ],
        project: "Analyze a public dataset (e.g., from Kaggle) to identify trends and create visualizations."
      },
      {
        stage: "Intermediate",
        skills: ["Machine Learning Algorithms (Regression, Classification)","Model Evaluation Metrics","Data Cleaning and Preprocessing","SQL for Data Extraction"],
        resources:[
          {name:"scikit-learn documentation",url:"https://scikit-learn.org/stable/documentation.html"},
          {name:"Stanford's Machine Learning Course (Coursera)",url:"https://www.coursera.org/learn/machine-learning"},
          {name:"SQLZoo",url:"https://sqlzoo.net/"}
        ],
        project: "Build a predictive model using a chosen machine learning algorithm on a dataset of your choice, evaluating its performance rigorously."
      },
      {
        stage: "Advanced",
        skills: ["Deep Learning","Big Data Technologies (Spark, Hadoop)","Cloud Computing (AWS, GCP, Azure)","Model Deployment and Monitoring"],
        resources:[
          {name:"DeepLearning.AI TensorFlow Developer",url:"https://www.deeplearning.ai/programs/tensorflow-developer"},
          {name:"AWS Certified Machine Learning",url:"https://aws.amazon.com/certification/certified-machine-learning-specialty/"}
        ],
        project: "Deploy your trained model as a web service and monitor its performance with live data."
      }
    ]
  }
};

document.querySelector('#goalInput').addEventListener('keydown', async (e) => {
   if (e.key !== 'Enter') return 
   e.preventDefault()
  console.log('hello')
  if (!goalInput.value) {
    alert('Please enter a goal')
    return
  }
  
  // Show loading state
  generateBtn.disabled = true;
  generateBtn.classList.add("loading");
  generateBtn.textContent = "Generating...";
  
  try {
    roadmapOutput.innerHTML = ''
    const response = await fetchData(goalInput.value)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const apiResponse = await response.json()
    console.log("Full API Response:", apiResponse) // Debug log
    
    // Check if we have the expected response structure
    if (!apiResponse || !apiResponse.data) {
      console.error("Unexpected API response structure:", apiResponse)
      throw new Error("Invalid response from server")
    }
    
    // The roadmap data should be in apiResponse.data.roadmap
    const roadmapData = apiResponse.data.roadmap || apiResponse.data
    
    if (!roadmapData || !Array.isArray(roadmapData)) {
      console.error("Roadmap data is not an array:", roadmapData)
      throw new Error("Invalid roadmap data format")
    }
    
    roadmapData.forEach((stage) => {
      const div = document.createElement('div')
      div.classList.add('roadmap-stage')
      div.innerHTML = `<h4>${stage.stage}</h4>
        <strong>Skills:</strong>
        <ul>${stage.skills.map((skill) => `<li>${skill}</li>`).join('')}</ul>
        <strong>Resources:</strong>
        <ul>${stage.resources
          .map(
            (res) =>
              `<li><a href="${res.url}" target="_blank">${res.name}</a></li>`
          )
          .join('')}</ul>
        <strong>Project:</strong>
        <p>${stage.project}</p>`
      roadmapOutput.appendChild(div)
    })
    modal.style.display = 'none'
    resultModal.style.display = 'flex'
  } catch (error) {
    console.error("Error generating roadmap:", error);
    alert(`Failed to generate roadmap: ${error.message}. Please try again.`);
  } finally {
    // Hide loading state
    generateBtn.disabled = false;
    generateBtn.classList.remove("loading");
    generateBtn.textContent = "⚡ Generate Roadmap";
  }
  
})

generateBtn.onclick = async () => {
  if (!goalInput.value) { alert("Please enter a goal"); return; }
  
  // Show loading state
  generateBtn.disabled = true;
  generateBtn.classList.add("loading");
  generateBtn.textContent = "Generating...";
  
  try {
    roadmapOutput.innerHTML = "";
    const response = await fetchData(goalInput.value);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const apiResponse = await response.json();
    console.log("Full API Response:", apiResponse); // Debug log
    
    // Check if we have the expected response structure
    if (!apiResponse || !apiResponse.data) {
      console.error("Unexpected API response structure:", apiResponse);
      throw new Error("Invalid response from server");
    }
    
    // The roadmap data should be in apiResponse.data.roadmap
    const roadmapData = apiResponse.data.roadmap || apiResponse.data;
    
    if (!roadmapData || !Array.isArray(roadmapData)) {
      console.error("Roadmap data is not an array:", roadmapData);
      throw new Error("Invalid roadmap data format");
    }
    
    roadmapData.forEach(stage => {
      const div = document.createElement("div");
      div.classList.add("roadmap-stage");
      div.innerHTML = `<h4>${stage.stage}</h4>
        <strong>Skills:</strong>
        <ul>${stage.skills.map(skill => `<li>${skill}</li>`).join("")}</ul>
        <strong>Resources:</strong>
        <ul>${stage.resources.map(res => `<li><a href="${res.url}" target="_blank">${res.name}</a></li>`).join("")}</ul>
        <strong>Project:</strong>
        <p>${stage.project}</p>`;
      roadmapOutput.appendChild(div);
    });
    modal.style.display = "none";
    resultModal.style.display = "flex";
  } catch (error) {
    console.error("Error generating roadmap:", error);
    alert(`Failed to generate roadmap: ${error.message}. Please try again.`);
  } finally {
    // Hide loading state
    generateBtn.disabled = false;
    generateBtn.classList.remove("loading");
    generateBtn.textContent = "⚡ Generate Roadmap";
  }
};
