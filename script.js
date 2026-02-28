document.addEventListener('DOMContentLoaded', () => {
  
  // Elements
  const complaintForm = document.getElementById('complaintForm');
  const trackBtn = document.getElementById('trackBtn');
  const statusResult = document.getElementById('statusResult');
  const totalComplaintsEl = document.getElementById('totalComplaints');
  const commonIssueEl = document.getElementById('commonIssue');
  const resolutionRateEl = document.getElementById('resolutionRate');
  const chatSend = document.getElementById('chatSend');
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');

  // Store complaints in localStorage
  function saveComplaint(complaint) {
    let complaints = JSON.parse(localStorage.getItem('complaints')) || [];
    complaints.push(complaint);
    localStorage.setItem('complaints', JSON.stringify(complaints));
  }

  function getComplaints() {
    return JSON.parse(localStorage.getItem('complaints')) || [];
  }

  // --- Submit Complaint Logic ---
  if (complaintForm) {
    complaintForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Get values
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const category = document.getElementById('category').value;
      const details = document.getElementById('details').value;
      const attachment = document.getElementById('attachment').value;

      // Generate unique ID
      const complaintId = 'CMP-' + Math.floor(100000 + Math.random() * 900000);
      const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      // Create complaint object
      const complaint = {
        id: complaintId,
        name,
        email,
        category,
        details,
        attachment,
        date,
        status: 'Pending',
        response: 'No response yet.'
      };

      // Save complaint
      saveComplaint(complaint);

      // Button feedback
      const btn = complaintForm.querySelector('button');
      const originalText = btn.innerText;
      btn.innerText = 'Submitting...';
      btn.disabled = true;

      setTimeout(() => {
        alert(`Complaint submitted successfully!\nYour ID: ${complaintId}`);
        complaintForm.reset();
        btn.innerText = originalText;
        btn.disabled = false;
        // Auto-fill track input
        document.getElementById('trackId').value = complaintId;
      }, 1000);

      // Update dashboard
      updateDashboard();
    });
  }

  // --- Track Complaint Logic ---
  if (trackBtn) {
    trackBtn.addEventListener('click', () => {
      const trackId = document.getElementById('trackId').value.trim();
      const complaints = getComplaints();
      const complaint = complaints.find(c => c.id === trackId);

      if (complaint) {
        document.getElementById('resultId').textContent = complaint.id;
        document.getElementById('resultStatus').textContent = complaint.status;
        document.getElementById('resultCategory').textContent = complaint.category;
        document.getElementById('resultDate').textContent = complaint.date;
        document.getElementById('resultResponse').textContent = complaint.response;

        statusResult.classList.remove('hidden');
      } else {
        alert('Complaint ID not found. Please check and try again.');
        statusResult.classList.add('hidden');
      }
    });
  }

  // --- Dashboard Update ---
  function updateDashboard() {
    const complaints = getComplaints();
    totalComplaintsEl.textContent = complaints.length;

    if (complaints.length > 0) {
      // Find most common category
      const categoryCount = {};
      complaints.forEach(c => {
        categoryCount[c.category] = (categoryCount[c.category] || 0) + 1;
      });
      const commonCategory = Object.keys(categoryCount).reduce((a, b) =>
        categoryCount[a] > categoryCount[b] ? a : b
      );
      commonIssueEl.textContent = commonCategory;

      // Resolution rate (dummy: count complaints with status "Resolved")
      const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;
      const rate = Math.round((resolvedCount / complaints.length) * 100);
      resolutionRateEl.textContent = rate + '%';
    } else {
      commonIssueEl.textContent = 'N/A';
      resolutionRateEl.textContent = '0%';
    }
  }

  updateDashboard();

  // --- Chatbot Placeholder ---
  if (chatSend) {
    chatSend.addEventListener('click', () => {
      const message = chatInput.value.trim();
      if (message) {
        const userMsg = document.createElement('p');
        userMsg.innerHTML = `<strong>You:</strong> ${message}`;
        chatMessages.appendChild(userMsg);

        // Bot reply (placeholder)
        const botMsg = document.createElement('p');
        botMsg.innerHTML = `<strong>Bot:</strong> I'm just a demo chatbot. Your message was "${message}".`;
        chatMessages.appendChild(botMsg);

        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    });
  }
});
