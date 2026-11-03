# Forms (Design System v1.0)

- Field: label above (`caption`, `textSecondary`), 48 px input, radius 12, 1 px `border`; focus border `primary`; error border `danger` + message below.
- Required fields marked `*`. Validation wording comes from the ERP's server messages (same text as web).
- Amount: ₹ prefix, numeric keyboard, 2 decimals. Date: native picker, IST. Select: bottom-sheet picker with search for long lists.
- Attachments: "Take photo" / "Choose file" buttons, thumbnails, size + type limits shown (server checks magic bytes).
- Keyboard-aware scrolling; on long forms the submit button is sticky at the bottom.
- Submit shows loading and blocks double submit; on error the input is kept and the server message is shown at the top.
- Drafts are not stored on the phone in v1 (no offline write).
- **Voice instead of typing (CR-001, narrowed by CR-002):** `RemarkField` ("type or record") is used only on records whose ERP backend already stores voice notes (expense / payment requests and related accounts records). Other remark fields are text-only until the backend supports voice there.
