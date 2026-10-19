/**
 * Google Apps Script "backend" for the website's review system.
 * It reads and writes a single JSON file on Google Drive (your reviews data store),
 * so the static website can both DISPLAY reviews and let visitors POST new ones,
 * without needing a real server.
 *
 * ===================== ONE-TIME SETUP =====================
 * 1. Go to https://script.google.com and click "New project".
 * 2. Delete the default empty code, paste this ENTIRE file's contents in instead.
 * 3. Replace FILE_ID below with your reviews.json Google Drive file ID
 *    (the long string in the Drive share link between /d/ and /view).
 * 3b. Replace ADMIN_KEY below with a private password only you know — it's what lets you
 *     delete or spam-flag reviews from the site's "Manage reviews" toggle. Keep it secret;
 *     anyone who has it can moderate reviews.
 * 4. Click "Deploy" (top right) > "New deployment".
 * 5. Click the gear icon next to "Select type" > choose "Web app".
 * 6. Set "Execute as": Me (your account).
 * 7. Set "Who has access": Anyone.
 * 8. Click "Deploy". Google will ask you to authorize access to your Drive — approve it
 *    (this is required so the script can read/write the file; it only touches this one file).
 * 9. Copy the "Web app URL" shown after deploying — it looks like:
 *    https://script.google.com/macros/s/AKfycb.../exec
 * 10. Send that URL back — it gets pasted into REVIEWS_API_URL in assets/js/main.js.
 *
 * If you ever edit this script's code afterwards, you must create a NEW deployment
 * (or "Manage deployments" > edit > New version) for the changes to take effect —
 * the Web App URL stays the same either way.
 * ============================================================
 */

var FILE_ID = 'PASTE_YOUR_REVIEWS_JSON_FILE_ID_HERE';

// Change this to a private value only you know. Required to delete or spam-flag a review
// from the site's admin controls, so random visitors can't moderate reviews.
var ADMIN_KEY = 'PASTE_A_PRIVATE_ADMIN_KEY_HERE';

function readReviews_(file) {
  var reviews = [];
  try {
    reviews = JSON.parse(file.getBlob().getDataAsString());
    if (!Array.isArray(reviews)) reviews = [];
  } catch (err) {
    reviews = [];
  }
  // Older entries created before moderation existed have no id/status yet;
  // backfill them once so delete/spam actions have something stable to match on.
  var changed = false;
  reviews.forEach(function (r) {
    if (!r.id) { r.id = Utilities.getUuid(); changed = true; }
    if (!r.status) { r.status = 'active'; changed = true; }
  });
  if (changed) file.setContent(JSON.stringify(reviews, null, 2));
  return reviews;
}

function doGet(e) {
  var file = DriveApp.getFileById(FILE_ID);
  var reviews = readReviews_(file);
  var isAdmin = e && e.parameter && e.parameter.adminKey === ADMIN_KEY;
  // Public requests never see spam-flagged reviews; only an authenticated admin view can.
  var visible = isAdmin ? reviews : reviews.filter(function (r) { return r.status !== 'spam'; });
  return ContentService.createTextOutput(JSON.stringify(visible)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var file = DriveApp.getFileById(FILE_ID);
  var reviews = readReviews_(file);
  var data = JSON.parse(e.postData.contents);
  var action = data.action || 'add';

  if (action === 'spam' || action === 'delete') {
    if (data.adminKey !== ADMIN_KEY) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Invalid admin key' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var index = reviews.findIndex(function (r) { return r.id === data.id; });
    if (index === -1) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Review not found' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    if (action === 'delete') {
      reviews.splice(index, 1); // permanently removed
    } else {
      reviews[index].status = 'spam'; // hidden from public view, kept for the record
    }
    file.setContent(JSON.stringify(reviews, null, 2));
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var name = String(data.name || 'Anonymous Patient').slice(0, 80);
  var rating = Math.max(1, Math.min(5, Math.round(Number(data.rating) || 5)));
  var text = String(data.text || '').slice(0, 600);

  // Newest review first
  reviews.unshift({
    id: Utilities.getUuid(),
    status: 'active',
    name: name,
    rating: rating,
    text: text,
    date: new Date().toISOString()
  });

  file.setContent(JSON.stringify(reviews, null, 2));

  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
