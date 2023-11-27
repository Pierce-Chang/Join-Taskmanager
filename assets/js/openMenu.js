/**
 * Opens the header menu by setting its display property to "flex".
 */
function openHeaderMenu() {
    document.getElementById("headerMenu").style.display = "flex";
  }
  
  /**
   * Listens for click events on the document and hides the header menu
   * if the click target is outside the menu and not the profile button.
   *
   * @param {Event} event - The click event object.
   */
  document.addEventListener("click", function (event) {
    if (!document.getElementById("headerMenu").contains(event.target) && event.target !== profileButton) {
      document.getElementById("headerMenu").style.display = "none";
    }
  });