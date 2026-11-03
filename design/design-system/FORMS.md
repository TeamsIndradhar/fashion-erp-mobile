# Forms (Design System v1.0)

- Field: label above (`caption`, `textSecondary`), 48 px input, radius 12, 1 px `border`; focus border `primary`; error border `danger` + message below.
- Required fields marked `*`. Validation wording comes from the ERP's server messages (same text as web).
- Amount: ₹ prefix, numeric keyboard, 2 decimals. Date: native picker, IST. Select: bottom-sheet picker with search for long lists.
- Attachments: "Take photo" / "Choose file" buttons, thumbnails, size + type limits shown (server checks magic bytes).
- Keyboard-aware scrolling; on long forms the submit button is sticky at the bottom.
- Submit shows loading and blocks double submit; on error the input is kept and the server message is shown at the top.
- Drafts are not stored on the phone in v1 (no offline write).
- **Voice instead of typing (CR-001):** every remark/reason/description field is a `RemarkField` ("type or record") and every upload area offers a voice note next to photo/file. Approvers see and play the voice note on the detail screen.
