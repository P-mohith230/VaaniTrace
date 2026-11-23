# Round 1 · Activity 2: Prompt Submission (746 Words)

Build a voice-first B2B commercial ledger prototype called VaaniTrace for Indian wholesale trade. Unlike conventional speech-to-text projects that treat speech as ephemeral text generation, VaaniTrace's signature breakthrough is 'Verifiable Acoustic Commitment Provenance': every extracted rate, quantity, and deadline is mathematically tethered to its source millisecond audio slice and character coordinates, backed by Section 65B (Indian Evidence Act) SHA-256 tamper-proof seals and closed-loop synthetic voice confirmation.

Your users and their languages:
Primary users are wholesale merchants, grain Mandi commission agents (arhatiyas), FMCG distributors, and billing clerks (munshis) in India's commercial trading hubs (such as Indore APMC mandi, Surat textile hub, Azadpur market). They operate in high-decibel loading docks, processing 80+ fast-paced deals every morning. They conduct business through 15 to 45-second phone calls and WhatsApp voice notes. They speak code-mixed vernacular—predominantly Hinglish (Hindi-English), Tanglish (Tamil-English), Gujarati-Hindi, and regional trade dialects—regularly using colloquial packaging units (such as 'bori', 'peti', 'katta', 'gaddi') and informal numbering ('sawa lakh', 'dedh hazar', 'pachees so').

The voice flow, step by step:
- Step 1 (Ingestion & Capture): The user uploads an authentic WhatsApp voice note or taps a high-contrast microphone button to capture speech. Sample raw input: 'Bhaiya Ramesh ji ko 40 bori basmati chawal bhej do, rate 3200 lagana, payment 15 din baad milegi, delivery Friday tak central warehouse pe karwana.'
- Step 2 (ASR & Provenance Anchoring): The system transcribes speech via an Indic speech engine and extracts key transaction entities (buyer: Ramesh, item: basmati rice, quantity: 40 bori, unit rate: ₹3,200, credit: 15 days, deadline: Friday, destination: central warehouse). Crucially, the system links each extracted entity to its exact source character slice [start_char, end_char] and millisecond acoustic bounding box [start_ms, end_ms].
- Step 3 (Indic Normalization & Math Derivation): A built-in trade normalizer translates informal packaging into statutory SI units (40 bori -> 40 Bags / 2,000 kg, HSN 1001) and calculates the deterministic financial total (40 bags × ₹3,200 = ₹1,28,000).
- Step 4 (Closed-Loop Synthetic Voice Readout): The platform synthesizes an immediate 10-second oral briefing using a natural Indic neural voice (e.g., Gnani Timbre) in the caller's regional accent: 'Order recorded for Ramesh: 40 bags of Basmati Rice at 3,200 rupees each, net total 1,28,000 rupees. Delivery requested by Friday to central warehouse with 15 days credit. Say or tap Confirm to commit this transaction to the ledger, or state your correction.'
- Step 5 (Voice Amendment or Statutory Commit): The user either taps 'Confirm', speaks 'Confirm', or issues an oral corrective amendment (e.g., 'Nahi, 40 nahi, 50 bori karo'). If corrected, the system captures the delta, updates quantity to 50, recalculates total to ₹1,60,000, and re-confirms. Once confirmed, it auto-generates a TallyPrime XML voucher, styled Excel (.xlsx), and an audit-ready legal certificate.

What the product says or shows back:
- Spoken Audio: A polite synthetic voice readout reciting the buyer, item, normalized packaging, unit price, computed total, and delivery deadline, inviting oral confirmation or correction.
- Visual Interface: A split-view web dashboard featuring:
  1) An interactive transcript with cross-highlighting: clicking any extracted data cell highlights and plays its exact source audio segment.
  2) A structured Purchase Order voucher showing verified entities, statutory HSN codes, and computed line-item values.
  3) Operational action items with assignees, delivery deadlines, and fulfillment statuses.
  4) 1-click accounting export buttons for TallyPrime XML, OpenPyXL-styled Excel (.xlsx), UTF-8 CSV, and an MSME Samadhaan SHA-256 cryptographic proof document.

Noise, accents, mixed languages and misheard input:
- High Mandi Noise: Engine applies bandpass frequency filtering (300Hz-3400Hz) to suppress ambient background sounds (forklifts, vehicle horns, crowd chatter).
- Phonetic Minimal Pairs & Numeric Disambiguation: Indian trade suffers constant auditory confusion between minimal pairs (fifteen vs fifty, 15 vs 50, pandrah vs pachas). If acoustic confidence drops below 85%, the field is tagged amber ('Needs Review'), and the readback voice proactively clarifies: 'Did you say fifteen or fifty bags? Please clarify.'
- Code-Mixing & Colloquial Slang: Normalizer translates dialect slang ('sawa teen hazar' -> ₹3,250; 'do peti' -> 2 boxes; 'chhe gaddi' -> 6 bales) into standardized numbers and metric weights.
- Missing Critical Entities: If a vital parameter (like unit rate or delivery date) is omitted, the system flags the gap and prompts verbally: 'Quantity recorded, but rate was not mentioned. What is the unit rate?'
- Forensic Dispute Replay: If a buyer later denies an agreement, merchants can run the Forensic Dispute Simulator to isolate the exact millisecond acoustic slice, analyze phonetic formant clarity, and verify the SHA-256 digital evidence seal to refute the contested claim.