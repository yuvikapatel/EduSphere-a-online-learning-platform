/**
 * EduSphere — Navigation HTML Injector
 * Call injectNav() at top of each page body
 */
function injectNav() {
  const navHTML = `
  <nav class="navbar" id="navbar">
    <div class="nav-inner">
      <a href="index.html" class="nav-logo">
        <span class="logo-icon">◈</span>
        <span class="logo-text">EduSphere</span>
      </a>
      <ul class="nav-links" id="navLinks">
        <li><a href="index.html" class="nav-link">Home</a></li>
        <li><a href="curriculum.html" class="nav-link">Curriculum</a></li>
        <li><a href="classroom.html" class="nav-link">Classroom</a></li>
        <li><a href="tools.html" class="nav-link">Tools</a></li>
        <li><a href="collaborate.html" class="nav-link">Collaborate</a></li>
        <li><a href="resources.html" class="nav-link">Resources</a></li>
        <li><a href="quiz.html" class="nav-link">Quiz</a></li>
        <li><a href="enroll.html" class="nav-link">Enroll</a></li>
      </ul>
      <div class="nav-actions">
        <button class="btn-outline" id="loginBtn">Sign In</button>
        <a href="enroll.html"><button class="btn-primary" id="startBtn">Start Learning</button></a>
      </div>
      <button class="hamburger" id="hamburger" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <!-- Sign-In Panel -->
  <div class="signin-panel" id="signinPanel">
    <button class="panel-close" id="panelClose">✕</button>
    <h3>Welcome Back</h3>
    <form id="signinForm" novalidate>
      <div class="form-group">
        <label>Email Address</label>
        <input type="email" id="siEmail" placeholder="you@example.com" required />
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" id="siPassword" placeholder="••••••••" required />
      </div>
      <button type="submit" class="btn-signin">Sign In →</button>
    </form>
    <div class="signup-link">
      New here? <a href="enroll.html">Create an account</a>
    </div>
  </div>`;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = navHTML;
  document.body.insertBefore(wrapper.firstElementChild, document.body.firstChild);
  document.body.insertBefore(wrapper.firstElementChild, document.body.children[1]);
}

// Footer
function injectFooter() {
  const footerHTML = `
  <footer>
    <div class="footer-inner">
      <div class="footer-brand">
        <div class="nav-logo" style="margin-bottom:12px;">
          <span class="logo-icon">◈</span>
          <span class="logo-text">EduSphere</span>
        </div>
        <p>A next-generation virtual classroom for full-stack web development mastery.</p>
      </div>
      <div class="footer-col">
        <h4>Platform</h4>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="curriculum.html">Curriculum</a></li>
          <li><a href="classroom.html">Classroom</a></li>
          <li><a href="tools.html">Tools</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Learn</h4>
        <ul>
          <li><a href="resources.html">Resources</a></li>
          <li><a href="quiz.html">Quizzes</a></li>
          <li><a href="collaborate.html">Collaborate</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Account</h4>
        <ul>
          <li><a href="enroll.html">Sign Up</a></li>
          <li><a href="#" id="footerSignIn">Sign In</a></li>
        </ul>
      </div>
    </div>
    <div class="container">
      <div class="footer-bottom">
        <p>© 2025 EduSphere. All rights reserved.</p>
        <p>Built for learners, by learners.</p>
      </div>
    </div>
  </footer>`;

  document.body.insertAdjacentHTML('beforeend', footerHTML);
  const fsi = document.getElementById('footerSignIn');
  if (fsi) fsi.addEventListener('click', e => { e.preventDefault(); document.getElementById('signinPanel').classList.toggle('open'); });
}
