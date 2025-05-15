# Project Title

Brief description of the project.

## Getting Started

(Optional: Add instructions on how to get the project set up and running.)

## Usage

(Optional: Add instructions or examples on how to use the project.)

## Interface Overview

The Empathy Training Games webpage presents a collection of serious games designed for empathy training. The main components of the interface are:

1.  **Game Grid:**
    *   The initial view displays a responsive grid of "game tiles".
    *   Each tile represents a game and typically shows:
        *   A game image.
        *   The game's name.
        *   A brief instruction, e.g., "Click to learn more".

2.  **Game Card Modal:**
    *   Clicking on any game tile in the grid opens a larger, interactive "card modal" for that specific game.
    *   This modal is designed with a 3D flippable card interface.
    *   **Modal Front Face (`.modal-card-front`):**
        *   Displays the game image (potentially a larger version or the same).
        *   Shows the game name.
        *   Provides a more detailed "concept description" of the game.
        *   Includes an instruction like "Click card to flip for game mechanics".
    *   **Modal Back Face (`.modal-card-back`):**
        *   This side is intended to display an outline of the game's mechanics and rules.
    *   **Notes Section (`.modal-notes-section`):**
        *   Located within the modal, positioned below the flippable card area.
        *   Contains a textarea allowing users to type and save personal notes for the game currently being viewed.
        *   Notes are saved to the browser's local storage, specific to each game title.

3.  **Header & Export Functionality:**
    *   The page header displays the main title.
    *   An "Export All Notes" button is available in the header. Clicking this compiles all notes saved for all games into a single textarea, allowing the user to easily copy them.

## Expected Behavior

*   **Grid Interaction & Modal Opening:**
    *   When a user clicks on a game tile in the main grid, the Game Card Modal should open.
    *   The modal should initially display the "front face" content (image, name, concept description) for the selected game.
    *   The notes section in the modal should load any previously saved notes for this game.

*   **Modal Card Flip:**
    *   When the user clicks on the flippable area of the modal card (specifically, the `.modal-card-inner` element which contains the front and back faces), the card should perform a 3D flip animation (rotating 180 degrees around its Y-axis).
    *   After the flip, the "back face" of the modal card should be visible, displaying the game mechanics content. This content should be distinct from what was shown on the front face.
    *   The notes section remains visible and usable regardless of which face of the card is shown.

*   **Notes Functionality:**
    *   Users can type their thoughts, questions, or ideas into the textarea within the notes section.
    *   Clicking the "Save Note" button associated with the textarea saves the current text to local storage, keyed by the game's title. The button provides feedback (e.g., changing text to "Saved!").
    *   These notes persist even if the user closes the modal or refreshes the page. When the modal for the same game is reopened, its saved note is automatically loaded into the textarea.

*   **Export Notes:**
    *   Clicking the "Export All Notes" button in the header opens a new overlay.
    *   This overlay displays a large textarea containing all notes from all games, formatted with game titles for clarity. Users can then select and copy this compiled text.

## Current Issue: Modal Flip Behavior

We are currently troubleshooting an issue with the flip behavior of the Game Card Modal:

*   **Problem Description:**
    *   When a game card modal is open (displaying its front face) and the user clicks it to flip to the back, the 3D flip animation (a 180-degree rotation around the Y-axis) executes as expected.
    *   However, instead of revealing the distinct content intended for the back face (i.e., the game mechanics), the modal displays what appears to be a **mirror image of the front face content**. The text and layout from the front face are visible but horizontally reversed.

*   **Status of Investigation:**
    *   **HTML Structure & Content Loading:**
        *   The HTML structure for the modal's front (`.modal-card-front`) and back (`.modal-card-back`) faces is in place.
        *   JavaScript correctly populates these two faces with distinct HTML content fetched from the corresponding elements of the clicked grid card. This has been verified by inspecting the `innerHTML` of these elements in the browser's developer tools when the modal is open.
    *   **CSS Properties:**
        *   The CSS properties generally considered essential for correct 3D card flip behavior appear to be correctly applied to the modal card elements:
            *   `perspective` is set on the `.modal-card-container`.
            *   `transform-style: preserve-3d` is set on the `.modal-card-inner` element (the direct parent of the front and back faces, which undergoes the rotation).
            *   `backface-visibility: hidden` is applied to both `.modal-card-front` and `.modal-card-back`.
            *   The `.modal-card-back` element has an initial `transform: rotateY(180deg)` to correctly orient it before the flip.
        *   These have been verified using browser developer tools (inspecting styles and computed values).
    *   **Troubleshooting Steps Taken:**
        *   An attempt was made to explicitly promote the card faces to their own compositing layer by adding `transform: translateZ(0);` to `.modal-card-front` and `.modal-card-back`. This did not resolve the issue.

*   **Current Hypothesis:**
    *   Despite the `backface-visibility: hidden` CSS rule being applied to the `.modal-card-front` element (as confirmed by developer tools), it is not effectively preventing the rendering of this element's back when it is rotated away from the viewer.
    *   The exact cause for this failure of `backface-visibility` is still under investigation. Potential causes could include a very subtle CSS conflict not yet identified, a browser-specific rendering quirk related to the specific combination of styles, structure, and animations, or an issue with the 3D rendering context that isn't immediately apparent.
