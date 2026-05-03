document.addEventListener('DOMContentLoaded', () => {
    // Tab switching logic
    const tabs = document.querySelectorAll('.tab-btn');
    const panes = document.querySelectorAll('.tab-pane');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all
            tabs.forEach(t => t.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));

            // Add active class to clicked tab and corresponding pane
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    const form = document.getElementById('submissionForm');
    const submitBtn = document.getElementById('submitBtn');
    const feedArea = document.getElementById('feedArea');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const problem = document.getElementById('problemText').value;
        const code = document.getElementById('codeText').value;
        const thinking = document.getElementById('thinkingText').value;
        const userId = document.getElementById('userId').value;

        if (!problem || !code) {
            alert('Please provide both the problem description and your code attempt.');
            return;
        }

        // Add User Message to UI
        const userMsg = document.createElement('div');
        userMsg.className = 'message user-message';
        userMsg.textContent = 'Submitted code for analysis...';
        feedArea.appendChild(userMsg);

        // Add Loading Indicator
        const loadingMsg = document.createElement('div');
        loadingMsg.className = 'message mentor-message';
        loadingMsg.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
        feedArea.appendChild(loadingMsg);
        
        feedArea.scrollTop = feedArea.scrollHeight;

        // Disable button
        submitBtn.disabled = true;
        submitBtn.textContent = 'Analyzing...';

        try {
            const response = await fetch('http://localhost:8000/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: userId,
                    problem: problem,
                    code: code,
                    thinking: thinking
                })
            });

            const data = await response.json();
            
            // Remove loading indicator
            feedArea.removeChild(loadingMsg);

            if (response.ok) {
                // Render Mentor Response
                const mentorMsg = document.createElement('div');
                mentorMsg.className = 'message mentor-message';
                mentorMsg.innerHTML = marked.parse(data.feedback);
                feedArea.appendChild(mentorMsg);
            } else {
                // Show Error
                const errorMsg = document.createElement('div');
                errorMsg.className = 'message mentor-message';
                errorMsg.style.color = 'red';
                errorMsg.textContent = `Error: ${data.detail || 'Failed to process submission'}`;
                feedArea.appendChild(errorMsg);
            }
        } catch (error) {
            // Remove loading indicator
            feedArea.removeChild(loadingMsg);
            
            const errorMsg = document.createElement('div');
            errorMsg.className = 'message mentor-message';
            errorMsg.style.color = 'red';
            errorMsg.textContent = `Connection Error: Make sure the FastAPI backend is running on port 8000.`;
            feedArea.appendChild(errorMsg);
        } finally {
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Analyze Code';
            feedArea.scrollTop = feedArea.scrollHeight;
        }
    });
});
