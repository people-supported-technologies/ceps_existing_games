document.addEventListener('DOMContentLoaded', function () {
    const gridCards = document.querySelectorAll('.container .card'); // Select only cards in the grid
    const modal = document.getElementById('cardModal');
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    const modalCardContainer = document.getElementById('modalCard'); // The .card element inside the modal
    const modalCardInner = modalCardContainer.querySelector('.modal-card-inner');
    const modalCardFront = modalCardContainer.querySelector('.modal-card-front');
    const modalCardBack = modalCardContainer.querySelector('.modal-card-back');

    // Notes feature elements
    const modalNoteTextarea = document.getElementById('modalNoteTextarea');
    const saveModalNoteBtn = document.getElementById('saveModalNoteBtn');
    const exportNotesBtn = document.getElementById('exportNotesBtn');
    const exportedNotesContainer = document.getElementById('exportedNotesContainer');
    const compiledNotesTextarea = document.getElementById('compiledNotesTextarea');
    const closeExportedNotesBtn = document.getElementById('closeExportedNotesBtn');

    let currentGameTitleForNotes = null; // To store the title of the game in the currently open modal

    gridCards.forEach(gridCard => {
        gridCard.addEventListener('click', function () {
            // Get content from the clicked grid card
            const frontContentSourceElement = this.querySelector('.modal-front-content');
            const backContentSourceElement = this.querySelector('.game-mechanics-content');

            console.log("Source Front Content Element:", frontContentSourceElement);
            const frontContent = frontContentSourceElement ? frontContentSourceElement.innerHTML : "<!-- Front content source not found -->";
            console.log("Source Front HTML:", frontContent);

            console.log("Source Back Content Element:", backContentSourceElement);
            const backContent = backContentSourceElement ? backContentSourceElement.innerHTML : "<!-- Back content source not found -->";
            console.log("Source Back HTML:", backContent);

            // Populate modal card
            modalCardFront.innerHTML = frontContent;
            console.log("Modal Front Set To:", modalCardFront.innerHTML);
            modalCardBack.innerHTML = backContent;
            console.log("Modal Back Set To:", modalCardBack.innerHTML);

            // Ensure modal card is initially showing the front
            modalCardContainer.classList.remove('is-flipped');

            // Handle notes for the opened card
            const gameTitleElement = modalCardFront.querySelector('h2');
            if (gameTitleElement) {
                currentGameTitleForNotes = gameTitleElement.textContent.trim();
                const existingNote = localStorage.getItem('gameNote_' + currentGameTitleForNotes);
                modalNoteTextarea.value = existingNote ? existingNote : '';
            } else {
                currentGameTitleForNotes = null; // Should not happen if h2 is always there
                modalNoteTextarea.value = '';
            }
            saveModalNoteBtn.textContent = 'Save Note'; // Reset button text

            // Show the modal
            modal.style.display = 'block';
        });
    });

    // Event listener for flipping the card inside the modal
    if (modalCardInner) {
        modalCardInner.addEventListener('click', function (event) {
            // Prevent click from bubbling up to modal background if card content itself is clicked
            event.stopPropagation(); 
            modalCardContainer.classList.toggle('is-flipped');
        });
    }

    // Event listener for closing the modal via the close button
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', function () {
            modal.style.display = 'none';
            currentGameTitleForNotes = null; // Clear current game title on modal close
        });
    }

    // Event listener for closing the modal by clicking on the background
    if (modal) {
        modal.addEventListener('click', function (event) {
            // Only close if the direct modal background (not its children like modal-content or the card) is clicked
            if (event.target === modal) { 
                modal.style.display = 'none';
                currentGameTitleForNotes = null; // Clear current game title on modal close
            }
        });
    }

    // Save Note Button Logic
    if (saveModalNoteBtn) {
        saveModalNoteBtn.addEventListener('click', function() {
            if (currentGameTitleForNotes) {
                localStorage.setItem('gameNote_' + currentGameTitleForNotes, modalNoteTextarea.value);
                saveModalNoteBtn.textContent = 'Saved!';
                // Optionally, revert button text after a delay
                setTimeout(() => {
                    saveModalNoteBtn.textContent = 'Save Note';
                }, 1500);
            } else {
                alert('Could not determine game title to save note.');
            }
        });
    }

    // Export Notes Button Logic
    if (exportNotesBtn) {
        exportNotesBtn.addEventListener('click', function() {
            let allNotesString = '';
            const allGameTitles = [];
            // Get all unique game titles from the grid cards
            document.querySelectorAll('.container .card .card-front h2').forEach(h2 => {
                const title = h2.textContent.trim();
                if (title && !allGameTitles.includes(title)) {
                    allGameTitles.push(title);
                }
            });

            if (allGameTitles.length === 0) {
                 allNotesString = 'No game titles found on the page to check for notes.';
            } else {
                allGameTitles.forEach(title => {
                    const note = localStorage.getItem('gameNote_' + title);
                    if (note && note.trim() !== '') {
                        allNotesString += `Game: ${title}\n`;
                        allNotesString += `Notes:\n${note}\n\n`;
                        allNotesString += `-------------------------------------\n\n`;
                    }
                });
            }

            if (allNotesString.trim() === '') {
                compiledNotesTextarea.value = 'No notes found for any games yet.';
            } else {
                compiledNotesTextarea.value = allNotesString.trim();
            }
            exportedNotesContainer.style.display = 'flex'; // Use flex as per CSS for centering
        });
    }

    // Close Exported Notes Button Logic
    if (closeExportedNotesBtn) {
        closeExportedNotesBtn.addEventListener('click', function() {
            exportedNotesContainer.style.display = 'none';
        });
    }
}); 