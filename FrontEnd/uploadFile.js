document.getElementById('uploadForm').addEventListener('submit', async (event) => {
  event.preventDefault(); 
  const formData = new FormData();
  const fileInput = document.getElementById('fileInput');
  formData.append('file', fileInput.files[0]);

  const form = document.getElementById('uploadForm');

  form.querySelectorAll('input').forEach(input => {
    const name = input.name;
    const type = input.type;
  
    if (type === 'checkbox' && input.checked) {
      // For checkboxes, add to FormData only if checked
      formData.append(name, 'true');
    } else if (type === 'text' && input.value.trim() !== '') {
      // For text inputs, add to FormData only if not empty
      formData.append(name, input.value.trim());
    }
  });

  const req = new XMLHttpRequest();

  req.addEventListener("readystatechange", (e) => {
    if (e.target.readyState === 4) {
      if (e.target.status === 200) {
        const response = JSON.parse(e.target.responseText);
        console.log('Server response:', response);
      } else {
        console.log('Error:', e.target.statusText);
      }
    }
  });

  req.open("POST", 'http://localhost:3000/upload', true);
  req.send(formData);
});

document.querySelectorAll('.dropdown-item').forEach(function (item) {
  item.addEventListener('click', function (e) {
    const optionId = this.getAttribute('data-option');
    toggleOptionVisibility(optionId);
  });
});

// Toggle visibility of the selected option
function toggleOptionVisibility(optionId) {
  const optionElement = document.getElementById(optionId);
  if (optionElement) {
    const isChecked = optionElement.querySelector('input').checked;
    optionElement.style.display = isChecked ? 'none' : 'block';
  }
}