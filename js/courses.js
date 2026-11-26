const coursesData = [
  {
    code: "CS101",
    title: "Introduction to AI",
    instructor: "Dr. Amr Ghonem",
    credits: 4,
    dayTime: "Sun / Tue 10:00 AM - 11:30 AM",
    seatsAvailable: 586,
    totalSeats: 600
  },
  {
    code: "CS204",
    title: "Database Management Systems 2",
    instructor: "Dr. Mona El-Sayed",
    credits: 3,
    dayTime: "Mon / Wed 12:00 PM - 1:30 PM",
    seatsAvailable: 580,
    totalSeats: 600
  },
  {
    code: "SE301",
    title: "Software Engineering",
    instructor: "Dr. Amr Ghonem",
    credits: 4,
    dayTime: "Tue / Thu 2:00 PM - 4:00 PM",
    seatsAvailable: 578,
    totalSeats: 600
  },
  {
    code: "MATH201",
    title: "Discrete Mathematics",
    instructor: "Dr. Khaled Mohamed",
    credits: 3,
    dayTime: "Sun / Wed 8:30 AM - 10:00 AM",
    seatsAvailable: 548,
    totalSeats: 600
  },
  {
    code: "IT105",
    title: "Network 1",
    instructor: "Dr. Eslam Zakarya",
    credits: 3,
    dayTime: "Thu 10:00 AM - 12:00 PM",
    seatsAvailable: 579,
    totalSeats: 600
  },
  {
    code: "IT202",
    title: "Operating Systems & Linux Administration",
    instructor: "Ahmed Hesham Mostafa",
    credits: 3,
    dayTime: "Sun / Tue 12:00 PM - 1:30 PM",
    seatsAvailable: 590,
    totalSeats: 600
  },
  {
    code: "PS210",
    title: "Programming Language 3",
    instructor: "Dr. Islam Gamal",
    credits: 3,
    dayTime: "Mon / Wed 2:00 PM - 3:30 PM",
    seatsAvailable:587 ,
    totalSeats: 600
  }
];

const courseListEl = document.getElementById("courseList");
const searchInputEl = document.getElementById("searchInput");
const creditFilterEl = document.getElementById("creditFilter");
const modalEl = document.getElementById("courseModal");
const closeModalBtn = document.getElementById("closeModalBtn");

function renderCourses(list) {
  courseListEl.innerHTML = "";

  if (list.length === 0) {
    courseListEl.innerHTML = "<p>No courses match your search.</p>";
    return;
  }

  list.forEach((course) => {
    const card = document.createElement("article");
    card.className = "course-card glass-card";
    card.innerHTML = `
      <div>
        <div class="course-code">${course.code} • ${course.credits} Credit Hours</div>
        <h2 class="course-title">${course.title}</h2>
        <div class="course-meta">Instructor: ${course.instructor}</div>
      </div>
      <button type="button" class="btn btn-primary" onclick="openCourseDetails('${course.code}')">
        View Details
      </button>
    `;
    courseListEl.appendChild(card);
  });
}

function filterCourses() {
  const query = searchInputEl.value.toLowerCase().trim();
  const selectedCredits = creditFilterEl.value;

  const filtered = coursesData.filter((course) => {
    const matchesText =
      course.code.toLowerCase().includes(query) ||
      course.title.toLowerCase().includes(query) ||
      course.instructor.toLowerCase().includes(query);

    const matchesCredits =
      selectedCredits === "all" || course.credits === Number(selectedCredits);

    return matchesText && matchesCredits;
  });

  renderCourses(filtered);
}

function openCourseDetails(courseCode) {
  const course = coursesData.find((c) => c.code === courseCode);
  if (!course) return;

  document.getElementById("modalTitle").textContent = course.title;
  document.getElementById("modalCode").textContent = course.code;
  document.getElementById("modalInstructor").textContent = course.instructor;
  document.getElementById("modalCredits").textContent = `${course.credits} Hours`;
  document.getElementById("modalSchedule").textContent = course.dayTime;
  document.getElementById("modalSeats").textContent =
    `${course.seatsAvailable} / ${course.totalSeats} seats open`;

  modalEl.style.display = "flex";
}

closeModalBtn.addEventListener("click", () => {
  modalEl.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modalEl) {
    modalEl.style.display = "none";
  }
});

searchInputEl.addEventListener("input", filterCourses);
creditFilterEl.addEventListener("change", filterCourses);

renderCourses(coursesData);