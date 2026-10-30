// Add current year dynamically
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Track Telegram CTA clicks safely with Meta Pixel (Lead event)
let telegramLeadTracked = false;
document.querySelectorAll('a[href*="t.me/"]').forEach(function(link) {
  link.addEventListener("click", function() {
    try {
      if (!telegramLeadTracked && typeof fbq === "function") {
        telegramLeadTracked = true;
        fbq("track", "Lead", {
          content_name: "Telegram Join",
          content_category: "Lootera Deals",
          source: this.classList.contains("cta") ? "legal_page_topbar" : "legal_page_footer"
        });
      }
    } catch (err) {
      console.warn("Meta Pixel tracking notice:", err);
    }
  });
});